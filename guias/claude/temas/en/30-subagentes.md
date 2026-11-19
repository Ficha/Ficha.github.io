---
slug: subagentes
nivel: 5
nuevo: si
titulo: What a subagent says isn't a fact
bajada: Check the source, launch them one at a time and try a batch with five before firing off thirty.
---

Subagents are helpers Claude launches to do part of the job in parallel: read a folder, verify a list, summarize twenty files. They come back with a report and Claude carries on with it. The problem is that “carries on with it”. A subagent's report is a reading by someone you never see working, and Claude treats it as a fact.

## Three mistakes from November

- A question asked me whether to turn off a nightly task that, according to the report, ran every night. I said “turn it off”. It was a one-time task and it was already off: I decided on a false fact.
- My master plan listed some quote requests as not sent. I had sent them. The subagent read an open to-do item and concluded nothing had been done.
- In [the panel that cost too much](panel.html), a subagent deleted a real book from a list because it “couldn't confirm it”.

None was serious. All three were the same kind: a claim about the world made from a file.

## Check the source

Now, before claiming something wasn't done, is active or doesn't exist, Claude checks it at the source: the sent email, the repository, the task's actual state, not its config file. If it can't, it says so: “shows as open”, “I couldn't confirm it”. And “I couldn't confirm it” never authorizes deleting anything.

## One at a time

In the Galera planning session, Claude launched five subagents almost at once, mixing Opus and Sonnet. The five-hour quota ran out in minutes. When subagents share a plan, they go one at a time, in order of value: the one that matters most first. Only short ones run in parallel.

## Try it with five

To build voice samples I fired off a batch of 30 Claude calls from a script, with Sonnet. The weekly quota ran out at call 14, and the next day's scheduled task could fail because of it. Now, before a batch, I check how much quota is left and run five. If five go well and the spend adds up, I continue.

```text
Before claiming that something wasn't done, is active or doesn't exist, verify it at the source (the sent email, the repository, the task's actual state) and not in a summary or a to-do item. If you can't verify it, say so in those words and don't delete anything because of it. When you launch subagents that share a plan, launch them one at a time, in order of value; only short ones in parallel. Before a batch of more than ten calls, tell me how much quota you estimate it will use and try five first. Add these rules to my general file and show me the diff before saving.
```
