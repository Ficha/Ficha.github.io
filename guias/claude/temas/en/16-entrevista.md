---
slug: entrevista
nivel: 4
nuevo: si
titulo: The interview that sets everything up
bajada: A long document and a short prompt so Claude interviews you and adapts all this to you.
---

This guide has a problem: it's mine. The folders, the names, the rules in the general file, all of it came out of how I work. If you copy it as is, you'll spend an afternoon deleting my projects from your templates. So I built a separate document, meant for Claude to read and ask you the questions I'd already answered for myself.

## What the document is

It's a single file, `guide-to-share.md`, that you download from the [kit](kit.html). It gathers the essentials of these cards with none of my data: how the quota gets spent, the token-economy rules, the folder organization, the templates for the general file and the project file, the quality criteria and a questionnaire in blocks. It's long on purpose. It's made to be read once, not loaded in every session (that would be repeating the mistake I tell about in [How the quota gets spent](como-se-gasta.html)).

The first version is from October 8, right the week I ran out of quota (coincidence has a sense of humor), and I've kept updating it with what I learned. That's why it includes the session caps and the rule of planning in Opus and executing in Sonnet.

## How to use it

1. Save it in your parent folder, the one that holds all your projects, with the name `_claude-guide.md`. The underscore signals that it's an internal, reference file. If you don't have a parent folder yet, [Folders](carpetas.html) explains why it's worth having one.
2. Open Claude Code in that folder and pick Opus. It's the only time: designing the system is thinking work.
3. Paste the prompt below.
4. When it's done, go back to Sonnet, the everyday model.

The interview takes a while, but it's built around three questions at a time, so you can leave it and pick it up later. If you answer “I don't know,” Claude proposes the option the document recommends and moves on. You don't need to know how to code, either: the prompt asks it to explain any technical term in plain words.

## What Claude does

First it looks at what you already have, without touching anything: the top-level folders, your general file if you have one, each project's file, the skills and the permissions. It tells you what it found. Then it interviews you, skips whatever can be deduced from your files (and tells you what it skipped) and only at the end proposes, one thing at a time, your general file, the quality files, each project's file, a migration plan if you want to rename folders, the first skill worth building and a short list of what's left for you to do by hand.

I put two of the prompt's rules in from experience. It never deletes anything and, if something in your files contradicts the document, it asks you which one stays. And every file is shown before it's saved. An interview that rewrites your setup without telling you is a good way to lose what was already working.

## If it helped

The document ends with an invitation: if the prompt helped, come back to this guide. It's not mandatory, but it helps me know whether anyone really uses it (I confess it's the part I care about most).

```text
Read the file _claude-guide.md in this folder once: it's a guide to organizing projects with Claude Code. I want to adapt it to me without breaking what I already have.

First look at what exists, without changing anything: top-level folders, my ~/.claude/CLAUDE.md, each project's CLAUDE.md, the skills and the permissions. Tell me in a few lines what you found.

Then interview me with the guide's questionnaire, three questions at a time and in blocks. Skip what can already be deduced from my files and tell me what you skipped. If I answer "I don't know," propose the recommended option and keep going. Explain any technical term to me in plain words.

When you're done, propose one at a time, showing me each file or diff before saving it: my general file, the quality files, each project's file and the first skill. Never delete or move anything, and don't save anything until I approve it. When you finish, tell me to go back to Sonnet.
```
