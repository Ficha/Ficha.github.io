---
slug: grill-me
nivel: 4
nuevo: si
titulo: Grill me: have it ask you first
bajada: An interview in rounds, with a recommended answer on every question, before a single file gets touched.
---

My vice with Claude was asking straight out. “Build me this,” and Claude built, with touching confidence, something that looked a lot like what I had in my head. A lot. What was missing I'd find out later, with half the context spent on redoing.

*Grill me* flips the order: before doing, Claude interrogates me. It's a skill by Matt Pocock (repo `mattpocock/skills`) that you install with `npx skills@latest add mattpocock/skills`. You invoke it as `grill-me`, which inside calls another one, `grilling`.

## How it works

Claude builds a decision tree: each decision opens others that depend on it. And it works in rounds. In each one it asks everything that can already be asked, without guessing answers it hasn't heard yet, and waits. With what I answer, the tree rearranges itself and the next questions come out.

Each question comes numbered and with a recommended answer. It's worded so that a “yes” accepts it. That changes the pace: I answer most of them with a “yes” or a “go,” and the ones that make me hesitate get the time they deserve.

## It looks up the facts itself

The rule I like most is the split of labor. The facts (which files exist, what a given configuration says, how many there are) Claude looks up, with a subagent if needed. From me it asks only for decisions. If it asks me something it could have looked at itself, it's charging me for work that isn't mine. The session ends when no branch is left unvisited and nothing has been silently assumed. Only then, and with my confirmation, does it act.

## A real case

This very update of the guide came out of a grilling: 22 questions in 4 rounds. Some were about form (“new cards or rewrite the old ones?”), others about content (“do we name the projects or keep them generic?”). Out of that came a specification document that was then executed almost without doubts. And two misunderstandings showed up in time: Claude thought the interview prompt had to be written from scratch (it existed, it was in my downloads folder), and what I called “the UX/UI stuff” turned out to be three different cards. Halfway through the writing, each one would have cost me an afternoon. In the round, it cost a line.

## When it helps

- Before a big deliverable with an ambiguous brief. It's the systematic version of my rule of first asking the 3 to 5 questions that would change the result the most.
- Before designing something with several pieces that depend on each other.
- When I have an idea and suspect I haven't thought it through.

It doesn't help with small tasks, where the round of questions costs more than getting it wrong. And for what doesn't fit in a single session, the [Wayfinder](wayfinder.html) is better, which uses this same interview as part of its method.

A warning: it's better done with Opus, because the good questions are the ones that call for judgment. After the interview, execution goes to Sonnet. I explain it in [Models](modelos.html).

```text
I want [describe the plan or the idea in a line or two]. Before doing anything, interview me with the grilling skill: build the decision tree and ask me in rounds, with the questions numbered and a recommended answer on each, worded so a "yes" accepts it. Look up the facts yourself in my files; ask me only decisions. Keep going until no branch is left unvisited. Don't write or change anything until I confirm we've reached a shared understanding.
```
