---
slug: panel
nivel: 5
nuevo: si
titulo: The panel that got expensive
bajada: I consulted eleven fictional specialists about an app. It cost 16% of the week and was worth it anyway.
---

I built a team of fictional advisors. Each has a name, a personality and a bibliography: one in biology, one in design, a devil's advocate, a data specialist. They're Claude subagents with a fixed brief. I tell how they work in [advisors](asesores.html). This card is about the day I called them all together.

## The day

On October 11 I asked eleven of them to weigh in on an app I was finishing, for my degree. I wanted a cross-reading. What I got was a bill: the panel took 16% of the whole week's quota, with 272 turns and a peak of 499k of context in a single session.

Three things went wrong, in increasing order of seriousness.

**Eight of the eleven didn't load by name.** Only three answered as themselves. The other eight gave “Agent type not found” and Claude, ever helpful, launched them anyway as generic agents, without their personality or their bibliography and rereading everything from scratch. Each one spent about 75k, against about 29k for the ones that loaded properly. More than double, and on top of that they were different people.

**One wrongly passed number turned into two false alarms.** When preparing the material for them, a figure got copied wrong, and two advisors found, in all seriousness, a calculation error that didn't exist. They did their job well. The problem was in what I gave them.

**A subagent deleted a real book.** One of the agents had to review the bibliography and, with search at low effort, couldn't confirm *Demoliendo papers*. So it took it out. The book exists. “I couldn't confirm it” and “it doesn't exist” are different things, and my brief allowed it to treat them as the same.

## The good side

Eight of the eleven, each from their own angle, agreed on one thing: the first screen gave the student nothing to do. I suspected it, but a suspicion of your own is easy to file away. Eight voices, not so much. That same day I redid the screen: a single button to mark the passed courses and an example you can tap without fear of breaking anything.

## The rules

- A panel of three or four, not eleven. The agreement shows up just the same with fewer voices.
- Advisors run on Sonnet, not Opus.
- “Not confirmed” isn't “delete.” An agent that can't verify something flags it and asks.
- Figures are checked against the code or the original data, not against what another advisor said.

It wasn't the only session with lots of helpers that week: the kickoff of a finance manager, with 73% of the work in subagents, took another 9%. Subagents spend more in total than doing everything in one conversation, and eleven at once spend eleven times as much. That week ended up as a story in [the week I ran out of quota](sin-cuota.html).

```text
Call a panel of three to four advisors from my team to review this app. Pick the ones that fit best and explain why. Launch them with Sonnet and by name, and check that each one loaded its definition before starting. Ask each one to cite the file and line for every observation. If a fact can't be confirmed, they should flag it as not confirmed and not delete it. Then write a synthesis with what they agree on, where they differ and the figures that need to be checked against the code. Don't save anything until I approve it.
```
