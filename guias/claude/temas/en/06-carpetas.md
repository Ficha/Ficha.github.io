---
slug: carpetas
nivel: 2
titulo: Numbering things
bajada: Fixed names so Claude, the scripts and I talk about the same thing.
---

My folders had names like `gestor-facultad`, `fidelhub`, `correccion de estilo` (with spaces) and `escritura`. They worked while there were only a few. With 16 projects, no: every time I asked Claude for something I had to clarify which one I meant, and names with spaces or accents broke the scripts every other day.

## The system

Now each project has a fixed three-digit number. The hundreds digit is the area: 1 for university, 2 for writing, 3 for work, 4 for personal. Folders are named `NNN-area-nombre`, lowercase, no accents or spaces: `101-edicion-correccion-estilo`, `202-escritura-diario`, `404-personal-infra`. The number is never reused, even if the project gets archived.

Inside each project, another convention:

- Fixed files, in capitals: `CLAUDE.md`, `CHANGELOG.md`, `PLAN.md`, `HISTORY.md`.
- Internal ones, with a leading underscore: `_brief.md`, `_txt/`.
- Dated ones, with the date first: `2026-10-08-auditoria.md`, so they sort themselves.

The number also goes in the title of each project's file (`# 202 · Diario`) and in the map in the [general file](contexto-general.html). Now I say “the 404” and Claude knows what I mean.

## Why it pays to do it at the start

Renaming later is expensive. The migration took me a whole afternoon, because changing the folder name isn't enough: you also have to update the paths in the context files, the skills, the scheduled tasks, the Python environments and the configs. And Claude Code's memory is tied to the folder's path, so you have to move it by hand.

During the migration, three errors also slipped past me: a batch script that kept going after failing, some paths with backslashes that the shell turned into something else and a generator that actually ran when I only wanted to see how it was used. I wrote them down, with their cause and prevention, in the log I describe in [Quality without bureaucracy](calidad.html). The rule that stuck: batches that move or write files run one at a time, or with an error check at every step.

```text
I want to organize my project folders with fixed names. Propose a three-digit number for each one (the hundreds digit is the area: [your areas]) and a name in the NNN-area-nombre format, lowercase, no accents or spaces. Before renaming anything, list everything that mentions those paths (context files, skills, scheduled tasks, configs, memory) and build a migration plan one folder at a time, verifying each step. Don't move anything until I approve it.
```
