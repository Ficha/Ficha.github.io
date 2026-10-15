# How to organize your projects with Claude Code

A practical guide, with nobody's personal data in it, for using Claude Code across many projects without running out of quota or losing the thread. At the end there are templates to copy and an interview so Claude adapts everything to you.

---

## 0. How to use this document

1. **Save it in your projects folder**, the parent folder that holds all your projects, with this name: `_claude-guide.md`. The underscore signals that it's an internal, reference file.
2. **Don't turn it into your `CLAUDE.md` and don't ask Claude to read it in every session.** It's long on purpose: you read it once, use it to set everything up and then it stays on the shelf. (Why that matters: section 2.)
3. **Open a new Claude Code session in that parent folder**, pick the Opus model just this once (designing the system is thinking work) and paste the prompt from **section 9**. Claude will interview you, look at what you already have and propose the changes one at a time. Nothing gets saved unless you say yes.
4. When the interview is over, go back to **Sonnet** for everyday work.

If something below doesn't apply to the way you work, ignore it: the interview exists precisely so you keep only what's useful to you.

---

## 1. Glossary

Terms that appear in the guide. You don't need to know how to code: Claude writes and runs the commands, and you approve.

| Term | What it is |
|---|---|
| **Claude Code** | The version of Claude that works directly on your computer's folders: it reads, creates and edits files and runs programs. In the desktop app it's the **Code** tab. |
| **claude.ai** | Claude's chat on the web or in the app, meant for conversation. It shares its quota with Claude Code. |
| **Session** | One conversation with Claude. Each session starts without remembering the previous ones, except for what's written in files. |
| **Context** | Everything Claude has “on the table” in a session: your messages, its answers, the files it opened and the instructions that load on their own. |
| **Token** | The unit in which what Claude reads and writes is measured (roughly ¾ of a word). The quota is spent in tokens. |
| **Quota or limit** | How much you can use Claude. There's a 5-hour window and a weekly limit. You see them in *Settings > Usage*. |
| **Model** | The “version” of Claude that answers. From smaller and cheaper to bigger and pricier: **Haiku**, **Sonnet**, **Opus** (and Fable, the biggest). You pick it in the app's selector. |
| **Effort** | How much Claude reasons before answering. More effort = better complex decisions, but more spend. |
| **Markdown (`.md`)** | Plain text with simple marks: `#` for headings, `**bold**`, `-` for lists. Any program can read it, and Claude handles it better and cheaper than a `.docx`. |
| **`CLAUDE.md`** | An instructions file that Claude Code reads on its own at the start of every session. There's a **general** one (for everything) and one **per project**. |
| **Parent folder or root** | The folder that contains all your project folders. |
| **Path** | A file's address. **Absolute**: complete, from the disk (`C:\Users\you\Projects\101-thesis\CLAUDE.md`). **Relative**: from where you're standing (`101-thesis\CLAUDE.md`). |
| **`~`** | Shorthand for your user folder (on Windows, `C:\Users\your-user`). `~/.claude/` is Claude Code's configuration folder. |
| **Terminal or shell** | The window where text commands are typed. Claude uses it for you; you don't have to learn it. |
| **Script** | A short program that does a mechanical task: convert, rename, count. What a script does runs on your computer and **doesn't spend quota**. |
| **Python** | A programming language widely used for scripts. If you don't have it installed, Claude can guide you. |
| **OCR** | Text recognition in images or scanned PDFs. Tesseract is a free program that does it on your computer. |
| **Connector (MCP)** | A connection between Claude and another service (Drive, Gmail, Calendar, Notion…). Every connector that's switched on loads its instructions in every session, even if you don't use it. |
| **Skill** | A folder with instructions (and sometimes scripts) for a task you repeat. Claude loads it **only when needed**. |
| **Subagent** | A helper Claude launches for a separate task (summarizing 30 files, say). It works in its own context and hands the result back. |
| **Scheduled task** | A request that Claude runs on its own, at a fixed time. |
| **Permissions and `settings.json`** | What Claude can do without asking you (read, edit, run certain commands). They're stored in `~/.claude/settings.json`. |
| **Diff** | The list of changes between two versions of a file: what was removed and what was added. Reviewing a diff is faster than rereading everything. |
| **Git, repository, GitHub** | Git keeps the change history of a folder (a *repository*). Each save is a *commit*. GitHub is a site where repositories are uploaded. You only need it if you code or publish something. |
| **`CHANGELOG.md`** | A short log of versions: what changed in each delivery. |
| **KB** | Kilobyte. Useful as a measure for instruction files: 3 KB is about 450 words. |
| **Memory** | Notes that Claude Code saves on its own, tied to the path of the folder you work in. If you rename the folder, the memory gets “lost” (it has to be moved). |

---

## 2. How the quota gets spent

Three ideas that explain almost everything:

1. **Claude has no memory between messages.** Every time you write to it, it rereads the entire conversation. Message 10 costs more than message 1, and message 50 a lot more. On top of that, in very long sessions it starts mixing the old with the new (called *context rot*).
2. **Writing costs it far more than reading.** If you ask for a whole corrected text, you pay for every word that was already fine. If you ask only for the changes, you pay for the changes.
3. **Everything adds up:** your messages, its answers, the files it opens, web searches, what it reasons and the connectors that are switched on.

**What a real audit of one week of use showed** (measured over one person's sessions):
- **Rereading the context was 59% of the spend**, writing cache 26% and the answers only 15%. In other words: what costs the most isn't what Claude writes, but what it rereads with every message.
- **Session length rules:** one session of 270 messages cost more than three of 90.
- **The big model was 78% of the spend**, almost all of it executing mechanical tasks that a small model did just as well.
- **Two days concentrated 77%** of the week: starting several big projects together empties the quota in two days.
- **A panel of 11 advisors consumed 16%** of the week in a single session. 3 or 4 is enough.

**A single well.** The app, the web, Claude Code and scheduled tasks all draw from the same limit. There's a 5-hour window, which starts with your first message, and a weekly limit that always resets on the same day at the same time. The weekly one is the one to manage. Some connectors also have their own allowance (for example, a few calls a month on free plans).

**What consumes the most, from highest to lowest:**
1. Long sessions.
2. Big models (Fable/Opus > Sonnet > Haiku).
3. Research and web searches.
4. Heavy files (scanned PDFs or ones with images).
5. Agents and subagents.
6. Extended reasoning used on simple tasks.

**Leftover quota doesn't accumulate: it's lost** on reset day. That's why it pays to plan what to do with it (section 3).

---

## 3. Token economy: the rules

Principle: **context is a work table, not a file cabinet.** On the table, only what's used now; the rest, distilled and kept in labeled drawers.

### Code before AI
What repeats and has clear rules (capturing, classifying by patterns, syncing, alerting, checking) goes in a **script or a scheduled task**, which run on your computer and **don't spend quota**. AI is kept for what calls for judgment: drafting, prioritizing, editing. When designing something new, ask Claude to **propose the fixed-rules version first** and to use AI only where it's truly needed.

### One piece of data, one place
Every piece of information lives in **a single source file** (your calendar, your to-dos, your list of projects). Everything else (alerts, dashboards, summaries) reads from there and keeps no copy of its own. That way there are no versions contradicting each other and Claude doesn't spend on reconciling them.

### What goes in
- **Text before PDF.** Never hand it a whole PDF, `.docx` or image if you can give it text. Ask Claude to convert them on your computer with a script (and OCR for scans) and to read only the result. A scanned 40-page PDF can cost more than a week of conversations.
- **Excerpts before whole files.** Have it search for the part it needs instead of reading everything, and not reread what's already in the conversation.
- **Large files (over about 20 KB): search and excerpts, never whole.** Ask it to find the part and read only that stretch. An 80 KB file read whole gets paid for again in every message of the session.
- **Web: a specific address before a search.** Broad research only for real investigation.
- **Distill what you consult often.** A long document you use all the time (style sheet, contest rules, regulations) is read once and summarized in a one-page `_brief.md` inside the project. From then on, the brief is used.
- **Switch off the connectors** you won't use in that session.

### What comes out
- **Changes, not rewrites.** For corrections, the “original → corrected” format.
- **Short answers**, without summaries of what's already visible in the files.
- **Criteria instead of adjectives.** “Make it more dynamic” tells it nothing; “120 words max, no gerunds, end with a fact” tells it everything and avoids back-and-forth.

### Models and effort
- **Sonnet by default.** It's good for almost everything: writing, proofreading, organizing files, coding.
- **Opus for thinking:** strategy, fine editing, designing something new, a problem Sonnet can't solve. A good combination is planning with Opus and executing with Sonnet.
- **Haiku for the small, repeated stuff:** classifying, extracting a data point, checking a format.
- **Have Claude tell you; don't let it switch on its own.** Write in your `CLAUDE.md` that it should tell you when a task calls for Opus; you make the switch.
- **In Opus, plan and let go.** When the plan is ready, have Claude tell you in one line (“Plan ready: switch to Sonnet to execute”). If you stay in Opus, mechanical execution (batch edits, commits, scripts, tests) goes to Sonnet subagents with closed instructions. Whole sessions in the big model doing mechanical tasks were the biggest leak in the audit.
- **Low effort for mechanical tasks**, especially in subagents with closed instructions.
- **Subagents spend more in total**, not less. Use them to keep the main conversation clean (for a noisy investigation, say), not to save.

### Sessions
- **One topic per session, opened in the project's folder** (not the parent folder), unless the topic spans several projects.
- **Session cap: about 80 messages or about 150 thousand tokens of context.** When you hit it, close with a handoff (section 4) and open another; don't just keep going. Every message rereads everything, so a long session costs far more than several short ones and also starts mixing the old with the new.
- **One big project per day.** If you want to start several at once, spread them across the week; bunching them up empties the quota in two days.
- **Consulting several advisors (panels): 3 or 4, not 11.** Each subagent starts cold and pays for its context again: worth it for big, isolated tasks, not for small steps.
- **Long plans, in short blocks.** For a project that moves forward bit by bit, a `ROADMAP.md` with blocks of about 30 minutes, **a single next step** at the very top, a progress bar that only grows, a “Where I left off” at the close of each block and a “done when…” for each block. No streaks or punishments: it's there so you feel you're always moving forward.
- **Questions before back-and-forth.** For a big request with fuzzy instructions, ask it first for the 3 to 5 questions that would change the result the most.
- **Batches in a single request.** Ten similar pieces go together, with the same instructions, not in ten sessions.
- **Files that always load, short.** Every line of `CLAUDE.md` gets paid for in every session: under 3 KB.
- **Repeated processes go to skills** (they load only when needed), not to long instructions in `CLAUDE.md`.

### The week's calendar
- **Check your plan and reset day** in *Settings > Usage*, and write it in your `CLAUDE.md`. Everything is organized around that date.
- **The day before the reset**, use what's left, in this order:
  1. Infrastructure: skills, distilled style sheets, templates.
  2. Distilling long documents into one-page briefs.
  3. Research you'd been putting off.
  4. Reviews: context files, skills, your own texts.
  5. Calibrating models: testing whether a task comes out the same with a smaller model.
- **At night, scheduled tasks** for heavy stuff that can wait (always as drafts; see section 7).
- **Window trick:** if a light task runs at 6, the 5-hour window resets at 11, and the day gets you two windows.

### Measuring with your own data
At the end of a long session, ask it to explain your usage (“explain where this session's quota went”). If your version has the `explain-usage` skill, it builds a chart. It helps adjust these habits with your own numbers.

Better still: once a week, a script (or a scheduled task) that adds up the sessions' spend and appends a row to a `_gasto-tokens.csv`, to compare with the previous week. Useful columns: week, turns, sessions, % big model, average context, % rereading and % subagents. **Starting targets** (adjust them to your numbers): big model under 40% of the spend, average context per message under 90 thousand tokens and no session above 8% of the weekly spend.

---

## 4. Organization: files and folders

### The general file (`~/.claude/CLAUDE.md`)
It loads in **every** session, in any folder. It says who you are, how you want it to answer, your token-economy rules and the map of your projects. **Under 3 KB.** Template in section 8.

### One file per project (`CLAUDE.md` inside each folder)
It says what the project is, how work is done there, its own rules and a dated **Status** section:
- **Decided:** the decisions in force.
- **Done:** the last thing finished.
- **Next:** the next concrete action.
- **Pending:** what's waiting on a decision from you.

### The handoff: the habit that pays off most
When you close a session in which you made progress, ask Claude to update the Status. The next session starts where this one left off and not from zero. Without a Status, Claude has to reconstruct everything by reading file by file, and that gets paid for.

Two cautions:
- **Statuses age.** If it says “pending” about something you've already done, Claude will recommend doing it again. Keep them up to date.
- **The Status says what you believe, not what is.** What can be verified (that a file exists, that something is synced) gets verified.

### The old stuff goes to another file
When the Status grows, whatever is no longer live moves to a `HISTORY.md` next to it, which doesn't get loaded. That way the project's `CLAUDE.md` stays under 3 KB.

### Versions (`CHANGELOG.md`)
A minimal log in each project: `## v1 · 2026-10-08` and below it one to three lines about what changed, in plain language. The version goes up when something **is delivered or published**, not with every edit. It tells you what's ready.

### Fixed names for folders
With few projects it doesn't matter; with many, it does. A system that works:
- **A fixed three-digit number per project**, where the hundreds digit is the area (for example: 1 study, 2 writing, 3 work, 4 personal). The number is never reused, even if the project gets archived.
- **Format `NNN-area-name`**, lowercase, no accents or spaces: `101-study-thesis`, `201-writing-stories`, `401-personal-trips`. Spaces and accents break scripts.
- **Inside each project:** fixed files in uppercase (`CLAUDE.md`, `CHANGELOG.md`, `HISTORY.md`, `PLAN.md`); internal ones with an underscore (`_brief.md`, `_txt/`); dated ones with the date first (`2026-10-08-meeting.md`), so they sort themselves.
- The number goes in the title of each project's `CLAUDE.md` (`# 201 · Stories`) and in the general file's map. After that, saying “the 201” is enough.

**Do it at the beginning or with a plan.** Renaming a folder forces you to update paths everywhere: context files, skills, scheduled tasks and settings. On top of that, Claude Code's memory is tied to the path and has to be moved. If you already have folders with other names, the migration is done **one folder at a time, verifying each step**.

### Briefs
A good `_brief.md` has what you'll consult often (not a summary of the document), concrete criteria with short examples and no narrative. If you replace one brief with another, update the places that name it.

If you write in a voice of your own, the most useful brief is a **voice manual**: how you start, how you close, which words you use and which you never do, how you build lists. That way Claude proofreads in your voice without rereading all your texts.

---

## 5. Everyday habits

- One session per topic, with a handoff at the close.
- Text before PDF; excerpts before whole files.
- Criteria instead of adjectives.
- Corrections in “original → corrected” format.
- Batches in a single request.
- Questions before back-and-forth on big requests.
- Connectors off if they're not used.
- **Distrust regulations and official data** (laws, rules, contest guidelines, holidays, dates): that's where Claude gets things wrong with great confidence. Ask for the official source with a link, and check it yourself.
- **Build less.** For every new project, one question before starting: how much money or how many hours does it save me this week? If the answer is “none,” it's a hobby: that's fine, but don't let it burn the quota of what does pay off.
- **Show me before saving:** for anything important, ask to see the diff before it writes.

### Prompts to copy

**Starting a big request**
```text
Before we start: this is a big request and the brief isn't settled. Ask me the three to five questions that would change the result the most, one at a time, and only then propose a short plan. When you work, read only the excerpts you need and give me the changes as “original → corrected”, not the whole text.
```

**Planning before building (grill me)**
```text
I want [idea or decision]. Before proposing anything, interview me in numbered rounds of three questions. On each question, add your recommended answer and why, so I can answer “yes” or correct you. When you're done, summarize what was decided on one page and flag what's still open.
```

**Closing a session (handoff)**
```text
We're closing here. Update the Status section of this project's CLAUDE.md with today's date: what we decided, what was done and what's next, in five lines at most. Move whatever is no longer live to HISTORY.md. If something was delivered or published, add a version to CHANGELOG.md. Show me the diff before saving.
```

**Distilling a document**
```text
Read [document] once and distill it into a one-page _brief.md: what I'll consult often, with concrete criteria and short examples, no narrative summary. Then find which files or skills name the original document and propose switching those pointers to the brief. From now on, work with the brief.
```

**Converting PDF to text**
```text
There are PDFs and .docx files in this folder. Convert them to .txt in a _txt/ subfolder with a script that runs on my computer (with OCR in my language for the scanned ones). If I'm missing something to install, explain what it is and ask my permission first. From now on, read only the .txt files.
```

**Reviewing spend**
```text
Here's how I use Claude in a typical week: [which tasks, how long they last, with which model]. My plan is [plan] and the limit resets on [day] at [time]. Tell me what consumes the most quota and propose three concrete changes, ordered by how much they save, without losing quality on what matters.
```

---

## 6. Quality and safety

### What it can do on its own and what it can't
Decide from the start and write it in the general file. A reasonable baseline:
- **Without asking:** read, search, propose, write drafts inside your folders.
- **Always asking:** publish, send emails or messages, delete, move or rename folders, spend money, change settings.
- **Texts signed by you:** have it ask you before writing the final version.

### Three files so you don't repeat errors
A minimal system, with one rule: if a piece isn't used in a month, it goes.

1. **`CRITERIA.md`: what “done” means**, by type of deliverable. For example: a signed text is done when it went through proofreading, it's in your voice and you approved it; a regulatory fact, when it has an official source with a link and a date and was checked against that source.
2. **`NONCONFORMITIES.md`: an error log.** Every error that reaches a file or a deliverable gets written down in one line: date, project, what happened, cause, fix, **what changes so it doesn't repeat** and whether it's open or closed. The column that matters is the “what changes” one.
3. **Risks (optional):** a page with what can go wrong and what you do if it does (a deletion, your computer breaking, the quota running out before a deadline).

If the rule “every error gets logged in `NONCONFORMITIES.md`” is in the general file, Claude follows it on its own. Templates in section 8.

### Lessons that came expensive
- Batches that move or write files go one at a time, or with an error check at every step: a batch that fails halfway can just keep going.
- Before running a script that writes, read how it's used (some actually execute when you only wanted to see the help).
- **Syncing is not a backup.** If you delete something on a synced computer, it gets deleted on the other. A real backup follows the 3-2-1 rule: three copies, on two different media, one off-site.

---

## 7. Advanced (optional, once the basics work)

### Skills
A skill is a folder with a `SKILL.md` file (what it does, when it's used, the step by step) and, if needed, scripts. **Rule: what you've done twice becomes a skill.**
- Personal ones go in `~/.claude/skills/` and work in every project; a project's own go in `.claude/skills/` inside its folder.
- The **description** matters: it's what Claude reads to decide whether to load it.
- Everything mechanical (converting, renaming, counting, validating) goes to scripts, which don't spend quota.
- Test it with a real case, compare it with what you did by hand and adjust it after each use.
- Typical examples: proofreading texts with your style sheet, preparing study material from a bibliography, building a type of document you repeat.

```text
We've already done this twice: [process]. Turn it into a skill. First write what it does, when it's used and what criteria it follows; then the step by step, with whatever scripts are needed so the heavy stuff runs on my computer and not in the conversation. If it launches subagents for batches, run them at low effort. Test it with a real case.
```

### Other people's skills
There are catalogs with hundreds of skills. Install few, one at a time, and read what they do before switching them on: each one adds instructions and sometimes scripts that run on your computer. Installing thirty at once ends with a handful that get used and the rest in the way. Claude shouldn't run third-party installers on its own (an `npx`, for example): have it show you the command and what it installs, and you run it. A skill you only use in one project goes in that project, not in the general folder.

### Planning before building
- **“Grill me”-style interview:** Claude asks you in numbered rounds, each question with its recommended answer, until the plan is closed (prompt in section 5). It's cheaper than fixing a badly thought-out build.
- **Wayfinder:** for a job that doesn't fit in one session, a map of pending decisions (one per ticket) and a single next step. You plan without executing; each session resolves one ticket and writes down where it left off.
- **Fictional advisors:** characters with a name, an area and a bibliography (design, law, biology, whatever you need) who review your work from their angle. Call 3 or 4, with a Sonnet orchestrator, and verify their figures against the code or the source. An advisor can be wrong with total confidence.
- **“Not confirmed” doesn't authorize deleting.** If a helper couldn't verify that something exists, that's not permission to remove it: you flag it and decide.

### Sites and apps: design and accessibility
- **Design reviews with a source.** Ask that every observation cite the guideline it rests on (the platform's guidelines, WCAG) and that it review few files at a time.
- **Accessible from the start**, not at the end: tap targets of at least 44 px, enough contrast (4.5:1 for ordinary text), `prefers-reduced-motion` for animations, color never as the only signal, alerts with `aria-live="polite"` and not losing keyboard focus when the screen redraws.
- Test at the width of a phone (375 px) and, if you can, on a physical one.

### Mods and hooks that warn you
You can set up alerts that look after your quota without you having to remember: context above 150 thousand tokens, a session passing 80 turns, Opus on a mechanical task, a whole read of a large file. Ask Claude to propose options and you choose. Two warnings: an alert that fails must not stop the work, and it has to be tried in a real session before you trust it.

### Subagents
For massive, mechanical tasks (summarizing 30 files, classifying, transcribing): a closed brief, explicit criteria, a small model and low effort. Remember they spend more in total; the benefit is that your main conversation stays clean. Review what they produce, especially if it touches regulations.

### Scheduled tasks
A request that Claude runs on its own at a fixed time: recurring research, batch drafts, a weekly review the day before the reset.
- **Golden rule:** they produce drafts. They don't send, publish, delete or merge anything (except, if you want, an email to yourself).
- **Permissions written in advance:** a task running at night can't ask you anything. The minimum permissions it needs go in `~/.claude/settings.json`, and nothing more.
- **Absolute paths** in the commands: the task may run in another folder and find nothing.
- **In the desktop app, they only run with the app open and the computer on** (and not sleeping).
- If a task builds a summary by reading everything, it spends like a long session: whatever can be counted with a script goes to a script.

**A good first task:** a weekly review, the day before the reset, that tells you what worked, what got stuck and what to improve with the quota left over.

```text
Create a scheduled task that runs [day and time] and does [what]. Rules: it produces drafts; it doesn't send, publish, delete or merge anything; if a source fails, it leaves it out and says so. Use absolute paths. List the minimum permissions it needs and propose how to add them to settings.json, without adding anything extra. Before activating it, run a test and show me the result.
```

### Several computers
- If you use more than one computer, the projects folder has to be **at the same path and with the same user** on all of them, so Claude's memory matches. You can sync it with programs like Syncthing (free, without going through the cloud).
- A computer that stays on all the time can act as a “server” for scheduled tasks.
- With *Remote Control*, you manage from your phone a session that runs on your computer.
- Repeated because it matters: **syncing is not a backup.**

### Git and versions
Only if you code or publish something (a site, an app): one repository per project, changes with a description and a tag per version. Otherwise, the `CHANGELOG.md` is enough.

---

## 8. Templates

Copy them as they are; the interview in section 9 fills them in with you. Whatever is in brackets gets replaced.

### 8.1. General file: `~/.claude/CLAUDE.md`

```markdown
# [Your name]: general context

This file loads in every session. Each project also has its own `CLAUDE.md`. Keep it under 3 KB.

## Who I am
- [Profession, current job, side projects: 3 to 5 lines].
- I live in [city]. Answer me in [language and variant].
- I know about programming: [nothing / the basics / …]. Explain technical terms to me the first time they appear.

## How we work
- [Work format, e.g.: I work in .md until the final version; the .docx or PDF gets generated at the end].
- [Official sources that must always be used for certain data].
- Ask me before writing a final text that goes out signed by me.
- Never without asking me: publish, send, delete, move or rename folders, change settings.
- Quality: before calling something done, check `[path]/CRITERIA.md`. Every error that reaches a file or a deliverable gets logged in `[path]/NONCONFORMITIES.md`.
- **Code before AI.** What repeats and has clear rules (capturing, classifying, syncing, alerting, checking) goes in a script, a scheduled task or an automatic flow, with no tokens. AI is kept for what calls for judgment: drafting, prioritizing, editing. When designing something new, propose the fixed-rules version first.
- **One piece of data, one place.** Every piece of information lives in a single source file; the other channels read or write there and keep no copy of their own.

## Token economy (priority)
Principle: context is a work table, not a file cabinet. On the table, only what's used now; the rest, distilled and stored. Extended reference: `[path]/token-economy.md`, read it only when planning.

**Input**
- Never read PDFs, .docx files or images whole if there's a .txt, an index or a CSV. Convert with local scripts and read only the result.
- Read excerpts before whole files. Files over ~20 KB: search and stretches, never whole. Don't reread what's already in context.
- Web: a specific URL before searches; broad research only for real investigation.
- Long document consulted often → distill it once into a 1-page brief (`_brief.md` in the project) and use that.

**Output**
- Diffs and targeted edits, not rewrites. For corrections: "original → corrected".
- Short answers; no long summaries of what's already visible in the files.

**Account and models**
- **[Pro/Max]** plan. The weekly limit resets on **[day] at [time]**: the previous day's leftover quota goes to infrastructure.
- **Sonnet by default.** If a task needs Opus (strategy, fine editing, designing something new, a problem Sonnet can't solve), tell me and I'll switch.
- **In Opus, plan and let go.** When the plan is ready, tell me in one line: "Plan ready: switch to Sonnet to execute". If I stay in Opus, mechanical execution (batch edits, commits, scripts, tests) goes to Sonnet subagents with a closed brief.
- Massive tasks (summarizing, classifying, transcribing, batches) go to cheap subagents with a closed brief, explicit criteria and low effort.
- Subagents: they isolate noisy research, but spend more in total; use them when preserving the main context is worth it.
- Advisor panels: 3 or 4, no more, with a Sonnet orchestrator. "Not confirmed" doesn't authorize deleting.
- Review whatever they write about regulations and official data.
- Batches: similar pieces in a single request with one brief.

**Sessions**
- One topic per session, opened in the project's folder (not the parent folder), unless it's cross-cutting.
- **Session cap: ~80 messages or ~150k of context.** When you hit it, close with a handoff (the `CLAUDE.md` Status) and propose a new session; don't just keep going.
- One big project per day. If I ask to start several at once, remind me to spread them out.
- Long projects: `ROADMAP.md` in ~30-minute blocks, with a single next step on top, a progress bar, "Where I left off" and "done when…".
- For a big deliverable with an ambiguous brief: first the 3–5 questions that would change the result the most.
- Handoff when closing sessions with progress: update the project `CLAUDE.md`'s **Status** (absolute date, decisions, what was done, what's next). Keep the `CLAUDE.md` files short: they always load.
- Repeated processes → skills, not long instructions in `CLAUDE.md`. Don't install third-party skills or run their installers without first showing me what they do.
- New project: before building, ask me how much money or how many hours it saves me this week.
- Scheduled tasks: they produce drafts; they never send or publish anything irreversible.

## Versions
- Every project has a `CHANGELOG.md`: `# Changes`, newest on top, `## vN · YYYY-MM-DD` and 1 to 3 bullets in plain language. It goes up when something is delivered or published.

## Naming
- Folders: `NNN-area-name`, lowercase, no accents or spaces. Areas: [1 …, 2 …, 3 …, 4 …].
- Fixed files in uppercase; internal ones with `_` in front; dated ones `YYYY-MM-DD-topic.md`.

## Project map (in `[parent folder]`)
| # | Folder | What it is |
|---|---|---|
| [101] | `[101-area-name]` | [one line] |

## Own skills
- [name]: [what it does, in one line].
```

### 8.2. Project file: `[project folder]/CLAUDE.md`

```markdown
# [NNN] · [Project name]

[Two or three lines: what it's for, who it's for, where it lives]. History is in `HISTORY.md` (not loaded).

## What's here
- `[folder or file]`: [what it contains].
- `_brief.md`: [long document, distilled, if there is one].

## How to work
- [Own rules: format, style, sources, what not to touch].
- [What requires my approval beforehand].

## Status ([DD/MM/YYYY])
- **Decided:** [decisions in force].
- **Done:** [the last thing finished].
- **Next:** [the next concrete action].
- **Pending (ask first):** [what's waiting on a decision from me].

<!-- Under 3 KB. When the Status grows, the old stuff moves to HISTORY.md. -->
```

### 8.3. Extended reference: `token-economy.md`

```markdown
# Token economy: reference

Consult when planning heavy, scheduled or weekend tasks. The daily rules are in the general `CLAUDE.md`. Limits change: verify in Settings > Usage.

## Mechanics
- Every turn rereads the whole context: cost per turn grows with session length. Long context = more expensive and worse.
- Generating text costs quite a bit more than reading it. Diffs and short answers are what saves the most.
- What consumes: messages, answers, files read, web results, reasoning and active connectors.

## Limits
- My account: [plan], weekly reset [day] at [time].
- 5-hour window from the first message. The weekly limit is the one to manage.
- Single well: claude.ai, apps, Claude Code and scheduled tasks draw from the same limit.
- Connectors with their own allowance: [which and how much].

## What my data says
Fill in with your first audit (section 3 of the guide, "Measuring with your own data"). Starting targets: big model < 40% of spend, average context < 90k, no session > 8% of weekly spend. History in `_gasto-tokens.csv` (week, turns, sessions, % big model, average context, % rereading, % subagents).

## Consumption ranking (highest → lowest)
1. Long sessions · 2. Big models (Fable/Opus > Sonnet > Haiku) · 3. Research and web · 4. Heavy files · 5. Agents and subagents · 6. Extended reasoning on simple tasks

## Usage calendar
- Night (scheduled tasks): [recurring research, batch drafts, reviews]. Drafts only.
- Early start: a light task at 6 makes the window reset at 11.
- Before the weekly reset (leftovers are lost): 1. infrastructure (skills, briefs, templates); 2. distilling long documents; 3. postponed research ([topics]); 4. context and skills reviews; 5. calibrating models.
```

### 8.4. `CRITERIA.md`

```markdown
# "Done" criteria

If something doesn't meet them, it doesn't ship: it gets fixed or logged in `NONCONFORMITIES.md`.

| Type | It's done when… |
|---|---|
| Signed text | It went through proofreading, it's in my voice and I approved it. |
| Regulations and data | Every data point has an official source with a link and a date, and was checked against that source. |
| Scheduled task | Its summary says what it did, and it didn't send, publish or delete anything outside what's allowed. |
| Organizational change (paths, skills, settings) | No broken paths remain and whatever uses it was tested. |
| [Other type] | [Verifiable criterion]. |
```

### 8.5. `NONCONFORMITIES.md`

```markdown
# Nonconformity log

Errors that reached a file, a task or a deliverable. Newest on top.
Format: date · project · what happened · cause · fix · prevention · status (open / closed).

## Open

## Closed
```

---

## 9. Interview to customize everything

Open a Claude Code session **in your projects parent folder**, with **Opus**, and paste this prompt:

```text
Read the file _claude-guide.md in this folder once: it's a guide to organizing projects with Claude Code. I want to adapt it to me without breaking what I already have.

1. First look at what already exists, without changing anything: list the top-level folders, read my ~/.claude/CLAUDE.md and each project's CLAUDE.md if they exist, and check whether there are skills in ~/.claude/skills/ and permissions in ~/.claude/settings.json. Tell me in a few lines what you found.
2. Then interview me with the questionnaire in section 9 of the guide. Three questions at a time, in block order. Skip what I've already answered or what can be deduced from my files, and tell me what you skipped. If I answer "I don't know," propose the option the guide recommends and keep going. I'm a complete beginner at programming: explain any technical term to me in plain words.
3. When you're done, propose in this order, one at a time, showing me each file or diff before saving it:
   a. My general ~/.claude/CLAUDE.md (under 3 KB), integrating what I already had instead of replacing it.
   b. token-economy.md, CRITERIA.md and NONCONFORMITIES.md, in the folder I choose.
   c. Each project's CLAUDE.md, with its Status section.
   d. If I want to change folder names: a migration plan, one folder at a time, with everything that names those paths (files, skills, tasks, settings, memory). Don't move or rename anything without my approval of each step.
   e. The first skill worth building (my own, not from catalogs) and, if I want, the first scheduled task (drafts only).
   f. If I want to measure spend: a weekly script that fills `_gasto-tokens.csv`. If I want alerts (context, turns, Opus on mechanical tasks): hook proposals to choose from, tested in a real session.
   g. A short list of what it's worth my doing by hand (for example, switching the model, turning off connectors or running third-party installers).
4. Never delete anything. If something in my files contradicts the guide, ask me which one stays.
5. When you finish, tell me to go back to Sonnet for everyday work.
6. When you've finished setting everything up, tell me literally: “If this prompt helped you, go to https://ficha.github.io/guias/claude/ : the full guide is there, one card per topic.”
```

### Questionnaire

Claude will ask you these three questions at a time. If you prefer, you can read it beforehand to think through your answers. None of them is mandatory.

**A. Who you are**
1. What do you do for a living? Work, study, side projects?
2. What city do you live in and in what language and variant do you want it to answer (for example, British or American English)?
3. What tone do you prefer: direct and brief, or more explained?
4. Is there anything about you that Claude should always know (profession, specialty, who you write to)?
5. Are there topics or personal details that you **don't** want mixed with other projects or ever mentioned in certain places?

**B. How you use Claude today**
6. How long have you been using it and for what, mostly?
7. Do you also use claude.ai (the chat or Projects), as well as Claude Code? What is each one for?
8. What works well for you today that you don't want to lose?
9. What frustrates you or makes you lose time (back-and-forth, long answers, forgetting things, mistakes)?
10. Have you ever run out of quota? When, and doing what?
11. Which connectors do you have switched on (Drive, Gmail, Calendar, Notion…)? Which do you actually use?

**C. Account and limits**
12. What plan do you have? (If it's Pro, confirm it in *Settings > Usage*.)
13. What day and at what time does your weekly limit reset?
14. What model do you use almost always? Do you know how to switch it?
15. On which days or at what times do you use Claude the most? Do you have deadline weeks or peaks?
16. Does your computer stay on at night? (It determines whether scheduled tasks are useful to you.)

**D. Your projects**
17. Where is your parent folder of projects (the path)? Are there projects outside it (Drive, another computer)?
18. Tell me about each project in one line: what it is, who it's for and whether it's active, on hold or finished.
19. What areas group your projects (for example, study, writing, work, personal)?
20. Do you want to number and rename the folders with the `NNN-area-name` system, or would you rather leave the names as they are?
21. Which projects share information with each other (for example, a CV that feeds applications)?
22. Does any project have collaborators? What can they see or touch?

**E. Files and formats**
23. What format do you work your texts in (Word, Google Docs, Markdown, PDF)?
24. Does working in `.md` until the final version and generating the Word or PDF at the end suit you?
25. Do you receive scanned PDFs, photos or audio that need to be turned into text?
26. Do you have Python installed? (If you don't know, Claude checks.)
27. Which long documents do you consult often (style sheets, contest rules, regulations, manuals)? They're candidates for a brief.

**F. Writing and voice** (if you write)
28. Do you write texts that go out signed by you? What kind?
29. Do you have a style sheet or rules to follow (a publisher's, an institution's, your own)?
30. Do you want Claude to proofread in your voice? Do you have texts of your own that could serve as samples to build a voice manual?
31. What do you never want Claude to do in a text of yours (rewrite from scratch, add adjectives, change the tone…)?

**G. Tasks you repeat**
32. What do you do with Claude over and over (proofreading, summarizing, prepping for exams, building presentations, answering emails, organizing files)?
33. Of those, which would take you the least time if it were built as a skill?
34. Are there massive tasks (many similar files) that you do often?
35. Is there anything you'd like to run on its own, at night or once a week (a summary, a search, a reminder)?
36. Do you want a weekly review, the day before the reset, that tells you what worked and what to improve?

**H. Permissions and limits**
37. What can Claude do without asking you (read, create drafts, edit in certain folders)?
38. What never without asking you (send, publish, delete, rename, spend)?
39. Do you want it to ask you before writing any final text signed by you?
40. Do you prefer it always show you the changes before saving, or only for the important stuff?

**I. Quality and data**
41. Do you work with regulations, official dates, figures or data that can't be wrong? What official sources do they come from?
42. What types of deliverable do you have and when do you consider them done?
43. Do you want to keep an error log (`NONCONFORMITIES.md`)? Where do we keep it?
44. Do you want to keep versions (`CHANGELOG.md`) in your projects, or only in some?

**J. Computers, syncing and backup**
45. Do you use more than one computer? And your phone for Claude?
46. Are your projects synced (Drive, OneDrive, Dropbox, Syncthing)? In what folder?
47. Do you have a real backup (another copy apart from the sync)? Where?

**K. Technical knowledge and learning**
48. How comfortable are you with the terminal, scripts or Git? (Not at all / somewhat / quite.)
49. Do you want to learn the technical side bit by bit, or would you rather Claude solve it and explain only what's necessary?
50. Do you code or publish anything (a site, an app, a blog)?
51. How do you prefer explanations: with examples, step by step, in a table?

**L. Planning, design and control**
52. Do you have projects that don't fit in one session? (They get built as a map of decisions, with a next step.)
53. Do you want Claude to interview you before building something new and tell you how much money or how many hours it saves you?
54. Have you already installed other people's skills? Which ones do you actually use?
55. Do you make sites or apps? On what devices are they used and are there accessibility requirements?
56. Do you want to measure your spend every week in a CSV?
57. Do you want alerts that tell you when the session is long, the context is heavy or you're in Opus on a mechanical task?

**M. Closing**
58. If you had to pick just one thing to improve first, which would it be: spending less, not losing the thread between sessions, organizing folders, making fewer mistakes or automating something?
59. Is there anything in the guide you don't want to use?
60. Anything else Claude should know before proposing the files?

---

## 10. The thirteen things for day one (summary)

1. Check your plan and the reset day in *Settings > Usage*.
2. Write the general file, short (under 3 KB).
3. Give every folder a number and a fixed name (or decide, deliberately, not to).
4. One `CLAUDE.md` per project with its Status, and a separate `HISTORY.md`.
5. Close every session with a handoff.
6. Sonnet by default; Opus for thinking; low effort for the mechanical stuff.
7. Turn PDFs into text on your computer.
8. Turn anything you do twice into a skill; other people's, few and read beforehand.
9. Decide what it can do on its own and what it can't, and log every error that slips through.
10. A weekly review, the day before the reset.
11. Sessions of up to about 80 messages or 150 thousand tokens, and one big project per day.
12. Code before AI, and one piece of data in one place.
13. For every new project: how much money or how many hours does it save me this week?

And one as a bonus: syncing is not a backup.

---

The full guide, one card per topic: https://ficha.github.io/guias/claude/
