---
slug: accesibilidad
nivel: 3
nuevo: si
titulo: Accessible from the start
bajada: Six rules that now go into every app, and a bug that slipped through anyway.
---

Making a screen accessible afterward is expensive, because you have to undo decisions. Making it accessible beforehand costs almost nothing: all it takes is for Claude to know, from the start, which rules to follow. I've been collecting them app by app, and I confess they're still not in one place (collecting them is on the to-do list, under forty other things).

## The six rules

**Tap targets of 44 pixels.** Everything you press measures at least 44 by 44. It's Apple's guideline, and it came out of [asking for design judgment](criterio-diseno.html) on an app that had 20-pixel buttons.

**Measurable contrast.** The web accessibility guidelines (WCAG) ask for at least 4.5 to 1 between text and background. The muted gray in one of my apps comes out at 5.3, measured. I used to pick it by eye, and by eye it always looks fine to me.

**Motion with permission.** If the operating system of whoever's using the app asks for less animation, the app respects that preference (`prefers-reduced-motion`). The animations switch off and the information stays right there.

**Color is never the only signal.** A status in red also has to say “error,” with text or an icon. Text leads; color and icon go along. Someone who can't tell red from green, or who's looking at the screen with the brightness at minimum, reads it just the same.

**Alerts that don't shout.** When something changes without anyone touching anything, like a “saved” message, it goes in a region with `aria-live="polite"`: the screen reader announces it when it finishes talking, not on top of it.

**No streak pressure.** No streaks (they cause anxiety), and no confetti or sounds by default (they're noise). An app can be pleasant without making you feel you owe it something.

## The bug that slipped through

There was one, and it's in the [quality](calidad.html) log, dated October 9. In my diary app, an automatic reload redrew the screen and took away the field I was typing in. With a profile half edited, what I'd written was lost. It looked like a programming detail and it was exactly the opposite of a friendly app.

The new rule is short: if a field has focus, it doesn't get redrawn. And if it has to be redrawn, focus goes back to where it was.

## How to ask for it

You don't need to know about accessibility to ask for it. Copying the list above into your [general file](contexto-general.html) or the project's is enough, and then asking for the final review to go through it point by point. What Claude can't do is test with a real screen reader; that's still pending for me, and I'm saying so you don't think the list is enough.

```text
Review this app against these accessibility rules: tap targets of at least 44 pixels, muted-text contrast close to 5.3 to 1, respect for prefers-reduced-motion, color never as the only signal, alerts with aria-live polite, focus that isn't lost on redraw, and no streaks or confetti. For each rule tell me whether it's met, with file and line, and what fails. Say what you couldn't verify without a screen reader. Propose the fixes as a diff and don't save anything until I approve it.
```
