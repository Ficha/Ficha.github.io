---
slug: calidad
nivel: 3
titulo: Quality without bureaucracy
bajada: What “done” means, an error log and a weekly review that runs on its own.
---

With 16 projects and Claude doing a good part of the work, errors started slipping through: a note published with outdated data, broken paths after a migration, a Status that said something untrue. None serious. All of the same kind, though, because nobody had defined when something was done or what to do when it wasn't.

I built a minimal quality system, with three files and one rule: if a piece isn't used in a month, it goes. No bureaucracy.

## 1. What “done” means

A short table, by type of deliverable. A few examples from mine:

- **Signed text**: it went through the [proofreading skill](skills.html), it's in my voice and I approved it.
- **Code**: tests green, the change with a description, the version in the `CHANGELOG.md` and its tag.
- **Regulations and data**: every data point has an official source with a link and a date, and a second pass checked it against that source.
- **Scheduled task**: its summary says what it did, and it didn't send, publish or delete anything outside what's allowed.

Each [project file](proyectos.html) names it in one line; it isn't copied.

## 2. An error log

Every error that reaches a file, a task or a deliverable gets written down in one line: date, project, what happened, cause, fix, what changes so it doesn't repeat and whether it's open or closed. Writing errors don't go there, but into the list of frequent errors in my style sheet.

The column that matters? The “what changes” one. Three rules came out of the [folder migration](carpetas.html): batches that write go one at a time, replacements with backslashes go through a script and never through the shell, and before running a script that writes you have to read how it's used.

The rule is in my [general file](contexto-general.html), so Claude follows it on its own: when it makes a mistake, it writes it down.

## 3. Risks and providers

One page with what can go wrong and what I do if it happens: a deletion that propagates between computers, the server PC breaking, tasks that need the app open, each connector's allowance, the weekly quota.

## The review that already runs

The automatic part works now. A script that spends no tokens checks every day that the paths exist and that no project file is over 6 KB. Each week's [newsletter](newsletter.html) counts the nonconformities per project, and that showed me something I wasn't seeing: in one month, my degree app accounted for 12 of the 25 logged errors.

## Reviewing with evidence

I gave Claude a character for every session, which I named Makoto: nothing counts as done without evidence. If it says something works, it has to have tested it; if it didn't, it says so. Makoto also writes improvement ideas on a separate list, one or two per session at most, so I don't get flooded with proposals. The ones I pick go to my to-do list; the rest get deleted.

And a lesson from this month: what a subagent says isn't evidence either. It has [its own card](subagentes.html).

```text
Build a minimal quality system for my projects with the CRITERIA.md and NONCONFORMITIES.md templates I'm attaching. First propose the “done” criteria for each type of deliverable I have. Then review my context files and skills: which ones go over 3 KB, which Statuses are more than two weeks old, which paths don't exist and which instructions repeat. Log every error you find as a nonconformity, with its cause and a prevention. Propose everything as a diff and don't save anything until I approve it.
```
