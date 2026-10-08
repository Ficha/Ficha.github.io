---
slug: equipos
nivel: 3
titulo: Claude on several computers
bajada: A PC that acts as a server, the laptop for working and the phone for giving orders.
---

I work on a laptop, I have a desktop PC at home and I live with my phone in my hand. For a while, each one had its own version of my projects, and I was the cable that tied them together (a rather distracted cable). Now I'm building a system so they work as one. It's not finished; I'm telling you what already works.

## The PC as a server

The desktop PC stays on and never suspends. That's where the [scheduled tasks](tareas.html) run, since they need the app open, and that's where the backups are going to live.

## Synced folders

The projects folder syncs between the laptop and the PC with Syncthing, a free program that copies changes from one to the other without going through the cloud. It keeps versions of the files for 30 days and has a list of what doesn't sync (Python environments, temporary files).

So that Claude Code doesn't get confused, both computers use the same user and the projects folder sits at the same path. Claude's memory is tied to that path, so it matches on both machines. Repositories travel with their `.git` folder and GitHub remains the remote, with one rule: don't edit the same repository on both computers at the same time.

## The phone as a remote control

With Remote Control, the Claude session running on the PC can be driven from the phone or any browser. I ask it for something from the street and it does it on the computer at home, with all my files. To connect to the PC from outside I use Tailscale, a private network between my devices.

## Syncing is not a backup

This is the most important part of the card. If I delete a file on the laptop, Syncthing deletes it on the PC; if a file gets corrupted, it gets copied corrupted. Neatly. A real backup follows the 3-2-1 rule: three copies, on two different media, one off-site. Mine is going to be the PC, an external drive and the cloud, with a program that keeps versions and encrypts before uploading. The sensitive stuff (work and personal) goes only to the drive.

And a warning that happened to me: this project's Status said the two computers were one hundred percent in sync. The PC had nothing. I logged it as an error in the [quality log](calidad.html), and the weekly review is going to compare the real state with the written one.

```text
I want my projects to work on [my devices]. Propose a plan in stages: which one acts as the server, how the folders sync (same path and user on all of them, so Claude's memory matches), how I control Claude from my phone and how I build a 3-2-1 backup that doesn't depend on syncing. Nothing automatic deletes files on any device. Mark with “(verify)” anything you're not certain about, like prices or settings menus.
```
