---
slug: skills
nivel: 2
titulo: From repeated process to skill
bajada: Instructions that Claude loads only when it needs them.
---

A skill is a folder with instructions (and, if needed, scripts) for a specific task. The difference from the [general file](contexto-general.html) is that it isn't always loaded: Claude reads it only when the request calls for it. If those instructions lived in the general file, I'd pay for them in every message.

My rule is simple: whatever I've done twice becomes a skill.

## The ones I use

- **Proofread a text.** Typographic and style correction of my texts, with my style sheet and the [voice manual](briefs.html). It returns the changes as “original → corrected” and never rewrites in a voice that isn't mine.
- **Prepare an exam.** From the folder with a course's readings, it organizes and renames the files, does the OCR on my computer (without spending quota), builds notes by topic with [subagents at low effort](modelos.html), a study plan, a mock exam and a printable booklet. I built it with the first course and I've already used it on three.
- **The ones in my writing app**: logging new texts, tracking contests and building presentations. They live inside the app's project, because they're only useful there.
- **The ones behind the [scheduled tasks](tareas.html)**: at heart, each task is a skill that runs at a fixed time.

## How I build one

1. I write what it does, when it's used and what criteria it follows. The description matters: it's what Claude reads to decide whether to load it.
2. The step by step, with everything heavy in scripts that run on my computer: converting, renaming, counting, validating. What a script does doesn't spend tokens.
3. I test it with a real case and compare it with what we did by hand.
4. After each use, if something got stuck, I adjust it right then.

Personal skills go in `~/.claude/skills/` and work in every project; a project's own go in `.claude/skills/` inside its folder.

```text
We've already done this twice: [process]. Turn it into a skill. First write what it does, when it's used and what criteria it follows; then the step by step, with whatever scripts are needed so the heavy stuff runs on my computer and not in the conversation. If it launches subagents for batches, run them at low effort. Test it with a real case and compare it with what we did by hand.
```
