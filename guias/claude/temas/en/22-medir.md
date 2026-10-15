---
slug: medir
nivel: 5
nuevo: si
titulo: Measuring spend
bajada: A script that reads my transcripts, writes one row per week and lets me compare without having to remember anything.
---

After [running out of quota](sin-cuota.html) I understood something uncomfortable: spend can be measured, and I wasn't measuring it. I had a feeling (“I spent a lot this week”) and no rule to decide whether that feeling was true. A feeling can't be compared with last week's, and a number can.

## Where the data comes from

Claude Code stores a transcript of every session on my computer. It's a text file with each turn, the model that was used, how much it read and how much it wrote. No external tool is needed and I don't have to ask Claude for anything: the data is already there, waiting for someone to add it up.

The script is called `gasto_tokens.py`. It's plain Python, no AI, no tokens. It goes through a week's transcripts, adds things up and writes a row.

## The columns

One row per week, in a CSV file, with these nine columns:

- `desde` and `hasta`: the week's date range.
- `peso`: total spend, estimated with each model's price ratio. It's for comparing weeks, not the real percentage of the limit.
- `turnos` and `sesiones`: how much work got done.
- `pct_opus`: what percentage of the weight was Opus.
- `ctx_promedio`: the average context per turn.
- `pct_releer`: how much of the spend was rereading the conversation.
- `pct_subagentes`: how much the subagents took.

They're few on purpose. With more columns the file turns into a dashboard, and dashboards get looked at once and abandoned. Nine is enough to see a week at a glance.

## The comparison

My Wednesday [newsletter](newsletter.html) runs the script, adds the new row to the CSV and compares it with the previous week. I don't have to remember or open anything: it shows up in the same edition I already read, as one more [scheduled task](tareas.html). If something drifts past the target, it shows up there, without my going looking.

There are three targets, written down before looking at the data so I couldn't fudge them afterward:

- Opus under 40%.
- Average context under 90k.
- No session above 8% of the weekly spend.

## What it measures and what it doesn't

It measures how much I spent, not whether I spent it well. An expensive week can be a week in which I finished something important. The numbers don't understand that, which is why I write the weekly conclusion myself and the script doesn't.

Nor is it an exact account of the plan: it only sees what runs in Claude Code on my computer, not the web or the phone. It's an approximation that's good enough to see trends, which is what I needed.

In the [kit](kit.html) I left a template of the CSV with the nine columns, empty, so you can start from scratch.

```text
Write a Python script, without using AI, that reads the local Claude Code transcripts from the last week and adds a row to a CSV file with these columns: desde, hasta, peso, turnos, sesiones, pct_opus, ctx_promedio, pct_releer, pct_subagentes. Before writing it, show me where the transcripts are on my computer and how a turn is structured. Have the script print the comparison with the previous row and flag which columns go over these targets: Opus under 40%, context under 90k, no session over 8% of the total. Use absolute paths. Don't save anything until I approve it.
```
