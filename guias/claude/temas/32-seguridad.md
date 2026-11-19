---
slug: seguridad
nivel: 5
nuevo: si
titulo: Una revisión de seguridad
bajada: Cómo le pido a Claude que revise mis proyectos, qué conviene buscar y qué no conviene contar.
---

Cuando una app la hacés vos con Claude, la seguridad es tuya. No hay un equipo que la revise antes de publicar: estás vos, Claude y una tarde. Mis apps son chicas (un diario, un juego de misiones, una app para la carrera, este sitio), pero tienen datos de otras personas, y eso ya alcanza para tomárselo en serio.

Así que de vez en cuando le pido a Claude una revisión de todos mis proyectos. La primera vez encontró cosas en cinco. Ninguna grave, todas de las que se arreglan en una tarde si alguien las mira.

## Qué buscar

- **Pedidos de cualquier origen.** Un formulario o un servidor local que acepta órdenes de cualquier página, cuando solo debería aceptarlas de la propia.
- **Código en línea.** Si una página permite scripts escritos dentro del HTML, un texto inyectado puede ejecutarse. Para eso existe la política de seguridad de contenidos (CSP, por su sigla en inglés), que solo deja correr los scripts propios.
- **Claves y contraseñas** en el repositorio o en su historial. Borrarlas del archivo no alcanza: si estuvieron en un commit, hay que cambiarlas.
- **Versiones sin fijar.** Dependencias y acciones de GitHub que su autor puede cambiar por debajo.
- **Datos que no hace falta guardar.** El dato más seguro es el que no tenés.

## Cómo pedirla

- Primero, solo lectura. Que liste los hallazgos con gravedad, archivo y línea, sin tocar nada.
- Arreglar de a uno, cada arreglo en su rama y en una carpeta aparte (un *worktree*), para no pisar otras sesiones.
- Para lo que cambiaste hace poco está `/security-review`, que revisa los cambios pendientes de una rama antes de publicarlos.

## Las copias también cuentan

Si hacés copias automáticas de tus proyectos, que un freno busque claves y contraseñas en lo que va a subir, y que no suba nada si encuentra una. Que el destino sea privado no es excusa: privado no quiere decir seguro.

## Lo que no se cuenta

Esta tarjeta no dice qué encontró Claude en mis proyectos ni qué falta arreglar. No es pudor. Un hallazgo abierto contado en público es una invitación. Los hallazgos van a un archivo privado y se cuentan, si acaso, cuando ya están cerrados y no dicen nada útil para nadie con malas intenciones.

```text
Hacé una revisión de seguridad de este proyecto, solo de lectura. Buscá: formularios o servidores que acepten pedidos de cualquier origen, código en línea que permita inyectar scripts, claves o contraseñas en el repositorio o en el historial, dependencias y acciones de GitHub sin versión fija, y datos de personas que se guarden sin necesidad. Para cada hallazgo, decime la gravedad (alta, media o baja), el archivo, la línea y una corrección propuesta. Anotalos en un archivo que no se publique. No cambies nada todavía; después los arreglamos de a uno, cada uno en su rama.
```
