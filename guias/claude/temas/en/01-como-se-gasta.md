---
slug: como-se-gasta
nivel: 1
titulo: How the quota gets spent
bajada: Why the fiftieth message costs more than the first, and what eats the most.
---

The first thing that took me a while to grasp is that Claude has no memory between one message and the next. Every time I write, it rereads the whole conversation from the start, so the tenth message costs more than the first and the fiftieth, a lot more. A few hours into a chat, it also starts mixing up what I asked at the beginning with what I'm asking now. They call it *context rot*. Good name.

The second is that writing costs it much more than reading: when I ask for a whole text back, corrected, I pay for every word that was already fine. If I ask only for the changes, I pay for the changes. Nothing more.

And the third is that everything adds up: my messages, its replies, the files it opens, web searches, the reasoning it does before answering and even the connectors I have switched on (Drive, Gmail, whatever), which load their instructions even if I don't use them.

## One pot

The app, the web, Claude Code and scheduled tasks all draw from the same limit. There's a five-hour window that starts with your first message and a weekly limit that always resets on the same day at the same time. Which one do you have to manage? The weekly one; yours is under *Settings > Usage*.

Connectors, on top of that, can have their own allowance. Figma's, on the free plan, gives 20 calls a month. I used it up in a day (porting a design system, not looking at little drawings), so now I have a task that tells me when it renews.

## What eats the most

From more to less, I'd say: long sessions, big models (Opus spends quite a bit more than Sonnet, and Sonnet more than Haiku), research and web searches, heavy or scanned PDFs, agents and extended thinking used for simple things.

If you'd rather have your own data than my list, at the end of a long session ask it to explain your usage: Claude Code has a skill (`explain-usage`) that builds a chart of what each part took. It's useful for calibrating your [habits](habitos.html) with your own numbers.

## Reset day

The quota you have left over doesn't accumulate. It's lost. That's why I use the day before the reset to improve the infrastructure (skills, briefs, audits), and the heavy stuff goes to the night, in [scheduled tasks](tareas.html). And a trick that still feels a bit like cheating: if a light task runs at six in the morning, the five-hour window resets at eleven, and the day gets you two windows.

```text
Here's how I use Claude in a typical week: [which tasks, how long they take, with which model]. My plan is [plan] and the limit resets on [day] at [time]. Tell me which of all that eats the most quota and propose three concrete changes, ordered by how much they save, without losing quality on what matters.
```
