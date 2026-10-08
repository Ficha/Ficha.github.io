---
slug: calidad
nivel: 3
titulo: Calidad sin papeleo
bajada: Qué significa “terminado”, un registro de errores y una revisión semanal que corre sola.
---

Con dieciséis proyectos y Claude haciendo buena parte del trabajo, empezaron a escaparse errores: un apunte publicado con un dato viejo, rutas rotas después de una migración, un Estado que decía algo que no era cierto. Ninguno grave, pero todos del mismo tipo: nadie había definido cuándo algo estaba terminado ni qué hacer cuando no.

Armé un sistema de calidad mínimo, con tres archivos y una regla: si una pieza no se usa en un mes, se saca.

## 1. Qué significa “terminado”

Una tabla corta, por tipo de entregable. Algunos ejemplos de la mía:

- **Texto firmado**: pasó la [skill de corrección](skills.html), está en mi voz y lo aprobé yo.
- **Código**: las pruebas en verde, el cambio con descripción, la versión en el `CHANGELOG.md` y su etiqueta.
- **Normativa y datos**: cada dato tiene una fuente oficial con link y fecha, y un segundo paso lo verificó contra esa fuente.
- **Tarea programada**: su resumen dice qué hizo, y no envió, publicó ni borró nada fuera de lo permitido.

Cada [archivo de proyecto](proyectos.html) la nombra en una línea; no se copia.

## 2. Un registro de errores

Todo error que llega a un archivo, una tarea o un entregable se anota en una línea: fecha, proyecto, qué pasó, causa, corrección, qué cambia para que no se repita y si está abierto o cerrado. Los errores de redacción no van ahí, sino a la lista de errores frecuentes de mi hoja de estilo.

La columna que importa es la de “qué cambia”. De la [migración de carpetas](carpetas.html) salieron tres reglas: los lotes que escriben van de a uno, los reemplazos con barras invertidas van por script y nunca por el shell, y antes de correr un script que escribe hay que leer cómo se usa.

La regla está en mi [archivo general](contexto-general.html), así que Claude la sigue solo: cuando se equivoca, lo anota.

## 3. Riesgos y proveedores

Una página con lo que puede salir mal y qué hago si pasa: un borrado que se propaga entre computadoras, la PC servidor que se rompe, las tareas que necesitan la app abierta, el cupo de cada conector, la cuota semanal.

## Lo que viene: la revisión de los miércoles

La parte que todavía estoy armando es la automática: un script que no gasta tokens y revisa que las rutas existan, que ningún Estado tenga más de un mes, qué pruebas fallan y cuándo fue el último backup; y una [tarea](tareas.html) de los miércoles a la noche que lo corre, escribe un borrador con un semáforo por proyecto y le pasa los números al [newsletter](newsletter.html) del día siguiente.

```text
Armá un sistema de calidad mínimo para mis proyectos con las plantillas CRITERIOS.md y NO-CONFORMIDADES.md que te adjunto. Primero proponé los criterios de “terminado” para cada tipo de entregable que tengo. Después revisá mis archivos de contexto y skills: cuáles pasan los 3 KB, qué Estados tienen más de dos semanas, qué rutas no existen y qué instrucciones se repiten. Anotá como no conformidad cada error que encuentres, con su causa y una prevención. Proponé todo como diff y no guardes nada sin que lo apruebe.
```
