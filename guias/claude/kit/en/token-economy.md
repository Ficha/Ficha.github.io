# Token economy: reference

Check when planning heavy, scheduled or weekend tasks. The everyday rules are in the general `CLAUDE.md`. Limits change: verify under *Settings > Usage*.

## Mechanics
- Every turn rereads the whole context: the cost per turn grows with the length of the session. Long context = more expensive and worse.
- Generating text costs much more than reading it. Asking for diffs and short answers saves the most.
- What consumes: messages, replies, files read, web results, reasoning and the definitions of active connectors and tools.

## Limits
- **My account: [plan], weekly reset [day] at [time].**
- 5-hour window from the first message. Weekly limit with a fixed reset per account: that's the one to manage.
- Single pot: claude.ai, apps, Claude Code and scheduled tasks all draw from the same limit.

## Consumption ranking (most → least)
1. Long sessions · 2. Big models (Opus > Sonnet > Haiku) · 3. Research and web · 4. Heavy files (PDFs with images) · 5. Agents and subagents · 6. Extended thinking on simple tasks

## Usage calendar
- **Night (scheduled tasks):** recurring research ([topic]), batch drafts, heavy reviews. Drafts only: they never send or publish.
- **Early start:** a light task at 6 a.m. makes the window reset at 11 → two windows in the day.
- **Before the weekly reset (leftovers are lost)**, in this order:
  1. Infrastructure: skills, distilled style sheets, brief templates.
  2. Distill long documents into 1-page briefs.
  3. Postponed research ([topics]).
  4. Audits: context files, skills, my own texts against my voice profile.
  5. Calibrate models: try Opus where Sonnet is used.

## On claude.ai (doesn't apply to Claude Code)
- Edit the message instead of correcting with a new one; branch by editing an earlier message.
- Projects per client or front with a 1-page brief; curate the knowledge (it always takes up context).
- Turn off connectors not used in that chat. Research only for real research.
- Criteria instead of adjectives: "120 words max, no gerunds, end on a fact".
