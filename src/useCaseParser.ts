export type RelationKind = "association" | "include" | "extend" | "generalization";

export type Actor = {
  id: string;
  name: string;
};

export type UseCase = {
  id: string;
  name: string;
};

export type Relation = {
  id: string;
  kind: RelationKind;
  from: string;
  to: string;
  note: string;
};

export type ParsedUseCaseModel = {
  actors: Actor[];
  useCases: UseCase[];
  relations: Relation[];
  systemName: string;
  warnings: string[];
};

const UML_NOTES: Record<RelationKind, string> = {
  association:
    "UML 2.5.1, cap. 16.3.1 y 16.3.6: un Actor interactua externamente con el Subject mediante casos de uso.",
  include:
    "UML 2.5.1, cap. 16.3.5 Include: factoriza comportamiento comun requerido por el caso de uso base.",
  extend:
    "UML 2.5.1, cap. 16.3.3 Extend: agrega comportamiento opcional o condicional al caso de uso extendido.",
  generalization:
    "UML 2.5.1, cap. 9.9.7 y 16.3.1: la generalizacion permite especializar clasificadores, incluidos actores."
};

const CONNECTOR_WORDS =
  /\b(y|e|luego|despues|después|tambien|también|ademas|además|entonces)\b/gi;

const LEADING_ARTICLES =
  /^(el|la|los|las|un|una|unos|unas|al|del|a|que|se|sistema|el sistema|la aplicacion|la aplicación)\s+/i;

export function parseUseCaseInput(
  actorsInput: string,
  requirementsInput: string,
  systemName = "Sistema"
): ParsedUseCaseModel {
  const warnings: string[] = [];
  const actors = uniqueByName(splitLines(actorsInput).map(toTitleCase)).map((name) => ({
    id: toId("actor", name),
    name
  }));

  const actorNames = actors.map((actor) => actor.name);
  const useCaseMap = new Map<string, UseCase>();
  const relations: Relation[] = [];

  const addUseCase = (rawName: string): UseCase => {
    const name = toUseCaseName(rawName);
    const key = normalize(name);
    const existing = useCaseMap.get(key);
    if (existing) return existing;
    const useCase = { id: toId("uc", name), name };
    useCaseMap.set(key, useCase);
    return useCase;
  };

  const addRelation = (kind: RelationKind, from: string, to: string) => {
    if (!from || !to || from === to) return;
    const id = `${kind}-${from}-${to}`;
    if (relations.some((relation) => relation.id === id)) return;
    relations.push({ id, kind, from, to, note: UML_NOTES[kind] });
  };

  splitLines(requirementsInput).forEach((line) => {
    const actor = findActorInLine(line, actorNames);
    const explicit = parseExplicitRelation(line);

    if (explicit) {
      const base = addUseCase(explicit.base);
      const target = addUseCase(explicit.target);

      if (explicit.kind === "include") {
        addRelation("include", base.id, target.id);
        if (actor) addRelation("association", toId("actor", actor), base.id);
      }

      if (explicit.kind === "extend") {
        // UML Extend points from the extending use case to the extended base use case.
        addRelation("extend", target.id, base.id);
        if (actor) addRelation("association", toId("actor", actor), base.id);
      }

      if (explicit.kind === "generalization") {
        addRelation("generalization", toId("actor", explicit.base), toId("actor", explicit.target));
      }

      return;
    }

    const inferredUseCases = inferUseCases(line, actor);
    inferredUseCases.forEach((name) => {
      const useCase = addUseCase(name);
      if (actor) addRelation("association", toId("actor", actor), useCase.id);
    });

    if (!actor && inferredUseCases.length > 0) {
      warnings.push(`No se encontro actor explicito en: "${line}"`);
    }
  });

  return {
    actors,
    useCases: Array.from(useCaseMap.values()),
    relations,
    systemName,
    warnings
  };
}

function splitLines(value: string): string[] {
  return value
    .split(/[\n;,]+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function uniqueByName(values: string[]): string[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = normalize(value);
    if (!value || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function findActorInLine(line: string, actors: string[]): string | undefined {
  const normalizedLine = normalize(line);
  return actors.find((actor) => normalizedLine.includes(normalize(actor)));
}

function parseExplicitRelation(line: string) {
  const normalizedLine = line.trim();
  const includeMatch = normalizedLine.match(/^(.+?)\s+(incluye|include|requiere|usa)\s+(.+)$/i);
  if (includeMatch) {
    return { kind: "include" as const, base: includeMatch[1], target: includeMatch[3] };
  }

  const extendMatch = normalizedLine.match(/^(.+?)\s+(extiende|extend|extension|extensión)\s+(a\s+)?(.+)$/i);
  if (extendMatch) {
    return { kind: "extend" as const, base: extendMatch[1], target: extendMatch[4] };
  }

  const inheritsMatch = normalizedLine.match(/^(.+?)\s+(hereda de|hereda|especializa a|es un tipo de)\s+(.+)$/i);
  if (inheritsMatch) {
    return { kind: "generalization" as const, base: toTitleCase(inheritsMatch[1]), target: toTitleCase(inheritsMatch[3]) };
  }

  return null;
}

function inferUseCases(line: string, actor?: string): string[] {
  const withoutActor = actor ? removeFirstOccurrence(line, actor) : line;
  const cleaned = withoutActor
    .replace(/\b(el|la)\s+sistema\b/gi, "")
    .replace(/\bpuede|pueden|debe|deben|permite|permitir|necesita|quiere\b/gi, "")
    .replace(CONNECTOR_WORDS, "|");

  return cleaned
    .split("|")
    .map(toUseCaseName)
    .filter((name) => name.length > 2);
}

function removeFirstOccurrence(value: string, fragment: string): string {
  return value.replace(new RegExp(escapeRegExp(fragment), "i"), "");
}

function toUseCaseName(value: string): string {
  const compact = value
    .trim()
    .replace(/[.。]+$/g, "")
    .replace(LEADING_ARTICLES, "")
    .replace(/\s+/g, " ");
  return toSentenceCase(compact);
}

function toSentenceCase(value: string): string {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function toTitleCase(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function toId(prefix: string, value: string): string {
  return `${prefix}_${normalize(value).replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}`;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
