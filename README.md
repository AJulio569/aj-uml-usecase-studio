# AJ UML UseCase Studio
<p align="center">
<img width="1536" height="1024" alt="fondo" src="https://github.com/user-attachments/assets/21b91204-61fe-4a64-a125-08bd2219378e" />
</p>
<p align="center">
  <strong>Genera diagramas de casos de uso UML automáticamente desde lenguaje natural</strong>
</p>

## Descripción

AJ UML UseCase Studio es una aplicación web educativa para crear diagramas de casos de uso UML a partir de actores y requerimientos escritos en lenguaje natural. Está pensada como herramienta de apoyo para análisis de requerimientos, modelado UML y presentaciones académicas o de portafolio.

La aplicación interpreta el texto ingresado, detecta actores, casos de uso y relaciones `<<include>>` / `<<extend>>`, y genera un diagrama visual exportable en SVG o PNG.

Es ideal para:

- Estudiantes de ingeniería de software
- Analistas de requerimientos
- Portafolios profesionales
  
## Demo

La demo del proyecto estará disponible en GitHub Pages:

```text
https://ajulio569.github.io/aj-uml-usecase-studio/
```

Repositorio oficial:

```text
https://github.com/AJulio569/aj-uml-usecase-studio
```

## Características

- Generación de diagramas de casos de uso desde texto.
- Parser propio en TypeScript para actores, casos de uso y relaciones.
- Renderizado SVG nativo con límite del sistema, actores y asociaciones.
- Soporte para relaciones `<<include>>` y `<<extend>>`.
- Modo educativo con notas basadas en conceptos de UML 2.5.1.
- Modo claro y oscuro.
- Exportación del diagrama como SVG o PNG.
- Interfaz responsive construida con React, Vite y Tailwind CSS.

## Vista General

Flujo principal de uso:

1. Escribir el nombre del sistema.
2. Ingresar los actores externos.
3. Describir los requerimientos o funcionalidades.
4. Revisar el diagrama generado automáticamente.
5. Exportar el resultado en SVG o PNG.

## Tecnologías

- React
- Vite
- TypeScript
- Tailwind CSS
- Lucide React
- SVG nativo

## Requisitos Previos

- Node.js 18 o superior.
- npm 9 o superior.

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/AJulio569/aj-uml-usecase-studio.git
cd aj-uml-usecase-studio
```

Instala las dependencias:

```bash
npm install
```

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Abre la aplicación en el navegador:

```text
http://127.0.0.1:5173
```

## Scripts Disponibles

```bash
npm run dev
```

Inicia el servidor local de desarrollo con Vite.

```bash
npm run build
```

Genera la versión de producción en la carpeta `dist`.

```bash
npm run preview
```

Sirve localmente la versión generada para producción.

## Estructura del Proyecto

```text
aj-uml-usecase-studio/
├── .github/workflows/
│   └── deploy.yml
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   └── useCaseParser.ts
├── ESPECIFICACIONES.md
├── LICENSE
├── MANUAL.md
├── README.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.js
```

## Ejemplo de Uso

Nombre del sistema:

```text
Registrar Producto
```

Actores:

```text
Cliente
Admin
```

Requerimientos:

```text
El cliente inicia sesion
El cliente paga y el sistema valida pago
El registro incluye validar email
El pago extiende a descuento
Admin gestiona usuarios
```

Resultado esperado:

- `Cliente` y `Admin` se representan como actores externos.
- `Inicia sesion`, `Paga`, `Valida pago`, `Registro`, `Validar email`, `Pago`, `Descuento` y `Gestiona usuarios` se representan como casos de uso.
- `Registro` se conecta con `Validar email` mediante `<<include>>`.
- `Descuento` extiende a `Pago` mediante `<<extend>>`.
- Todos los casos de uso quedan dentro del límite del sistema `Registrar Producto`.

## Despliegue En GitHub Pages

El proyecto incluye un workflow de GitHub Actions que compila la aplicación y publica `dist` en GitHub Pages cada vez que se actualiza la rama `main`.

Después de subir cambios a GitHub:

1. Entra a `Settings > Pages`.
2. En `Source`, selecciona `GitHub Actions`.
3. Revisa la pestaña `Actions` y confirma que el despliegue termine correctamente.
4. Abre la demo en `https://ajulio569.github.io/aj-uml-usecase-studio/`.

## Referencia UML

La aplicación toma como referencia la especificación UML 2.5.1 publicada por Object Management Group:

https://www.omg.org/spec/UML/2.5.1/

## Estado Del Proyecto

Versión inicial funcional para aprendizaje, demostraciones académicas y portafolio profesional.

## Autor

Desarrollado por Andres como proyecto educativo de análisis de requerimientos y modelado UML.

## Licencia

Este proyecto está publicado bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
