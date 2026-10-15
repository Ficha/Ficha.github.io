---
slug: asesores
nivel: 4
nuevo: si
titulo: Fictional advisors
bajada: Fourteen specialists with a name, a personality and a bibliography, called the way you'd call a colleague.
---

When I write, I almost always think alone. And thinking alone has a well-known flaw: you end up agreeing with yourself. I put together a team of fictional advisors to have someone at hand who'll disagree with me, with arguments.

## What they are

Fourteen made-up specialists, each with a name, a personality, an approach and a bibliography of their own: biology, science communication, interface design, user journey, psychology, quality, literary editing, devil's advocate, pedagogy, content and marketing, data, publishing law, cybersecurity and games. None of them exists. What does exist is the set of rules that makes them consistent: a character sheet, a reading list that shapes how they give opinions and a memory where they keep what they've learned about me.

## How you call them

Each one is a Claude Code subagent, a file in `~/.claude/agents/`, and you invoke it by name: “ask Iris what she thinks of this screen.” It's more convenient than it sounds, because the personality is already loaded and doesn't need explaining again. The files are generated with a script from a table, so adding or renaming someone means changing a row.

There are two skills on top. One is for consulting a single advisor and saving their memory: when I correct or dismiss a piece of advice, it gets recorded and next time they take it into account. The other calls several at once and synthesizes what they said.

One design rule matters more than the rest: the advisors give opinions, they don't edit. They read my files, they don't touch them.

## When they help

- To see a piece of work from an angle that isn't mine: a text, a screen, a plan.
- When I need someone to distrust an idea I like too much.
- When several of them, without agreeing beforehand, flag the same thing. That happened once and I tell it in [The panel that got expensive](panel.html).

## When they don't

They're no good for deciding in my place or for facts that can be checked in a file. They're characters, and a character can be wrong with total aplomb. I asked them to cite and to flag what they couldn't confirm, and I still check everything they say about regulations, because there have already been mistakes.

And they're no good in a big panel. The rule I ended up with: three or four at a time, not eleven, with a Sonnet orchestrator that calls them and synthesizes. A panel of eleven costs far more than it contributes: the agreement, which is the valuable part, shows up just the same with four.

## Before building yours

You can copy the idea without copying my characters. Mine have a bibliography of their own that's no use to you; yours should reflect what you really lack in each project. Start with two or three. If you want to sort out what you need first, the [grill me](grill-me.html) helps.

```text
I want to build a small team of fictional advisors for my projects. Interview me with the grilling skill about which areas I lack a different perspective in. Then propose two to four specialists: for each one, a name, a short personality, their approach and five foundational readings that shape how they give opinions. Show me the sheets before creating anything. If I approve them, generate one subagent per specialist in ~/.claude/agents/ with read-only access, so they give opinions and don't edit my files. Don't save or change anything without my approval.
```
