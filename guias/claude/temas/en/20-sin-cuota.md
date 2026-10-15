---
slug: sin-cuota
nivel: 5
nuevo: si
titulo: The week I ran out of quota
bajada: From October 8 to 12 I burned through the weekly allowance early. Here are the numbers and what I changed.
---

My plan has a weekly limit that resets on Thursdays at 4 a.m. The week that started on Thursday, October 8, I ran out of quota well before the following Thursday. Running out bothered me, but not knowing where it had gone bothered me more (me, who writes down even the minutes it takes me to write the newsletter). So I did what I do with everything I don't understand: I measured it.

## The numbers

From Thursday to Monday there were 41 sessions and 2,524 turns. Opus, the most expensive model, took 78% of the weight, and almost always to execute things Sonnet does just as well. The average context per turn was 157k (157,000 tokens), and that matters because of something I knew in theory and had never seen in numbers: every turn rereads the whole conversation. 59% of the spend was rereading; 26%, caching; and 15%, the answers. Writing, which I thought was the expensive part, turned out to be the cheapest. Subagents, for their part, ate up 16%.

There are three other facts you can't see in an average:

- Thursday and Sunday concentrated 77% of the spend. I started several big projects at once instead of spreading them out.
- 79% of the sessions were opened in the root folder of all the projects, not the project's own. Claude started out loading context that wasn't needed.
- Three files of 87, 74 and 53 KB were read whole, several times, instead of searching inside them for what was needed.

None of the three is a serious mistake. The three together are a bill.

## What I changed

Five rules that now live in my [general file](contexto-general.html):

- Sonnet by default. If something calls for Opus, Claude tells me and I switch. More in [models](modelos.html).
- In Opus you plan and let go: when the plan is ready, execution goes to Sonnet.
- Session cap: about 80 turns or 150k of context. When you hit it, handoff and a new session. [Habits](habitos.html) tells it in more detail.
- One big project per day.
- For files over 20 KB, search and read in fragments; never the whole file.

And the targets, to know whether it worked: Opus under 40%, average context under 90k, no session above 8% of the weekly spend.

## Did it work?

Half. The second measurement, October 8 to 14, came out at 68% Opus. It dropped ten points and it's still far from 40. It turns out that writing a rule isn't enough if I then open Opus out of habit, like walking into the kitchen when you're not hungry. That's why I built [a way to measure](medir.html) every week and [alerts that fire on their own](mods.html) when I'm going over.

The funniest part is that a good chunk of that quota went into building tools to save quota. There's [another card](construir-menos.html) about that.

```text
I want to understand where my weekly quota goes. Look through this week's local Claude Code transcripts and calculate: number of sessions and turns, percentage of weight by model, average context per turn, how much goes to rereading, to caching and to answers, how much to subagents, which days it's concentrated on and how many sessions were opened in a root folder. Also list the large files that were read whole. With that, propose five rules for my general file and three measurable targets. Don't modify anything without my approval.
```
