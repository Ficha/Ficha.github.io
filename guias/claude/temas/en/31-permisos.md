---
slug: permisos
nivel: 5
nuevo: si
titulo: Permissions that don't open the door
bajada: What I let Claude do without asking, and why a convenient wildcard can be a hole.
---

Claude Code asks for permission before running a command or opening a page. By the twentieth time it asks whether it can list a folder, you learn to approve just in case, and that's where the risk is. The fix is a permissions list in the settings: what it can do on its own, without asking.

Building it is easy. Building it well cost me a mistake.

## The wildcard

To avoid approving every `git log` in every repository, I had allowed `git -C * log *`: any folder, any option. It looks harmless, because `git log` only reads. But `git` has options that run other programs or write files, and the trailing asterisk let all of them through. A wildcard on a command with dangerous options is a door with the key left in it.

The new rule: don't approve by wildcard a command whose options can run or write things. If I use it often, I write a fixed script that does one thing, and approve the script.

## What else I adjusted

- **Web pages**: Claude could open any site. Now it has a list of domains. Anything not on the list, it asks me about.
- **[Tasks that run on their own](tareas.html)**: the nightly one no longer has permission to push, publish, send emails or change permissions. It leaves drafts and I decide.
- **What Claude can't touch**: its own settings. When it wanted to add two Windows tasks and some hooks, the system stopped it and left me the commands to run myself. It gave me work, and it was right to.

## Not approving blindly

There's a skill, `fewer-permission-prompts`, that goes through your transcripts, finds the read-only commands you approve often and proposes adding them to the list. It's useful, on one condition: read each one before accepting. It proposes; you hand over the key.

```text
Review my Claude Code permissions settings and flag every rule that uses wildcards on commands with options that can run programs or write files. For each one, explain the risk in one line and propose an alternative: a narrower rule or a fixed script that does one thing. Also check whether I can open pages on any domain and what permissions my scheduled tasks have. Don't change anything: show me the list and the proposed settings as a diff.
```
