# [Your name]: general context

This file loads in every session. Each project also has its own `CLAUDE.md`. Keep it under 3 KB.

## Who I am
- [Profession, current job, side projects: 3 to 5 lines].
- I live in [city]. Answer me in [language and variety].

## How we work
- [Working format, e.g.: I work in .md until the final version; the .docx or PDF is generated at the end].
- [Official sources that must always be used for certain data].
- Ask me before writing a final text that will go out under my name.

## Token economy (priority)
Principle: context is a work desk, not an archive. On the desk, only what's being used now; the rest, distilled and stored. Extended reference: `token-economy.md`, read it only when planning.

**Input**
- Never read whole PDFs, .docx files or images if there's a .txt, index or CSV. Convert with local scripts and read only the result.
- Read excerpts before whole files. Don't reread what's already in context.
- Web: a specific URL before searches; broad research only for real research.
- Long document consulted often → distill it once into a 1-page brief (`_brief.md` in the project) and use that.

**Output**
- Diffs and targeted edits, not rewrites. For corrections: "original → corrected".
- Short answers; no long summaries of what's already visible in the files.

**Account and models**
- **[Pro/Max]** plan. The weekly limit resets on **[day] at [time]**: leftover quota from the day before goes to infrastructure.
- **Sonnet by default.** If a task needs Opus (strategy, fine editing, architecture, a problem Sonnet can't solve), tell me and I'll switch.
- Opus thinks (plan, strategy, fine editing); Sonnet/Haiku execute. Bulk tasks (summarizing, sorting, transcribing, batches) go to cheap subagents with a closed brief and explicit criteria.
- Double-check anything written about regulations.
- Batches: similar pieces in a single request with one brief.

**Sessions**
- One topic per session. If a session runs long or changes topic, suggest closing with a handoff and opening a new one.
- Before a big deliverable with an ambiguous brief: first the 3–5 questions that would most change the result.
- Handoff when closing sessions with progress: update the **Status** of the project's `CLAUDE.md` (absolute date, decisions, what was done, what's next). Keep `CLAUDE.md` files short and curated: they always load.
- Repeated processes → skills (they load only when needed), not long instructions in `CLAUDE.md`.
- Scheduled tasks: produce drafts; they never send or publish anything irreversible.

## Versions and changes
- Each project has a `CHANGELOG.md` at its root: `# Changes`, newest on top.
- Version = whole number that goes up by one: `## vN · YYYY-MM-DD`. It goes up when something is delivered or published, not with every edit.
- Below, 1 to 3 one-line bullets in plain language. Fixes start with "Fix:".

## Project map (in `[root folder]`)
| Folder | What it is |
|---|---|
| `[project-1]` | [one line] |
| `[project-2]` | [one line] |

## My skills
- [name]: [what it does, in one line].
