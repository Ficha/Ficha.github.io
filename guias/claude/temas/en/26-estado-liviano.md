---
slug: estado-liviano
nivel: 2
nuevo: si
titulo: The Status that doesn't bloat
bajada: One Status per project, 1.5 KB at most, and the old one moved to another file, word for word.
---

In [One file per project](proyectos.html) I said old stuff moves to a `HISTORY.md`. I followed that halfway. In November I added up the size of all my `CLAUDE.md` files: 133 KB, about 35,000 tokens loaded before I even said hello. The one for Galera alone weighed 51 KB. Every session started by reading a novel about itself.

The problem wasn't the rule, it was how I applied it. When closing a session, Claude added a new Status on top of the previous one. Nobody deleted the old one, just in case. And “just in case”, times twenty sessions, is a 51 KB file.

## The rule

One Status per project, dated, 1.5 KB at most. It gets **replaced**, not appended. The previous one goes to `HISTORY.md` exactly as it was, unsummarized, because a summary loses precisely the detail you'll look for two months from now. `HISTORY.md` isn't loaded every session: you open it when you need it.

## With proof nothing got lost

Moving text between files by hand is the surest way to lose a line. So the handoff is done by a script, `peso_claude_md.py`, which uses no AI:

- `medir` reports how much each `CLAUDE.md` weighs.
- `respaldar` saves a copy before touching anything.
- `verificar` checks that every line of the original is in the new file or in the history.

Result: from 133 to 57 KB across all projects, from about 35,000 to about 15,000 tokens per session. Galera went from 51 to 5 KB.

## The hook I haven't pasted yet

So it doesn't bloat again, I wrote two hooks: one that warns when a session opens if the file is over 6 KB, and another that archives extra Statuses on close. They're ready. They still need to be pasted into my settings, and that's on me: Claude can't edit its own permissions without me (and it's good that it can't). It's been on my to-do list since November 9.

Meanwhile, the rule lives in my [general file](contexto-general.html) and Claude follows it when closing. The hook is the belt; the written rule, the suspenders.

```text
Measure how much each CLAUDE.md in my projects weighs and show me a table sorted from largest to smallest. For each one over 3 KB, propose how to leave a single Status, dated and 1.5 KB at most, and move the previous Statuses to a HISTORY.md next to it, verbatim, without summarizing. Before touching anything, make a backup copy. After moving, check with a script that no line of the original was lost. Show me the diff of each file and don't save anything until I approve it.
```
