---
slug: equipos
nivel: 3
titulo: Claude en varias computadoras
bajada: Una PC que hace de servidor, la notebook para trabajar y el celular para dar órdenes.
---

Trabajo en una notebook, tengo una PC de escritorio en casa y vivo con el celular en la mano. Durante un tiempo, cada uno tenía su propia versión de mis proyectos, y yo era el cable que los unía (un cable bastante distraído). Ahora estoy armando un sistema para que funcionen como uno solo. No está terminado; cuento lo que ya anda.

## La PC como servidor

La PC de escritorio queda prendida y sin suspensión. Ahí corren las [tareas programadas](tareas.html), que necesitan la app abierta, y ahí van a vivir los backups.

## Las carpetas sincronizadas

La carpeta de proyectos se sincroniza entre la notebook y la PC con Syncthing, un programa libre que copia los cambios de una a otra sin pasar por la nube. Guarda versiones de los archivos durante treinta días y tiene una lista de lo que no se sincroniza (entornos de Python, archivos temporales).

Para que Claude Code no se confunda, las dos computadoras usan el mismo usuario y la carpeta de proyectos está en la misma ruta. La memoria de Claude está atada a esa ruta, y así coincide en los dos equipos. Los repositorios viajan con su carpeta `.git` y GitHub sigue siendo el remoto, con una regla: no editar el mismo repositorio en las dos computadoras a la vez.

## El celular como control remoto

Con Remote Control, la sesión de Claude que corre en la PC se maneja desde el celular o desde cualquier navegador. Le pido algo desde la calle y lo hace en la computadora de casa, con todos mis archivos. Para conectarme a la PC desde afuera uso Tailscale, una red privada entre mis equipos.

## Sincronizar no es hacer backup

Esto es lo más importante de la tarjeta. Si borro un archivo en la notebook, Syncthing lo borra en la PC; si un archivo se corrompe, se copia corrompido. Prolijamente. Un backup de verdad sigue la regla 3-2-1: tres copias, en dos soportes distintos, una fuera de casa. El mío va a ser la PC, un disco externo y la nube, con un programa que guarda versiones y cifra antes de subir. Lo sensible (el trabajo y lo personal) va solo al disco.

Y una advertencia que me tocó: el Estado de este proyecto decía que las dos computadoras estaban sincronizadas al cien por ciento. La PC no tenía nada. Lo anoté como error en el [registro de calidad](calidad.html), y la revisión semanal va a comparar el estado real con el que está escrito.

```text
Quiero que mis proyectos funcionen en [mis equipos]. Proponé un plan por etapas: cuál hace de servidor, cómo se sincronizan las carpetas (misma ruta y usuario en todos, para que coincida la memoria de Claude), cómo controlo Claude desde el celular y cómo armo un backup 3-2-1 que no dependa de la sincronización. Nada automático borra archivos en ningún equipo. Marcá con “(verificar)” todo lo que no sepas con certeza, como precios o menús de configuración.
```
