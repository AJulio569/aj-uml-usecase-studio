# Manual de Usuario

## AJ UML UseCase Studio

Este manual explica cómo utilizar AJ UML UseCase Studio para generar diagramas de casos de uso a partir de texto.

## 1. Acceso a la Aplicación

Después de instalar las dependencias y ejecutar el proyecto, abre el navegador en:

```text
http://127.0.0.1:5173
```

La pantalla principal muestra tres zonas:

- Panel de entrada.
- Lienzo del diagrama.
- Panel educativo con explicaciones UML.

## 2. Nombre del Sistema

En el campo `Nombre del sistema`, escribe el nombre del sistema que será modelado.

Ejemplo:

```text
Registrar Producto
```

Este nombre se mostrará en la parte superior del rectángulo que representa el límite del sistema.

## 3. Registro de Actores

En el área `Actores`, escribe un actor por línea.

Ejemplo:

```text
Cliente
Administrador
Invitado
```

Recomendaciones:

- Usa nombres cortos y claros.
- Escribe actores externos al sistema, no módulos internos.
- Evita escribir acciones en este campo.

Correcto:

```text
Cliente
Administrador
Proveedor
```

Incorrecto:

```text
Registrar cliente
Validar pago
Sistema de pagos
```

## 4. Registro de Requerimientos

En el área `Requerimientos / Funcionalidades`, escribe una funcionalidad por línea.

Ejemplo:

```text
El cliente inicia sesion
El cliente consulta productos
El administrador gestiona usuarios
```

La aplicación intentará identificar automáticamente:

- El actor mencionado.
- La acción principal.
- El caso de uso resultante.
- La relación UML correspondiente.

## 5. Asociaciones Simples

Una asociación simple se genera cuando un actor realiza una acción.

Entrada:

```text
El cliente inicia sesion
```

Resultado:

```text
Cliente -- Inicia sesion
```

En UML, esta línea indica que el actor participa o interactúa con ese caso de uso.

## 6. Reglas para `<<include>>`

Usa palabras como `incluye`, `include`, `requiere` o `usa` cuando una funcionalidad necesita ejecutar otra como parte de su comportamiento.

Entrada:

```text
El registro incluye validar email
```

Resultado:

```text
Registro ..> Validar email : <<include>>
```

Cuándo usarlo:

- Cuando el comportamiento incluido es obligatorio para completar el caso base.
- Cuando quieres reutilizar una funcionalidad común.
- Cuando varios casos de uso podrían compartir el mismo comportamiento.

Ejemplos:

```text
Comprar producto incluye validar pago
Crear cuenta incluye verificar correo
Generar factura requiere calcular impuestos
```

## 7. Reglas para `<<extend>>`

Usa palabras como `extiende`, `extend`, `extension` o `extensión` cuando una funcionalidad agrega comportamiento opcional o condicional.

Entrada:

```text
El pago extiende a descuento
```

Resultado conceptual:

```text
Descuento ..> Pago : <<extend>>
```

En UML, la dirección de `extend` va desde el caso de uso extensor hacia el caso de uso base extendido.

Cuándo usarlo:

- Cuando el comportamiento ocurre solo bajo una condición.
- Cuando representa una variación opcional.
- Cuando el caso base tiene sentido sin la extensión.

Ejemplos:

```text
El pago extiende a descuento
La compra extiende a aplicar cupon
La autenticacion extiende a recuperar contrasena
```

## 8. Generalización de Actores

El parser también reconoce expresiones básicas de herencia entre actores.

Entrada:

```text
Cliente premium hereda de Cliente
```

Resultado:

```text
Cliente premium --|> Cliente
```

Usa esta relación cuando un actor especializado conserva el comportamiento de otro actor más general.

## 9. Modo Educativo

El panel `Modo Educativo` muestra notas breves sobre cada relación generada.

Estas notas ayudan a comprender por qué una relación fue modelada como:

- Association.
- Include.
- Extend.
- Generalization.

El objetivo es reforzar el aprendizaje del estándar UML 2.5.1 durante la creación del diagrama.

## 10. Exportar el Diagrama

Haz clic en el boton `SVG` o `PNG` ubicado en la parte superior derecha, segun el formato que necesites.

La aplicacion descargara uno de estos archivos:

```text
uml-usecase-diagram.svg
uml-usecase-diagram.png
```

El archivo SVG puede abrirse en navegadores o editores vectoriales; el PNG puede incluirse directamente en documentos, presentaciones o entregas academicas.

## 11. Cambiar Tema

Usa el botón con icono de luna o sol para alternar entre modo claro y modo oscuro.

Este cambio solo afecta la visualización de la interfaz.

## 12. Restaurar Ejemplo

El botón `Restaurar ejemplo` vuelve a cargar datos de demostración para probar rápidamente la aplicación.

## 13. Buenas Prácticas de Escritura

Para obtener mejores resultados:

- Escribe un requerimiento por línea.
- Menciona el actor al inicio cuando sea posible.
- Usa verbos claros: registrar, consultar, pagar, validar, gestionar.
- Usa `incluye` solo para comportamiento requerido.
- Usa `extiende` solo para comportamiento opcional o condicional.
- Evita frases demasiado largas con muchas acciones mezcladas.

## 14. Ejemplo Completo

Actores:

```text
Cliente
Administrador
Pasarela de pago
```

Requerimientos:

```text
El cliente registra una cuenta
El registro incluye validar email
El cliente realiza compra
La compra incluye validar pago
El pago extiende a aplicar descuento
El administrador gestiona productos
```

Interpretación:

- `Cliente` se asocia con los casos principales de registro y compra.
- `Registro` incluye `Validar email`.
- `Compra` incluye `Validar pago`.
- `Aplicar descuento` extiende el comportamiento de `Pago`.
- `Administrador` se asocia con `Gestiona productos`.

