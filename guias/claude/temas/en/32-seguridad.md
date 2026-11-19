---
slug: seguridad
nivel: 5
nuevo: si
titulo: A security review
bajada: A pass over all my projects with Claude, and what it found in apps I built myself.
---

When you build an app yourself with Claude, security is on you. There's no team reviewing it before it goes live: there's you, Claude and an afternoon. My apps are small (a journal, a quest game, an app for my degree, this site), but they hold other people's data, and that's enough to take it seriously.

On November 14 I asked Claude for a review of all my projects. It found things in five.

## What it found

- **A local panel that accepted any request.** A tool of mine for cleaning up folders took orders from any origin. Now it requires the request to come from its own page, in the expected format, and checks which address it arrives at.
- **Scripts written inside the HTML.** If a page allows inline code, injected text can run. The fix is a content security policy (CSP) that only accepts the site's own scripts.
- **Unpinned GitHub actions.** The workflows that publish the site used versions their author could change underneath. The fix is pointing to an exact version.

The first fix is already live. The other two are in a branch, unpublished: first I want to test by hand the apps they touch.

## Secrets out of the backup

I have a daily backup of my projects in a private repository. Before each copy, a brake looks for passwords and keys in what's about to be uploaded; if it finds one, nothing goes up. The backup also leaves out Claude's transcripts and config files with keys. The repository being private is no excuse: private doesn't mean safe.

## How to ask for one

- First, read-only. Have it list findings with severity, file and line, without touching anything.
- Fix them one at a time, each fix on its own branch and in a separate folder (a *worktree*), so you don't step on other sessions.
- For recent changes there's `/security-review`, which reviews a branch's pending changes before you publish them.

```text
Do a read-only security review of this project. Look for: forms or servers that accept requests from any origin, inline code that allows script injection, keys or passwords in the repository or its history, dependencies and GitHub actions without a pinned version, and personal data stored without need. For each finding, give me the severity (high, medium or low), the file, the line and a proposed fix. Don't change anything yet; we'll fix them one at a time afterwards, each on its own branch.
```
