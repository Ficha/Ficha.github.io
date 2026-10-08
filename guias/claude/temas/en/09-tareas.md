---
slug: tareas
nivel: 3
titulo: Tasks that run on their own
bajada: Night work, drafts in the morning and permissions written in advance.
---

A scheduled task is a request that Claude carries out on its own, at a fixed time, without me watching. I use them for what repeats and for heavy stuff that can wait until night, while I sleep.

## The ones I have

- **The [continuous improvement newsletter](newsletter.html)**, once a week, the day before the reset.
- **Thursday's listings**: it updates the cultural agenda of an app we share at home (movies, premieres, watchlists and the forecast) from the usual sources.
- **Conditional reminders**: a task that, the day the Figma connector's allowance renews, checks whether it's usable yet and tells me. It doesn't run anything: it only checks.
- **Odd night jobs**: recurring research, long reviews, guide drafts. In the morning I read and decide.

## The golden rule

No task sends, publishes, deletes or merges anything. They produce drafts, and the only email they can send is to me. Each task says so in its instructions and so does my [general file](contexto-general.html). If a task has to touch something outside, like uploading the listings to the app, it says so explicitly and limits itself to that.

## Permissions written in advance

A task running at night can't ask me whether it can read a file. And if it's missing a permission? It stays stuck until I see it. That's why the permissions it needs are written into Claude Code's settings (`~/.claude/settings.json`): read my projects, edit only the newsletter folder, check the repositories' history, run two or three specific scripts. The minimum for it to do its job and nothing more.

Two details I learned when the task got stuck: commands with absolute paths (the task ran in a temporary folder and couldn't find anything), and permissions in the exact same form as the command it's going to run.

## What they don't tell you

Scheduled tasks in the desktop app run only with the app open and the computer on. The second edition of my newsletter reached me a day late, after the reset, with the quota I wanted to use already gone. Lovely. That's why the computer that acts as a server now stays always on and never suspends (more in [Claude on several computers](equipos.html)).

And another: if a task builds its summary by reading everything, it spends like a long session. What can be counted with a script (the week's commits, file sizes, statuses) goes to a script that hands the data over pre-chewed.

```text
Create a scheduled task that runs [day and time] and does [what]. Rules: it produces drafts; it doesn't send, publish, delete or merge anything; if a source fails, it leaves it out and says so. Use absolute paths. List the minimum permissions it needs and propose how to add them to settings.json, without adding anything extra. Before activating it, run a test and show me the result.
```
