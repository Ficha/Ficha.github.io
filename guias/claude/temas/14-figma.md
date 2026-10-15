---
slug: figma
nivel: 3
nuevo: si
titulo: Figma con 20 llamadas
bajada: El plan gratuito da veinte llamadas por mes. Se me fueron en un día, y esto aprendí para la próxima.
---

Conecté Figma a Claude para pasar el sistema visual de mi sitio a un archivo de diseño y, de paso, armar un carrusel para Instagram. Funciona. El plan Starter, el gratuito, permite 20 llamadas por mes, y cuentan igual las que leen que las que escriben. Se me fueron todas en un día, con el carrusel.

No lo vi venir: mirar el archivo es una llamada, dibujar es otra y sacar una captura para ver cómo quedó es otra más. Veinte llamadas son pocas si las usás para chequear y alcanzan bastante si las usás para construir. (Los planes pagos dan 200 por día, por si te sobra la plata.)

## Qué cambié

Tres reglas, anotadas en la carpeta del proyecto:

- **Pocos scripts, grandes.** En lugar de una llamada por botón, una llamada que arma un componente entero con sus variantes. Cuesta más pensarla, pero se paga una sola vez.
- **Nada de llamadas de verificación.** “A ver si quedó bien” es una llamada gastada. Si el script está bien escrito, quedó bien; y si no, lo vas a ver igual cuando abras el archivo.
- **La captura va adentro.** Pedirle una captura de pantalla es otra llamada, salvo que la función `screenshot()` se ejecute dentro del mismo script que dibuja. Así la vista previa viaja con el trabajo y no cuesta una más.

Con esas reglas, el plan para pasar todo el sistema visual quedó en tres llamadas y dos de reserva. Sobre el papel. Todavía no lo pude probar, porque el cupo no se renovó.

## Lo que quedó a medias

El sistema visual no entró en esa tanda y espera a que se renueve el cupo. Lo anoto sin vergüenza: es lo que pasa cuando un recurso tiene tope y uno no lo había mirado. Lo mismo me pasó con la cuota de Claude, que cuento en [la semana que me quedé sin cuota](sin-cuota.html).

## Una alternativa sin IA

Antes de gastar llamadas, preguntate si lo que necesitás es Figma. Para piezas simples, como una imagen para redes o el mismo carrusel, terminé armando un editor local que corre en el navegador y exporta PNG. No tiene tope y, una vez escrito, no gasta nada de Claude. Figma queda para lo que de verdad pide un archivo de diseño compartido.

Es la misma lógica de [los hábitos](habitos.html): lo que se repite y tiene reglas va en un script, y la IA se reserva para lo que pide criterio.

```text
Vamos a trabajar en Figma con un cupo de 20 llamadas por mes. Antes de usar ninguna, armá un plan numerado de cuántas necesitaríamos, agrupando todo lo que se pueda en scripts grandes. No hagas llamadas solo para verificar. Si hace falta una captura, pedila dentro del mismo script que dibuja. Decime también qué piezas se podrían resolver sin Figma, con un editor local que exporte a PNG. Mostrame el plan y no uses ninguna llamada hasta que lo apruebe.
```
