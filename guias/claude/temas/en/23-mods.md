---
slug: mods
nivel: 5
nuevo: si
titulo: Mods that warn you
bajada: Changes to Claude Code's interface that stop me before I overspend.
---

Writing “the cap is 150k” in a file isn't enough. I wrote it, I read it and I walked right past it several times. What works is having something tell me at the moment, on screen, as the session is getting there.

Claude Code lets you make *mods*: changes to its own interface and behavior, like a band above the text box, an alert, a custom command or a hook that runs before an action. There's a skill, `plugin-authoring`, that helps you build them. I used it to turn my token-economy rules into alerts.

## The first one: the 150k alert

It started with a single thing: a warning when the session reaches 150k of context, which is the cap I set for myself. Then I asked it for the eight most useful mods for the way I work. It proposed a list, I said “all except number 8” and that left seven.

## The seven

1. **Session meter.** Shows the turns (x of 80) and the context (x of 150k), and warns at 80% and 100%.
2. **Opus alert.** If I've done several mechanical actions in a row in Opus (batch edits, running scripts), it suggests switching to Sonnet.
3. **Reading guard.** Blocks reading whole PDFs and Office files, and files over 20 KB. You have to use Grep or read a fragment.
4. **SEO traffic light.** Won't let me merge a site change unless the SEO and preview check ran first.
5. **Project band.** Shows which project is active, so I'm not working in the wrong folder.
6. **`/traspaso`.** Builds the session closing: updates the project's status and writes down what's next.
7. **`/strategos`.** Opens the overall status panel for my projects.

## What I learned

- **Propose and choose.** Having Claude propose a list and me crossing things out was faster than dictating the mods one by one.
- ***Hot reload*.** For them to load, you have to accept the session's hot reload prompt (or open Claude Code with the mod's folder). Otherwise you think they're running and they're not.
- **Guards fail open.** If the check breaks, they let things through. That's fine (a guard that blocks everything ends up disabled), but it means they can stop protecting you without telling you. The SEO traffic light, for example, turns green if the script finds failures but exits without an error.
- **Almost no tests.** Of the seven, only the reading guard has tests, and none has been tried yet in a real session, which is where you see whether an alert helps or annoys. I'm noting it as pending, not as an achievement.
- **Ask for clarification.** In another session I wrote “8 top mods” and Claude understood “the 8 projects that survive.” Since then it pays to have it repeat what it understood before building anything (I'm dramatizing, but only a little).

## When it's worth it

A mod is worth it when the rule already exists, you break it often and it doesn't depend on judgment. That's what I say throughout the rest of the guide: what repeats and has clear rules goes in code, not in an instruction that depends on you remembering. If the rule calls for judgment, a mod won't solve it.

The numbers that feed these alerts come from [Measuring spend](medir.html), and the context for why I picked 80 turns is in [Habits](habitos.html). If you want to start, just do the first one.

```text
I want a mod for Claude Code that warns me when a session reaches 150k of context. Use the plugin-authoring skill. Before writing anything, repeat back what you understood. Then propose a list of eight more mods that apply my token-economy rules (meters, alerts, reading guards, closing commands) and let me choose which ones. The guards must fail open: if they break, they let things through and warn. Show me the code before installing it and don't save anything without my approval.
```
