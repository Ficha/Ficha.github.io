---
slug: modelos
nivel: 1
titulo: Which model and how much effort
bajada: Opus thinks, Sonnet does and batches run with effort at the minimum.
---

For a while I always used the biggest model, just in case. It's like going to the supermarket in a truck. You get there, sure, but the fuel runs out on Tuesday.

## Sonnet by default

I use Sonnet for almost everything: proofreading, coding, organizing files, studying. I call Opus when there's real thinking to do, whether it's a strategy, a fine edit, the architecture of something new or a problem Sonnet can't crack. Opus plans; Sonnet executes. Many times I open the session with Opus to build the plan and continue with Sonnet to carry it out.

I wrote it down in my [general file](contexto-general.html) so Claude tells me when a task calls for Opus, instead of switching on its own. I make the switch.

## Effort is also a choice

Besides the model, you can choose how much it reasons before answering. Does it need to think for a good while to tell me whether a comma goes or not? For a simple question, long reasoning is pure waste; for a decision with many variables, it's worth every token.

Where it shows most is in subagents: the helpers Claude launches for massive tasks, like summarizing 30 PDFs, classifying or transcribing. They're mechanical jobs and they run with a closed brief, so I run them at low effort. My skill for [preparing exams](skills.html) launches the notes by topic at low effort and keeps medium effort only for the mock exam.

Careful, though: subagents spend more in total than doing everything in the same conversation. I use them when I want the main conversation to stay clean. Not to save.

## Haiku for the small stuff

For short, repeated tasks (classifying, extracting a data point, checking a format), Haiku is plenty. The day before the reset, I sometimes try a task with a smaller model than usual, to see if it solves it just the same; if it does, it stays that way.

```text
Review how we're using models in this project. For each type of task we do often, tell me which model and what effort you'd use, and why. If there are subagents, point out which ones can run at low effort. Propose the changes as a diff in the project file or in the relevant skill, and don't save anything until I approve it.
```
