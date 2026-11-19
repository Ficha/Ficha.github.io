---
slug: obra-antes
nivel: 4
nuevo: si
titulo: Work before system
bajada: A rule that counts files and tells me whether this week I get to build tools or have to do what the tools were supposed to make easier.
---

[Build less](construir-menos.html) ended with a question: how many hours does this save me this week? The question was good and it wasn't enough. I always found an answer that let me build.

What I do comes in two kinds. The **work** is what I deliver: a text, an app someone uses, study notes, a published version. The **system** is what I build to make the work: infrastructure, mods, dashboards, folder cleanups, rules for Claude. The system is fun, gets finished fast and feels like progress. The work is hard.

## The rule

Since November 10, I don't open system work in a week without at least one work delivery logged in a `CHANGELOG.md`. Ship something first. Then, if there's time left, sharpen the pencil.

## The script that counts it

A rule that depends on me remembering it doesn't work for me. I prefer brakes built into the structure, not into willpower. So `obra_meta.py` (Python, no AI, no network) goes through my projects and counts how many work files and how many system files I touched in the last 30 and 90 days, when each one's last version was and when I updated its Status. At the end it says, in one line, whether I can open system work this week.

The numbers are uncomfortable, which is what they're for. In my Copyediting notes, 94% of what I touched in a month was work. In my projects dashboard, 18%.

## What it doesn't know yet

It can't tell a work delivery from a tooling change logged in another project. If I add a version to an app's `CHANGELOG.md` for an internal fix, the script counts it as a delivery. I know, and I'm leaving it that way: an imperfect rule that gets followed beats a perfect one that gets argued.

```text
Help me split my work into work (what I deliver: texts, apps someone uses, published versions) and system (tools, automations, cleanups, configuration). First propose how to classify each project's files and show me borderline examples so I can decide. Then write a script with no AI that counts, per project, how many files of each kind I touched in 30 and 90 days, and says in one line whether this week there was at least one work delivery logged in a CHANGELOG.md. Use absolute paths and don't save anything until I approve it.
```
