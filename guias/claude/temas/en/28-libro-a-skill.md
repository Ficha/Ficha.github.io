---
slug: libro-a-skill
nivel: 3
nuevo: si
titulo: From a book to a skill
bajada: An author's method, turned into something Claude applies to real problems and uses to review what I make.
---

I read a good book, underline all of it, and three months later I remember the cover. With method books it's worse, because what I wanted was to use it, not remember it.

So I built `libro-a-skill`. It takes a book or a bibliography (EPUB, text PDF, scanned PDF or several sources together) and turns it into a [skill](skills.html) with two modes: **apply**, which uses the author's method on a problem of mine, and **review**, which looks at a text, a plan or a design with their criteria.

## How it works

1. It extracts the text and splits it into chapters with local scripts. That part spends no tokens.
2. It writes one note per chapter with Sonnet agents, a cheaper model.
3. It distills the notes into four files: glossary, method, criteria and patterns.
4. It installs the skill and tests it with real cases and a control case, one where the method shouldn't have anything to say.

The first was Donella Meadows' *Thinking in Systems* (2008). Out came `pensamiento-sistemico`, which looks for loops, delays and leverage points in a problem. I tested it with three of my own cases and a control case.

## What went wrong

The distillation had a total size cap. To fit, it dropped 12 glossary terms and 19 criteria that other files in the same skill used. In other words, the skill named concepts it no longer defined. Now there's no total cap, and dropping a glossary term that another file uses is forbidden.

## Public

I put it on GitHub, MIT-licensed: [github.com/Ficha/libro-a-skill](https://github.com/Ficha/libro-a-skill). One note: the skill distills a method, it doesn't copy the book. The notes and extracted text are for your own use; don't publish them.

```text
I want to turn this book into a skill that applies the author's method to my problems and reviews my texts or plans with their criteria. First extract the text and split it into chapters with a local script, without reading the whole book in the conversation. Then write one note per chapter with a Sonnet subagent per chapter, one at a time. Distill the notes into glossary, method, criteria and patterns, without dropping any glossary term that another file uses. Before installing it, test it with two of my cases and a control case, and show me the results.
```
