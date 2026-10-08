---
slug: newsletter
nivel: 3
titulo: The continuous improvement newsletter
bajada: A weekly email that tells me what to improve with the quota I have left over.
---

I've been writing a newsletter for five years, so it was only a matter of time before I built one for myself (by me, for me, about me: the ideal format). Every week, a [scheduled task](tareas.html) gathers what happened in my projects, crosses it with AI news and sends me an email that takes five minutes to read.

## What it brings

- **For you**: one line per project with its status and a single concrete action for this week (just one, because if it gives me five I do none). It pulls it from the [Status sections](proyectos.html), without opening anything heavy.
- **Building infrastructure**, which is the newsletter's reason to exist: what worked during the week, what got stuck, what I had to explain twice, and up to three improvements ordered by how much they pay off, each with the request ready to paste and a label for weight (light, medium, heavy) and for model.
- **A plan for the leftover quota** before the reset.
- **AI news** (five at most, with a source), three Claude tips that don't repeat the last four editions and two about AI in general.

## When it goes out

It goes out the morning of the day before the reset. That way, I make the improvements it proposes with the quota I was going to lose anyway, and every week the system ends up a little cheaper than the one before.

It leaves the proposals written for me and I carry them out, if they convince me. The task doesn't touch my projects, doesn't publish anything and the only email it sends is to me.

## The newsletter's memory

At first, every edition started from zero and proposed the same things to me again, like me with New Year's resolutions. Now the task keeps a separate log (`_aprendizajes.md`): one entry per week with the lessons, the proposals and the status of the earlier ones (done, pending, carried over). That way it sees what's been stuck three weeks in a row, which is usually what's most worth attacking.

So that it doesn't spend more than it has to, a script gathers the data: each project's Status and how much it weighs, each repository's commits for the week and the open or merged PRs. The task receives that pre-chewed and writes.

## What I learned building it

Statuses get old and the newsletter was recommending things already done; now it cross-checks each Status against the repositories' history. A project without a written status is expensive. And Claude Code's memory lives in one folder per project, but the task was looking at the root one, which was empty, and calmly concluded there was nothing to remember.

```text
Create a scheduled task that runs [the day before my weekly reset] at eight, with the weekly-newsletter.md template I'm attaching. Adapt the paths and sources to my projects. Have it keep an _aprendizajes.md log with what it proposes each week and the status of the previous ones. The task reads, builds the edition and saves it (or leaves it as a draft in my email); it doesn't write to anyone else, doesn't publish and doesn't carry out its own proposals. Before activating it, run a test edition and show it to me.
```
