---
slug: seguridad
nivel: 5
nuevo: si
titulo: Una revisión de seguridad
bajada: Un repaso de todos mis proyectos con Claude, y lo que encontró en apps que hice yo.
---

Cuando una app la hacés vos con Claude, la seguridad es tuya. No hay un equipo que la revise antes de publicar: estás vos, Claude y una tarde. Mis apps son chicas (un diario, un juego de misiones, una app para la carrera, este sitio), pero tienen datos de otras personas, y eso ya alcanza para tomárselo en serio.

El 14 de noviembre le pedí a Claude una revisión de todos mis proyectos. Encontró cosas en cinco.

## Lo que encontró

- **Un panel local que aceptaba cualquier pedido.** Una herramienta mía para limpiar carpetas recibía órdenes de cualquier origen. Ahora exige que el pedido venga de la propia página, en el formato esperado, y revisa a qué dirección llega.
- **Scripts escritos dentro del HTML.** Si una página permite código en línea, un texto inyectado puede ejecutarse. La solución es una política de seguridad de contenidos (CSP, por su sigla en inglés) que solo acepte los scripts propios.
- **Acciones de GitHub sin fijar.** Los flujos que publican el sitio usaban versiones que su autor podía cambiar por debajo. La corrección es apuntar a una versión exacta.

El primer arreglo ya está publicado. Los otros dos están en una rama, sin publicar: antes quiero probar a mano las apps que tocan.

## Secretos fuera del backup

Tengo un backup diario de mis proyectos en un repositorio privado. Antes de cada copia, un freno busca contraseñas y claves en lo que va a subir; si encuentra una, no sube nada. Además, el backup deja afuera las transcripciones de Claude y los archivos de configuración con claves. Que el repositorio sea privado no es excusa: privado no quiere decir seguro.

## Cómo pedirla

- Primero, solo lectura. Que liste hallazgos con gravedad, archivo y línea, sin tocar nada.
- Arreglar de a uno, cada arreglo en su rama y en una carpeta aparte (un *worktree*), para no pisar otras sesiones.
- Para lo que cambiaste hace poco está `/security-review`, que revisa los cambios pendientes de la rama antes de publicarlos.

```text
Hacé una revisión de seguridad de este proyecto, solo de lectura. Buscá: formularios o servidores que acepten pedidos de cualquier origen, código en línea que permita inyectar scripts, claves o contraseñas en el repositorio o en el historial, dependencias y acciones de GitHub sin versión fija, y datos de personas que se guarden sin necesidad. Para cada hallazgo, decime la gravedad (alta, media o baja), el archivo, la línea y una corrección propuesta. No cambies nada todavía; después los arreglamos de a uno, cada uno en su rama.
```
