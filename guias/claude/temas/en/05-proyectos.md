---
slug: proyectos
nivel: 2
titulo: One file per project
bajada: Status, handoff, history and versions: so each session starts where the last one ended.
---

Besides the [general file](contexto-general.html), each project has its own: a `CLAUDE.md` in its folder or, on claude.ai, the instructions of a *Project*. It says what the project is, how you work there, its own rules and a section called **Status**.

## Status and handoff

The Status has a date and three things: what I decided, what I did and what's next. When I close a session where I made progress, I ask Claude to update it. That's the handoff: the next conversation starts where this one left off, not from zero.

It doesn't look like much. It's what pays off the most in this whole guide. A project without a written status is expensive, because Claude has to reconstruct what happened by reading everything, file by file, like a detective with a lot of free time and my credit card.

I learned two things the hard way. The first is that statuses get old fast: if a file says “pending” and I actually finished it already, Claude is going to recommend I do something that's done, so it helps to have it cross-check against something more reliable, like the repository's change history. The second is that the status says what I believe, not what is. Mine claimed two computers were one hundred percent in sync. One of the two had nothing. Now whatever can be verified gets verified (more in [Quality without bureaucracy](calidad.html)).

## The old stuff, to another file

If the Status accumulates everything, the file grows and gets paid for in every session of the project. The one for my site reached almost 9 KB, with the detail of five versions nobody needed anymore (not even me). I fixed it with a `HISTORIAL.md` next to it, which doesn't get loaded: only the live pending items stay in the Status and the rest moves out. Since then, every project file weighs under 3 KB.

## Versions

Each project also carries a minimal `CHANGELOG.md`: version 1, 2, 3, with one to three lines on what changed, written for whoever uses it and not for whoever coded it. It goes up when something is delivered or published, not with every edit. It helps both of us (Claude and me) know what's ready. In projects with a repository, each version also gets a tag.

```text
We're done here. Update the Status section of this project's file with today's date: what we decided, what was done and what's next, in five lines at most. Move whatever is no longer live to HISTORIAL.md. If something was delivered or published, add a version to the CHANGELOG.md. Show me the diff before saving.
```
