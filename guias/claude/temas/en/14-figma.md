---
slug: figma
nivel: 3
nuevo: si
titulo: Figma with 20 calls
bajada: The free plan gives you twenty calls a month. Mine were gone in a day, and here's what I learned for next time.
---

I connected Figma to Claude to move my site's visual system into a design file and, while I was at it, put together an Instagram carousel. It works. The Starter plan, the free one, allows 20 calls a month, and the ones that read count the same as the ones that write. All of mine were gone in a day, on the carousel.

I didn't see it coming: looking at the file is one call, drawing is another and taking a screenshot to see how it came out is yet another. Twenty calls are few if you spend them on checking and plenty if you spend them on building. (The paid plans give you 200 a day, in case you've got money to burn.)

## What I changed

Three rules, written down in the project folder:

- **Few scripts, big ones.** Instead of one call per button, one call that builds a whole component with its variants. It costs more to think through, but you pay it once.
- **No verification calls.** “Let's see if it came out right” is a wasted call. If the script is well written, it came out right; and if not, you'll see it anyway when you open the file.
- **The screenshot goes inside.** Asking for a screenshot is another call, unless the `screenshot()` function runs inside the same script that draws. That way the preview travels with the work and doesn't cost an extra one.

With those rules, the plan to move the whole visual system came down to three calls and two spare. On paper. I haven't been able to try it yet, because the quota hasn't renewed.

## What was left half done

The visual system didn't make it into that batch and is waiting for the quota to renew. I note it without shame: it's what happens when a resource has a cap and you hadn't looked at it. The same thing happened to me with Claude's quota, which I tell in [the week I ran out of quota](sin-cuota.html).

## An alternative without AI

Before spending calls, ask yourself whether what you need is Figma. For simple pieces, like an image for social media or that same carousel, I ended up building a local editor that runs in the browser and exports PNG. It has no cap and, once written, costs nothing in Claude. Figma stays for what really calls for a shared design file.

It's the same logic as [the habits](habitos.html): what repeats and has rules goes in a script, and AI is kept for what calls for judgment.

```text
We're going to work in Figma with a quota of 20 calls a month. Before using any, put together a numbered plan of how many we'd need, grouping everything you can into big scripts. Don't make calls just to verify. If a screenshot is needed, ask for it inside the same script that draws. Also tell me which pieces could be solved without Figma, with a local editor that exports to PNG. Show me the plan and don't use any call until I approve it.
```
