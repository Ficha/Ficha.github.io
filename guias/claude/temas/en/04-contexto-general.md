---
slug: contexto-general
nivel: 2
titulo: The file that says who you are
bajada: A single short file so you can stop introducing yourself in every conversation.
---

What saved me the most was no longer explaining to Claude who I am in every conversation. How? With a text file.

In Claude Code it's a `CLAUDE.md` in the user folder (`~/.claude/CLAUDE.md`); in claude.ai, the personal instructions under *Settings*. It loads on its own, at the start of every conversation.

## What mine has

- **Who I am**, in five lines, and what language I want it to answer in.
- **How we work**: that I work in `.md` until the final version, where certain data comes from (holidays, only from the official page) and that it should ask me before writing any text that goes out under my name.
- **The saving rules**, in 10 lines. The full guide lives in another file that's read only when planning.
- **My plan and the reset day**, so it knows when it's worth spending and when it isn't.
- **How I name things and how I version**: the [folder naming](carpetas.html) and the format of the `CHANGELOG.md`.
- **A project map**: a table with the number, the folder and a line on what each one is.

## Why it has to be short

Since it loads in every conversation, every line is paid for every time, even if that conversation doesn't use it, even if it's a hello, even if I ask it the time. I keep it under 3 KB, more or less a page. If something isn't used in almost every session, it doesn't go in: it goes to the [project file](proyectos.html), to a [skill](skills.html) or to a [brief](briefs.html).

Over time, general files fatten up on their own: every time something goes wrong, the temptation is to add a rule, and rules never leave. So every so often I audit it (the prompt is in [Quality without bureaucracy](calidad.html)) and prune it.

One detail I learned late: pointers get old. Mine sent it to read a voice brief that I had replaced with a new manual, and for days any correction in my voice read the wrong document. Nobody noticed. If you move a file, look for who mentions it.

## Sensitive projects

If you have a project you don't want crossed with anything (health, finances, whatever), say so in the map: it shouldn't be cited, mixed with other projects or used unless you ask.

```text
I want to build my general context file so every conversation starts out knowing who I am. Before writing anything, interview me briefly (three questions at a time, 12 in total at most): what I do for a living, what projects I'm on, how I want you to answer me, what Claude plan I have and what day my weekly limit resets. Then write the file using the CLAUDE-general.md template I'm attaching. It has to weigh under 3 KB: if something isn't used in almost every session, it doesn't go in.
```
