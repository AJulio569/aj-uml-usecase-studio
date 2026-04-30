import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Braces,
  Download,
  Moon,
  RefreshCw,
  Sun,
  TriangleAlert
} from "lucide-react";
import { parseUseCaseInput } from "./useCaseParser";

const DEFAULT_ACTORS = "Cliente\nAdmin";
const DEFAULT_REQUIREMENTS = `El cliente inicia sesion
El cliente paga y el sistema valida pago
El registro incluye validar email
El pago extiende a descuento
Admin gestiona usuarios`;

export default function App() {
  const [actorsInput, setActorsInput] = useState(DEFAULT_ACTORS);
  const [requirementsInput, setRequirementsInput] = useState(DEFAULT_REQUIREMENTS);
  const [systemName, setSystemName] = useState("Registrar Producto");
  const [darkMode, setDarkMode] = useState(false);

  const model = useMemo(
    () => parseUseCaseInput(actorsInput, requirementsInput, systemName),
    [actorsInput, requirementsInput, systemName]
  );
  const educationalNotes = useMemo(() => {
    const notes = new Map();
    model.relations.forEach((relation) => {
      if (!notes.has(relation.kind)) {
        notes.set(relation.kind, relation);
      }
    });
    return Array.from(notes.values());
  }, [model.relations]);

  return (
    <main className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-paper text-ink transition dark:bg-slate-950 dark:text-slate-100">
        <header className="border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-cyanInk dark:text-cyan-300">
                UML 2.5.1
              </p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">UML UseCase Builder</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-cyanInk hover:text-cyanInk dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                aria-label="Alternar tema"
                title="Alternar tema"
                onClick={() => setDarkMode((value) => !value)}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                className="inline-flex h-10 items-center gap-2 rounded-md bg-cyanInk px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-800"
                onClick={() => downloadSvg("uml-usecase-diagram")}
              >
                <Download size={17} />
                SVG
              </button>
              <button
                className="inline-flex h-10 items-center gap-2 rounded-md bg-cyanInk px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-800"
                onClick={() => downloadPng("uml-usecase-diagram")}
              >
                <Download size={17} />
                PNG
              </button>
            </div>
          </div>
        </header>

        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[390px_1fr] lg:px-6">
          <aside className="space-y-4">
            <Panel title="Entrada" icon={<Braces size={18} />}>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Nombre del sistema
              </label>
              <input
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyanInk focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-cyan-900"
                value={systemName}
                onChange={(event) => setSystemName(event.target.value)}
              />

              <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Actores
              </label>
              <textarea
                className="mt-2 h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-6 outline-none transition focus:border-cyanInk focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-cyan-900"
                value={actorsInput}
                onChange={(event) => setActorsInput(event.target.value)}
              />

              <label className="mt-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Requerimientos / Funcionalidades
              </label>
              <textarea
                className="mt-2 h-56 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-6 outline-none transition focus:border-cyanInk focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-cyan-900"
                value={requirementsInput}
                onChange={(event) => setRequirementsInput(event.target.value)}
              />

              <button
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyanInk hover:text-cyanInk dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                onClick={() => {
                  setActorsInput(DEFAULT_ACTORS);
                  setRequirementsInput(DEFAULT_REQUIREMENTS);
                }}
              >
                <RefreshCw size={16} />
                Restaurar ejemplo
              </button>
            </Panel>

            <Panel title="Modo Educativo" icon={<BookOpen size={18} />}>
              <div className="space-y-3">
                {educationalNotes.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Genera relaciones al escribir requerimientos.
                  </p>
                ) : (
                  educationalNotes.map((relation) => (
                    <div
                      key={relation.kind}
                      className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                    >
                      <p className="font-semibold capitalize text-slate-800 dark:text-slate-100">
                        {relation.kind}
                      </p>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">{relation.note}</p>
                    </div>
                  ))
                )}
              </div>
            </Panel>

            {model.warnings.length > 0 && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
                <div className="flex items-center gap-2 font-semibold">
                  <TriangleAlert size={17} />
                  Observaciones
                </div>
                <ul className="mt-2 space-y-1">
                  {model.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          <section className="min-h-[680px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <UseCaseDiagram model={model} />
          </section>
        </section>
      </div>
    </main>
  );
}

function Panel({ title, icon, children }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
        {icon}
        <h2 className="text-base font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function UseCaseDiagram({ model }) {
  const layout = useMemo(() => createLayout(model), [model]);

  return (
    <svg
      id="uml-usecase-diagram"
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className="h-full min-h-[680px] w-full bg-white dark:bg-slate-900"
      role="img"
      aria-label="Diagrama de casos de uso UML"
    >
      <defs>
        <marker id="open-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </marker>
        <marker id="triangle-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
          <path d="M 1 1 L 9 5 L 1 9 Z" fill="white" stroke="currentColor" strokeWidth="1.4" />
        </marker>
      </defs>

      <rect x="210" y="50" width={layout.boundaryWidth} height={layout.boundaryHeight} rx="0" className="fill-slate-50 stroke-slate-400 dark:fill-slate-950 dark:stroke-slate-600" strokeWidth="2" />
      <text x="230" y="82" className="fill-slate-700 text-[18px] font-bold dark:fill-slate-100">
        {model.systemName || "Sistema"}
      </text>

      {model.relations.map((relation) => (
        <RelationLine key={relation.id} relation={relation} layout={layout} />
      ))}

      {layout.actors.map((actor) => (
        <ActorNode key={actor.id} actor={actor} />
      ))}

      {layout.useCases.map((useCase) => (
        <UseCaseNode key={useCase.id} useCase={useCase} />
      ))}
    </svg>
  );
}

function RelationLine({ relation, layout }) {
  const from = layout.nodeMap.get(relation.from);
  const to = layout.nodeMap.get(relation.to);
  if (!from || !to) return null;

  const p1 = anchorPoint(from, to);
  const p2 = anchorPoint(to, from);
  const middleX = (p1.x + p2.x) / 2;
  const middleY = (p1.y + p2.y) / 2;
  const dashed = relation.kind === "include" || relation.kind === "extend";
  const marker = relation.kind === "generalization" ? "url(#triangle-arrow)" : dashed ? "url(#open-arrow)" : undefined;

  return (
    <g className="text-slate-700 dark:text-slate-200">
      <line
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke="currentColor"
        strokeWidth={relation.kind === "association" ? 2 : 1.8}
        strokeDasharray={dashed ? "7 6" : undefined}
        markerEnd={marker}
      />
      {dashed && (
        <text
          x={middleX}
          y={middleY - 8}
          textAnchor="middle"
          className="fill-slate-700 text-[14px] font-semibold dark:fill-slate-100"
        >
          {relation.kind === "include" ? "<<include>>" : "<<extend>>"}
        </text>
      )}
    </g>
  );
}

function ActorNode({ actor }) {
  return (
    <g transform={`translate(${actor.x}, ${actor.y})`} className="text-slate-800 dark:text-slate-100">
      <circle cx="0" cy="-34" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="-22" x2="0" y2="18" stroke="currentColor" strokeWidth="2" />
      <line x1="-24" y1="-8" x2="24" y2="-8" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="18" x2="-20" y2="48" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="18" x2="20" y2="48" stroke="currentColor" strokeWidth="2" />
      <text x="0" y="76" textAnchor="middle" className="fill-slate-800 text-[15px] font-semibold dark:fill-slate-100">
        {actor.name}
      </text>
    </g>
  );
}

function UseCaseNode({ useCase }) {
  return (
    <g transform={`translate(${useCase.x}, ${useCase.y})`}>
      <ellipse cx="0" cy="0" rx={useCase.rx} ry="38" className="fill-white stroke-cyanInk dark:fill-slate-900 dark:stroke-cyan-300" strokeWidth="2" />
      <text textAnchor="middle" className="fill-slate-800 text-[14px] font-semibold dark:fill-slate-100">
        {wrapLabel(useCase.name).map((line, index, lines) => (
          <tspan key={line} x="0" y={(index - (lines.length - 1) / 2) * 17 + 5}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function createLayout(model) {
  const width = 1160;
  const boundaryWidth = 880;
  const boundaryHeight = Math.max(560, 150 + Math.ceil(model.useCases.length / 2) * 150);
  const height = Math.max(680, boundaryHeight + 100);
  const nodeMap = new Map();

  const actors = model.actors.map((actor, index) => {
    const y = 170 + index * 160;
    const node = { ...actor, x: 110, y, width: 90, height: 130, type: "actor" };
    nodeMap.set(actor.id, node);
    return node;
  });

  const columns = 2;
  const useCases = model.useCases.map((useCase, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const rx = Math.max(92, Math.min(145, useCase.name.length * 5.8));
    const node = {
      ...useCase,
      x: 390 + column * 360,
      y: 165 + row * 145,
      rx,
      width: rx * 2,
      height: 76,
      type: "useCase"
    };
    nodeMap.set(useCase.id, node);
    return node;
  });

  return { width, height, boundaryWidth, boundaryHeight, actors, useCases, nodeMap };
}

function anchorPoint(from, to) {
  if (from.type === "actor") {
    return { x: from.x + 34, y: from.y + 5 };
  }

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const scale = 1 / Math.sqrt((dx * dx) / (from.rx * from.rx) + (dy * dy) / (38 * 38));
  return { x: from.x + dx * scale, y: from.y + dy * scale };
}

function wrapLabel(value) {
  const words = value.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > 21 && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function downloadSvg(id) {
  const svg = document.getElementById(id);
  if (!svg) return;
  const blob = new Blob([serializeSvg(svg)], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "uml-usecase-diagram.svg";
  link.click();
  URL.revokeObjectURL(url);
}

function downloadPng(id) {
  const svg = document.getElementById(id);
  if (!svg) return;

  const { width, height } = svg.viewBox.baseVal;
  const data = serializeSvg(svg);
  const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    URL.revokeObjectURL(url);

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "uml-usecase-diagram.png";
    link.click();
  };

  image.src = url;
}

function serializeSvg(svg) {
  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  inlineSvgStyles(svg, clone);
  addExportBackground(svg, clone);
  return new XMLSerializer().serializeToString(clone);
}

function addExportBackground(source, target) {
  const { width, height } = source.viewBox.baseVal;
  const styles = window.getComputedStyle(source);
  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");

  background.setAttribute("x", "0");
  background.setAttribute("y", "0");
  background.setAttribute("width", String(width));
  background.setAttribute("height", String(height));
  background.setAttribute("fill", styles.backgroundColor || "#ffffff");

  target.insertBefore(background, target.firstChild);
}

function inlineSvgStyles(source, target) {
  const sourceNodes = [source, ...source.querySelectorAll("*")];
  const targetNodes = [target, ...target.querySelectorAll("*")];

  sourceNodes.forEach((sourceNode, index) => {
    const styles = window.getComputedStyle(sourceNode);
    targetNodes[index].setAttribute(
      "style",
      [
        `color:${styles.color}`,
        `fill:${styles.fill}`,
        `stroke:${styles.stroke}`,
        `stroke-width:${styles.strokeWidth}`,
        `stroke-dasharray:${styles.strokeDasharray}`,
        `font-family:${styles.fontFamily}`,
        `font-size:${styles.fontSize}`,
        `font-weight:${styles.fontWeight}`
      ].join(";")
    );
  });
}
