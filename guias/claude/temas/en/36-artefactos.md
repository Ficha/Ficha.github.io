---
slug: artefactos
nivel: 6
nuevo: si
titulo: Pages to share
bajada: What Claude builds as a page on claude.ai, private until you share it, and even editable from the page itself.
---

When something is for someone else (a report, an audit, a proposal), I used to send it as a file. An attached `.md` the other person opened in Notepad, asterisks and all. Now Claude publishes it as an **artifact**: a page on claude.ai, private until I share it with the “Share” button.

## What I gained

The audit I described in [Auditing a website](auditar-web.html) came out that way. The page has an index, each prompt with its copy button, a button to take the whole document in Markdown and a “Done” checkbox per block, remembered in the reader's browser. The person receiving it doesn't have to install anything or know what Markdown is.

Then I asked for it to be editable from the page, so I could make last touches without going through Claude. Now it has an “Edit text” button, a preview and “Save and publish”, which leaves a new version at the same link. Only people with edit access see it.

## The source is still mine

The page is built by a script from an `.md` that lives in my folder. That has a consequence: if I edit on the page, the local file goes stale, and before touching it again I have to bring the text back. I wrote it down in the project's Status, because it's exactly the kind of thing I forget.

## What else it's for

- **A design system.** An app's colors, fonts and pieces, on a page Claude reads before designing anything new. Galera's pieces live in one place, not in twenty loose artifacts.
- **Something to look at, not edit**: a diagram, a comparison, a dashboard.
- **What not**: notes to myself, text that will end up somewhere else, and anything with data from people who didn't ask to be there.

```text
Turn this document into an artifact to share with [who will read it]. It should have an index, a button to copy each prompt or code block, another to copy the whole document in Markdown, and a “Done” checkbox per section saved only in the reader's browser. It should work on mobile and in dark mode. The source is still the .md in my folder: write a script that builds the page from it. Publish it as private and send me the link.
```
