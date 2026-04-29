# Especificaciones de la Aplicación

## 1. Nombre del Proyecto

AJ UML UseCase Studio

## 2. Propósito

AJ UML UseCase Studio es una aplicación web de una sola página orientada al aprendizaje y prototipado de diagramas de casos de uso UML.

Su objetivo es transformar entradas textuales simples en un modelo visual que represente actores, casos de uso, límite del sistema y relaciones UML comunes.

## 3. Alcance

La aplicación cubre:

- Captura de actores.
- Captura de requerimientos funcionales.
- Inferencia básica de casos de uso.
- Detección de relaciones `association`, `include`, `extend` y `generalization`.
- Renderizado de diagrama UML en SVG.
- Visualización educativa de criterios UML.
- Exportacion del diagrama como SVG o PNG.

La aplicación no cubre en esta versión:

- Persistencia en base de datos.
- Autenticación de usuarios.
- Edición drag and drop del diagrama.
- Importación de archivos.
- Generación automática de documentación extensa de casos de uso.
- Validación formal completa del metamodelo UML.

## 4. Usuarios Objetivo

- Estudiantes de análisis y diseño de software.
- Docentes de UML e ingeniería de software.
- Analistas de requerimientos.
- Desarrolladores que necesiten prototipar diagramas de casos de uso.

## 5. Arquitectura General

La aplicación sigue una arquitectura frontend basada en componentes.

```text
Usuario
  |
  v
Interfaz React
  |
  v
Parser de requerimientos
  |
  v
Modelo interno de casos de uso
  |
  v
Renderizador SVG
  |
  v
Diagrama UML visible/exportable
```

## 6. Stack Tecnológico

| Capa | Tecnología |
| --- | --- |
| Interfaz | React |
| Build tool | Vite |
| Lenguaje | JavaScript / TypeScript |
| Estilos | Tailwind CSS |
| Iconos | Lucide React |
| Diagramas | SVG nativo |
| Empaquetado | npm |

## 7. Módulos Principales

### 7.1 `src/App.jsx`

Responsabilidades:

- Renderizar la interfaz principal.
- Gestionar estado de actores, requerimientos, nombre del sistema y tema visual.
- Invocar el parser.
- Mostrar el diagrama.
- Mostrar las tarjetas educativas.
- Exportar el diagrama como SVG o PNG.

Componentes internos relevantes:

- `Panel`
- `UseCaseDiagram`
- `RelationLine`
- `ActorNode`
- `UseCaseNode`

### 7.2 `src/useCaseParser.ts`

Responsabilidades:

- Recibir texto de actores y requerimientos.
- Normalizar entradas.
- Identificar actores existentes dentro de los requerimientos.
- Crear casos de uso.
- Crear relaciones UML.
- Generar advertencias cuando no se detecta actor explícito.

Tipos principales:

```ts
export type RelationKind = "association" | "include" | "extend" | "generalization";
```

```ts
export type ParsedUseCaseModel = {
  actors: Actor[];
  useCases: UseCase[];
  relations: Relation[];
  systemName: string;
  warnings: string[];
};
```

### 7.3 `src/styles.css`

Responsabilidades:

- Importar directivas base de Tailwind CSS.
- Configurar estilos globales mínimos.
- Asegurar comportamiento visual consistente para `body` y `textarea`.

## 8. Modelo de Datos

### Actor

```ts
type Actor = {
  id: string;
  name: string;
};
```

Representa una entidad externa que interactúa con el sistema.

### UseCase

```ts
type UseCase = {
  id: string;
  name: string;
};
```

Representa una funcionalidad observable ofrecida por el sistema.

### Relation

```ts
type Relation = {
  id: string;
  kind: RelationKind;
  from: string;
  to: string;
  note: string;
};
```

Representa una conexión semántica entre actores y casos de uso, o entre casos de uso.

## 9. Reglas de Parsing

### 9.1 Separación de Entradas

Los actores y requerimientos se separan por:

- Saltos de línea.
- Punto y coma.
- Comas.

### 9.2 Normalización

El parser:

- Elimina espacios duplicados.
- Normaliza mayúsculas y minúsculas.
- Remueve tildes para comparaciones internas.
- Genera identificadores estables para SVG.

### 9.3 Detección de Actores

Un actor se detecta cuando el texto de un requerimiento contiene el nombre de un actor registrado.

Ejemplo:

```text
Actor registrado: Cliente
Requerimiento: El cliente inicia sesion
```

Resultado:

```text
Actor detectado: Cliente
Caso de uso: Inicia sesion
```

### 9.4 Asociación

Se crea una asociación cuando un requerimiento menciona un actor y una acción.

Ejemplo:

```text
El usuario paga y el sistema valida
```

Resultado:

```text
Usuario -- Paga
Usuario -- Valida
```

### 9.5 Include

Palabras clave:

- `incluye`
- `include`
- `requiere`
- `usa`

Regla:

```text
Caso base incluye Caso incluido
```

Dirección:

```text
Caso base ..> Caso incluido : <<include>>
```

Ejemplo:

```text
El registro incluye validar email
```

Resultado:

```text
Registro ..> Validar email : <<include>>
```

### 9.6 Extend

Palabras clave:

- `extiende`
- `extend`
- `extension`
- `extensión`

Regla de entrada:

```text
Caso base extiende a Caso extensor
```

Dirección UML aplicada:

```text
Caso extensor ..> Caso base : <<extend>>
```

Ejemplo:

```text
El pago extiende a descuento
```

Resultado:

```text
Descuento ..> Pago : <<extend>>
```

### 9.7 Generalización

Palabras clave:

- `hereda de`
- `hereda`
- `especializa a`
- `es un tipo de`

Regla:

```text
Actor especializado hereda de Actor general
```

Resultado:

```text
Actor especializado --|> Actor general
```

## 10. Reglas de Renderizado UML

### 10.1 Actores

Los actores se renderizan como figuras humanas simples, ubicadas fuera del límite del sistema.

### 10.2 Subject / System Boundary

El sistema se representa como un rectángulo que contiene todos los casos de uso.


El ejemplo inicial usa `Registrar Producto` como nombre del sistema.

### 10.3 Casos de Uso

Cada caso de uso se representa como una elipse dentro del límite del sistema.

### 10.4 Asociaciones

Las asociaciones se representan con líneas sólidas entre actor y caso de uso.

### 10.5 Include y Extend

Las relaciones `include` y `extend` se representan con:

- Línea punteada.
- Flecha abierta.
- Etiqueta con estereotipo.

### 10.6 Generalización

La generalización se representa con una flecha triangular abierta.

## 11. Correspondencia con UML 2.5.1

La implementación toma como referencia la especificación UML 2.5.1 del Object Management Group.

Correspondencias usadas:

| Concepto | Aplicación |
| --- | --- |
| Actor | Stick figure externo |
| UseCase | Elipse dentro del sistema |
| Subject | Rectángulo de límite del sistema |
| Association | Línea sólida actor-caso de uso |
| Include | Dependencia punteada con `<<include>>` |
| Extend | Dependencia punteada con `<<extend>>` |
| Generalization | Flecha triangular abierta |

Referencias conceptuales:

- UML 2.5.1, capítulo 16: Use Cases.
- UML 2.5.1, sección 16.3.1: Actor.
- UML 2.5.1, sección 16.3.3: Extend.
- UML 2.5.1, sección 16.3.5: Include.
- UML 2.5.1, sección 16.3.6: UseCase.

Documento oficial: https://www.omg.org/spec/UML/2.5.1/

## 12. Requisitos Funcionales

| ID | Requisito | Estado |
| --- | --- | --- |
| RF-01 | Permitir ingresar actores | Implementado |
| RF-02 | Permitir ingresar requerimientos | Implementado |
| RF-03 | Detectar asociaciones simples | Implementado |
| RF-04 | Detectar relaciones `include` | Implementado |
| RF-05 | Detectar relaciones `extend` | Implementado |
| RF-06 | Renderizar actores como stick figures | Implementado |
| RF-07 | Renderizar límite del sistema | Implementado |
| RF-08 | Renderizar casos de uso como elipses | Implementado |
| RF-09 | Mostrar explicación educativa por relación | Implementado |
| RF-10 | Exportar diagrama como SVG | Implementado |
| RF-11 | Alternar modo claro/oscuro | Implementado |
| RF-12 | Exportar diagrama como PNG | Implementado |

## 13. Requisitos No Funcionales

| ID | Requisito | Descripción |
| --- | --- | --- |
| RNF-01 | Usabilidad | Interfaz clara, directa y educativa |
| RNF-02 | Rendimiento | Renderizado local sin llamadas a backend |
| RNF-03 | Portabilidad | Ejecutable en navegador moderno |
| RNF-04 | Mantenibilidad | Parser separado de la interfaz |
| RNF-05 | Accesibilidad básica | Uso de etiquetas, roles e iconos con descripción |
| RNF-06 | Responsividad | Layout adaptable a escritorio y pantallas medianas |

## 14. Decisiones de Diseño

### 14.1 SVG nativo en lugar de Mermaid

Se eligió SVG nativo porque permite controlar con precisión:

- Forma del actor.
- Posición del límite del sistema.
- Estilo de líneas UML.
- Flechas abiertas y triangulares.
- Etiquetas de estereotipo.

Mermaid es útil para diagramas rápidos, pero limita el control fino sobre la notación visual requerida.

### 14.2 Parser basado en reglas

El parser usa reglas explícitas en lugar de inteligencia artificial externa.

Ventajas:

- Funciona sin conexión.
- Es transparente y fácil de auditar.
- Es suficiente para frases educativas y requerimientos simples.
- Puede extenderse con nuevas palabras clave.

## 15. Limitaciones Conocidas

- El lenguaje natural soportado es básico.
- La detección de actores depende de que estén registrados previamente.
- No existe edición manual del diagrama luego de generado.
- El layout se calcula automáticamente y puede requerir mejoras para diagramas muy grandes.
- No se valida el metamodelo UML completo.

## 16. Posibles Mejoras Futuras

- Edición drag and drop de actores y casos de uso.
- Exportacion a PDF.
- Importación/exportación JSON del modelo.
- Modo avanzado para editar relaciones manualmente.
- Soporte multiidioma.
- Validaciones UML más estrictas.
- Generación de especificaciones textuales por caso de uso.
- Persistencia local con `localStorage`.

## 17. Criterios de Aceptación

La aplicación se considera funcional cuando:

- Permite ingresar actores y requerimientos.
- Genera casos de uso dentro del límite del sistema.
- Representa actores fuera del límite.
- Conecta actores y casos de uso mediante asociaciones.
- Representa `include` y `extend` con línea punteada, flecha abierta y estereotipo.
- Muestra notas educativas de las relaciones generadas.
- Permite descargar el diagrama en SVG o PNG.
- Compila correctamente con `npm run build`.

