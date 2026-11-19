---
slug: artefactos
nivel: 6
nuevo: si
titulo: Páginas para compartir
bajada: Lo que Claude arma como página en claude.ai, privado hasta que lo compartís, y hasta editable desde la página misma.
---

Cuando algo es para otra persona (un informe, una auditoría, una propuesta), antes lo mandaba como archivo. Un `.md` adjunto que la otra persona abría en el bloc de notas, con los asteriscos a la vista. Ahora Claude lo publica como un **artefacto**: una página en claude.ai, privada hasta que yo la comparto desde el botón “Compartir”.

## Lo que gané

La auditoría que conté en [Auditar una web](auditar-web.html) salió así. La página tiene un índice, cada prompt con su botón de copiar, un botón para llevarse el documento entero en Markdown y una casilla de “Hecho” por bloque, que se recuerda en el navegador de quien la lee. La persona que la recibe no tiene que instalar nada ni saber qué es Markdown.

Después le pedí que se pudiera editar desde la página, para hacer los últimos retoques sin pasar por Claude. Ahora tiene un botón “Editar texto”, una vista previa y “Guardar y publicar”, que deja una versión nueva en el mismo link. Solo lo ve quien tiene permiso de edición.

## La fuente sigue siendo mía

La página la arma un script a partir de un `.md` que vive en mi carpeta. Eso tiene una consecuencia: si edito en la página, el archivo local queda viejo, y antes de volver a tocarlo hay que traer el texto de vuelta. Lo anoté en el Estado del proyecto, porque es exactamente el tipo de cosa que me olvido.

## Para qué más

- **Un design system.** Los colores, las tipografías y las piezas de una app, en una página que Claude lee antes de diseñar algo nuevo. Las piezas de Galera viven en un solo lugar, no en veinte artefactos sueltos.
- **Algo para mirar, no para editar**: un diagrama, una comparación, un tablero.
- **Lo que no**: notas para mí, texto que va a terminar en otro lado y cualquier cosa con datos de otras personas que no pidieron estar ahí.

```text
Convertí este documento en un artefacto para compartir con [quién lo va a leer]. Que tenga un índice, un botón para copiar cada prompt o bloque de código, otro para copiar el documento entero en Markdown y una casilla de “Hecho” por sección que se guarde solo en el navegador de quien lo lee. Que funcione en celular y en modo oscuro. La fuente sigue siendo el .md de mi carpeta: armá un script que genere la página a partir de él. Publicalo privado y pasame el link.
```
