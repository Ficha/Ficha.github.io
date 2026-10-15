---
slug: criterio-diseno
nivel: 3
nuevo: si
titulo: Asking it for design judgment
bajada: A skill that uses Apple's guidelines as the yardstick, and what it found in one of my apps viewed on a phone.
---

Claude designs screens that work on my monitor and fall apart on a phone, and the reason is simple: nobody told it what to measure them against. If you ask it to “improve the design,” it improves whatever occurs to it. If you give it a yardstick, it measures.

## The yardstick

I installed someone else's skill, `apple-design`, only in that project's folder. It brings 123 pages of Apple's Human Interface Guidelines (the rules Apple designs its own screens by) and a rule I like: before giving an opinion, it reads the guideline, and every observation cites the file and the section it comes from. No citation, it's an opinion, and I've got plenty of those (more than enough).

The other rule is about size: in each review it loads between 8 and 12 of those pages, always the ones on accessibility, layout, typography and color, plus the platform's own. It doesn't read the whole manual every time, which is exactly what I ask of everything else in [how the quota gets spent](como-se-gasta.html).

## What it found

I tried it on an app I built for my degree, opened at 375 pixels wide, which is a small phone. This is what came out:

- Nine tabs along the top that didn't fit and spilled off to the sides.
- Tap targets of 34, 36 and even 20 pixels (the links). The guideline asks for 44. I couldn't hit the 20-pixel ones myself, and I'd put them there.
- The cookie banner took up 20% of the screen, always, covering exactly what you needed to read.

We fixed it like this: the tabs moved to a bottom bar, which is where the thumb reaches; everything tappable went up to 44 pixels; the cookie banner got smaller; and on large screens the width got used instead of leaving a narrow column in the middle. What I'd asked for was much vaguer: “review the app, propose a list of changes and show me a prototype.” The only thing I added along the way was “careful, it's not just for phones,” and that's why the desktop version came out ahead too.

## The caveat

We saw all this in a browser with the width squeezed. I didn't test it on a physical phone, and a real phone comes with a thumb, a smudged screen and sun hitting it from the side. Take it as a first pass, not as an approval. [Accessibility](accesibilidad.html) has its own card because the yardstick there is a different one.

## When it helps and when it doesn't

It helps when something already exists and you want a critique with a source. It doesn't help to decide what to build; that comes earlier, in the [interview](entrevista.html). And it doesn't replace a person using the thing. If a friend takes ten seconds to find a button, that fact is worth more than any guideline citation.

```text
Review this app's design the way the apple-design skill would, looking at it at 375 pixels wide. Pick between 8 and 12 files that define the interface and tell me which ones you picked. For each problem, cite the guideline it comes from, the file and the line, and say what you'd change. Order them by how much they get in the user's way. Say what you couldn't verify without a real phone. Propose the changes as a diff and don't save anything until I approve it.
```
