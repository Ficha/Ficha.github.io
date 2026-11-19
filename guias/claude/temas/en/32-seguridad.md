---
slug: seguridad
nivel: 5
nuevo: si
titulo: A security review
bajada: How I ask Claude to review my projects, what's worth looking for and what's better left unsaid.
---

When you build an app yourself with Claude, security is on you. There's no team reviewing it before it goes live: there's you, Claude and an afternoon. My apps are small (a journal, a quest game, an app for my degree, this site), but they hold other people's data, and that's enough to take it seriously.

So every now and then I ask Claude for a review of all my projects. The first time it found things in five. None serious, all the kind that gets fixed in an afternoon if someone looks.

## What to look for

- **Requests from any origin.** A form or a local server that accepts orders from any page, when it should only accept them from its own.
- **Inline code.** If a page allows scripts written inside the HTML, injected text can run. That's what a content security policy (CSP) is for: it only lets the site's own scripts run.
- **Keys and passwords** in the repository or its history. Deleting them from the file isn't enough: if they were ever in a commit, change them.
- **Unpinned versions.** Dependencies and GitHub actions their author can change underneath.
- **Data you don't need to keep.** The safest data is the data you don't have.

## How to ask for one

- First, read-only. Have it list findings with severity, file and line, without touching anything.
- Fix them one at a time, each fix on its own branch and in a separate folder (a *worktree*), so you don't step on other sessions.
- For recent changes there's `/security-review`, which reviews a branch's pending changes before you publish them.

## Backups count too

If you make automatic copies of your projects, have a brake look for keys and passwords in what's about to be uploaded, and upload nothing if it finds one. The destination being private is no excuse: private doesn't mean safe.

## What isn't told

This card doesn't say what Claude found in my projects or what's left to fix. It's not modesty. An open finding told in public is an invitation. Findings go to a private file and get told, if at all, once they're closed and say nothing useful to anyone with bad intentions.

```text
Do a read-only security review of this project. Look for: forms or servers that accept requests from any origin, inline code that allows script injection, keys or passwords in the repository or its history, dependencies and GitHub actions without a pinned version, and personal data stored without need. For each finding, give me the severity (high, medium or low), the file, the line and a proposed fix. Write them to a file that doesn't get published. Don't change anything yet; we'll fix them one at a time afterwards, each on its own branch.
```
