# How I work with Claude on fewer tokens

This started as a message to a friend who asked how I manage to use Claude all day without running out of quota by Tuesday. The message kept growing (it happens to me) and ended up here.

I use the Pro plan for almost everything: editing, studying for university, coding this site and juggling half a dozen projects at once. Over these months I learned three things that changed the way I work. The first is to look after tokens, the currency Claude charges in. The second is a newsletter Claude writes me once a week to tell me what to improve. The third is infrastructure, a fancy name for a small bunch of text files that make every conversation start out knowing who I am.

At the end you'll find the prompts I'd use if I had to build everything again, and a kit of `.md` templates to download.

## 1. Token economy

### How it gets spent

The first thing that took me a while to grasp is that Claude has no memory between one message and the next. Every time I write, it rereads the whole conversation from the start, so the tenth message costs more than the first and the fiftieth, a lot more. A few hours into a chat, it also starts mixing up what I asked at the beginning with what I'm asking now. They call it *context rot*. Good name.

The second is that writing costs it much more than reading. When I ask for a whole text back, corrected, I pay for every word that was already fine. If I ask only for the changes, I pay for the changes.

And the third is that everything adds up: my messages, its replies, the files it opens, web searches, the reasoning it does before answering and even the connectors I have switched on (Drive, Gmail, whatever), which load their instructions even if I don't use them. It all comes out of the same pot: the app, the web, Claude Code and scheduled tasks draw from the same limit. There's a five-hour window that starts with your first message and a weekly limit that always resets on the same day at the same time. The weekly one is the one to manage; yours is under *Settings > Usage*.

If I had to rank what eats the most, from more to less, I'd say: long sessions, big models (Opus spends quite a bit more than Sonnet, and Sonnet more than Haiku), research and web searches, heavy or scanned PDFs, agents, and extended thinking used for simple things.

### My everyday rules

I think of context as my desk at home. If I pile everything I might someday need on top of it, I end up working in a little corner and can't find a thing. On top I keep what I'm using right now; the rest goes into labeled drawers.

In practice, that turns into a handful of habits:

- One conversation per topic. When it drags on or drifts, I ask it to write down where we left off (more on that below) and I open a new one.
- Sonnet for almost everything. I call Opus when there's real thinking to do: a strategy, a fine edit, a problem Sonnet can't crack. Opus plans and Sonnet executes.
- I never hand it a whole PDF if I can give it text. My university readings I turn into text on my own computer, with a script and OCR, and Claude only reads the result.
- Excerpts before whole files, and no rereading what's already in the conversation.
- Long documents I check often (my style sheet, the voice profile of my newsletter, the rules of a writing contest) I distill once into a one-page brief, a `_brief.md`, and from then on I work with that.
- Criteria instead of adjectives. “Make it more dynamic” tells it nothing; “120 words max, no gerunds, end on a fact” tells it everything.
- Corrections in “original → corrected” format.
- On claude.ai, if a reply went wrong, I edit my message instead of sending another one to fix it. The failed attempt disappears and stops taking up space.
- I turn off the connectors I won't use in that conversation.
- Bulk tasks (summarizing thirty PDFs, sorting, transcribing) go to cheap agents with tight instructions. Careful, though: in total they spend more, so I only use them when I want the main conversation to stay clean.
- I check everything they write about regulations. Laws, bylaws, the fine print of open calls: that's where they get things wrong with enviable confidence.

### The calendar

The day before the weekly reset I squeeze every last drop out of it, because leftover quota is lost. I spend that day on infrastructure, roughly in this order: skills and templates, briefs of long documents, research I keep putting off, audits, and the odd test with a bigger model where I usually use a small one.

At night, scheduled tasks run and leave me drafts: recurring research, long reviews, batch work. None of them sends or publishes anything; in the morning I read and decide.

And one trick that still feels a bit like cheating: if a light task runs at six in the morning, the five-hour window resets at eleven, and the day gets two windows.

## 2. The continuous-improvement newsletter

I've been writing a newsletter for five years, so it was only a matter of time before I made one for myself. Every week, a scheduled Claude task gathers what happened in my projects, crosses it with AI news and sends me an email that takes five minutes to read.

It opens with a section called “For you”: one line per project with its status and a single concrete action for this week (just one, because if it gives me five I do none). It gets that from some status files I explain in the infrastructure part, without opening anything heavy.

Then comes “Building infrastructure”, the reason the newsletter exists. There it tells me what worked that week, what got stuck and what I had to explain twice, and it proposes up to three improvements ranked by payoff, each with the request ready to paste. It also drafts a plan to use the quota left before the reset. It closes with AI news (five at most, with sources), three Claude tips that don't repeat the last four issues and two general AI tips.

I picked the schedule so it lands the morning before the reset. That way I make the improvements it suggests with quota I'd lose anyway, and every week the system gets a little cheaper than the week before.

It leaves the proposals written down and I carry them out myself, if they convince me. The task doesn't touch my projects, publishes nothing and the only email it sends is to me.

Building it, I learned a couple of things the hard way. Project statuses age fast: if a file says “pending” and I actually finished it, the newsletter tells me to do something that's done, so it's worth checking against something more reliable, like the change history. A project with no written status is expensive, because Claude has to rebuild what happened by reading everything. And the task only runs with the app open: the second issue reached me late, the day after the reset, and the leftover quota was lost anyway.

## 3. Infrastructure

What saved me the most was no longer explaining to Claude who I am in every conversation. For that I use a few text files.

The first is the general context: in Claude Code it's a `CLAUDE.md` in your user folder; on claude.ai, the personal instructions in *Settings*. It says who I am, how I want it to answer, the saving rules and a table with my projects. It loads in every conversation, so every line is always paid for; I keep it trimmed under 3 KB.

Then each project has its own file (a `CLAUDE.md` in its folder, or the instructions of a *Project* on claude.ai) with what it is, how we work on it and a dated “Status” section: what I decided, what I did, what's next. When it grows, the old stuff moves to a `HISTORY.md` that doesn't load.

When I close a session where I made progress, I ask it to update that status. That's the handoff: the next conversation picks up where this one left off, not from scratch.

Processes I've repeated twice become skills, which are instructions Claude loads only when it needs them. I have one to edit my texts against my style sheet and another that takes the readings for a course and builds my notes and study plan for an exam. If those instructions lived in the general file I'd pay for them in every message.

Each project also carries a minimal `CHANGELOG.md`: version 1, 2, 3, with one to three lines on what changed. It goes up when something is delivered or published, and it helps both of us (Claude and me) know what's ready.

And one more habit: when I hand it something big with a fuzzy brief, I ask it first for the three to five questions that would most change the result. It saves me a whole round.

## 4. Prompts to get to something similar

They go in order, each in a new conversation. If you use claude.ai instead of Claude Code, wherever it says “file” read “personal instructions” or “*Project* instructions”.

**1. The general context file**

```text
I want to set up my general context file so every conversation starts out knowing who I am. Before writing anything, give me a short interview (3 questions at a time, 12 max in total): what I do, what projects I'm on, how I want you to answer, which Claude plan I have and what day my weekly limit resets. Then write the file using the CLAUDE-general.md template I'm attaching. It has to weigh under 3 KB: if something isn't used in almost every session, it's out.
```

**2. The token economy guide**

```text
I'm attaching token-economy.md. Adapt it to my case: my plan, the day and time of the weekly reset, the tasks I repeat and the ones that could run overnight as scheduled tasks. In my general file leave only a 10-line summary with the everyday rules, and have the full guide read only when planning.
```

**3. One file per project, with its status**

```text
For each of my projects [list], build a project file with the CLAUDE-project.md template: what it is, how we work on it, its own rules and a Status section with today's date (what was decided, what was done, what's next). Under 3 KB each. Whatever you don't know, ask me instead of making it up.
```

**4. The handoff when closing a session**

```text
We're wrapping up. Update the Status section of this project's file with today's date: what we decided, what got done and what's next, in 5 lines max. If something was delivered or published, add a version to CHANGELOG.md. Show me the diff before saving.
```

**5. The weekly newsletter**

```text
Create a scheduled task that runs [the day before my weekly reset] at 8 a.m. using the weekly-newsletter.md template I'm attaching. Adapt the paths and sources to my projects. The task reads, builds the issue and saves it (or leaves it as a draft in my email); it writes to nobody else, publishes nothing and doesn't carry out its own proposals. Before activating it, run a test issue and show it to me.
```

**6. Turning a repeated process into a skill**

```text
We've done this twice already: [process]. Turn it into a skill. First write what it does, when it's used and what criteria it follows; then the step by step, with whatever scripts are needed so the heavy lifting runs on my computer and not in the conversation. Test it on a real case and compare it with what we did by hand.
```

**7. Distilling a long document**

```text
Read [document] once and distill it into a one-page _brief.md: what I'll check often, with concrete criteria and short examples, no narrative summary. From now on, work with the brief and leave the original alone.
```

**8. The every-so-often audit**

```text
Review my context files (the general one and the project ones) and my skills. Tell me which ones go over 3 KB, which Status sections are more than two weeks old, which instructions repeat across files and which repeated process still isn't a skill. Propose the cuts as a diff and don't save anything without my approval.
```

## 5. The kit to download

These are templates to upload to your Claude along with the prompts above. Wherever there are `[brackets]`, your stuff goes.

- [CLAUDE-general.md](kit/en/CLAUDE-general.md), the general context with the saving rules.
- [token-economy.md](kit/en/token-economy.md), the full guide, to read only when planning.
- [CLAUDE-project.md](kit/en/CLAUDE-project.md), the template for each project, with its status.
- [weekly-newsletter.md](kit/en/weekly-newsletter.md), the instructions for the scheduled task.
- [CHANGELOG.md](kit/en/CHANGELOG.md), the version log.
- [guide.md](guide.md), this same page in Markdown.

If you use Claude Code, the general file goes in `~/.claude/CLAUDE.md` and each project's file as `CLAUDE.md` inside its folder. On claude.ai, paste the general one into your personal instructions and each project's one into its *Project* instructions.

None of this worked right from the start. I built it one week at a time, which is exactly what the newsletter is there to remind me.
