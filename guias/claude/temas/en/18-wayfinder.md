---
slug: wayfinder
nivel: 4
nuevo: si
titulo: Wayfinder: a map for what doesn't fit in a session
bajada: When the work is bigger than one conversation, you plan first with decision tickets and execute afterward.
---

Some jobs don't fit in a session. Sometimes they're not even hard; they're big and wrapped in fog: you know more or less where you want to end up, but you can't see the road. If you tackle it anyway, the session fills up with context, hits the cap and whatever was left half decided gets lost in the handoff.

*Wayfinder* is another skill by Matt Pocock (repo `mattpocock/skills`, installed with `npx skills@latest add mattpocock/skills`). Its proposal is to draw the map before taking the first step.

## The parts of the map

The map is a document that works as an index, not as a warehouse. It has four sections:

- **Destination.** What arriving looks like: a specification, a closed decision or a change made. It's fixed first, because it defines the scope of everything else.
- **Decisions made.** One line per resolved ticket, with a link to the detail. The decision lives in one place (its ticket) and the map only summarizes it.
- **Still unspecified.** The fog: things you know will come up but can't formulate precisely. It doesn't get cut into tickets ahead of time. When a decision clears it up, only then does it become a ticket.
- **Out of scope.** What you ruled out on purpose. It doesn't come back unless the destination changes.

Each ticket is a question that gets resolved with a decision, the size of one session. It can be research, a prototype, a conversation (the [grill me](grill-me.html) goes here) or a manual task that unlocks a decision. And a simple rule: one session, one ticket.

## Planning without executing

This was what cost me the most. The skill asks you to plan and let go. Each ticket produces a decision, not a deliverable, and the map is done when there's nothing left to decide. The urge to “since I'm here, I'll just do it” usually means you've reached the edge of the map and it's time to move to another stage.

## The example: a restart

I'm using it to think through a restart of all my projects: what stays, what gets archived and what rules I continue under. It's the typical case of what doesn't fit in a conversation, because it touches every folder and each decision changes the ones that come after.

The destination got written in one line: a one-page specification. Plan, don't execute. The first session produced a few decisions, seven open tickets and a surprise: one of those tickets blocks all the others, and it wasn't the one I thought. I'm not done yet. The map is half finished, and that's exactly the point: I can close the session today and open another one next week without losing anything, because what's been decided is written down and not in a conversation's context.

## When not to use it

If the road is already clear and fits in a session, you don't need a map: the skill itself says that in that case it's better to stop and ask how to continue. A map also has a cost, and for a two-file change it would be an elegant way to procrastinate.

It's also the best way I've found to respect the session cap I describe in [Habits](habitos.html).

```text
I want to plan [describe the big job and the result you imagine]. Use the wayfinder skill: first help me fix the destination with an interview (grilling), then build the map with destination, decisions made, what's still unspecified and what's out of scope, and create only the decision tickets that can already be formulated. Resolve one ticket per session. Plan without executing anything and don't save or change any file until I approve it.
```
