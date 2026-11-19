---
slug: corregir
nivel: 3
nuevo: si
titulo: Copyediting with a style sheet
bajada: Errors, suggestions and questions, each with its rule, and a list of what I keep getting wrong.
---

I study Publishing, and the Copyediting course left me with something more useful than a grade: a style sheet. It has two layers. The norm (what the Spanish Academy's *Ortografía* and the *Diccionario panhispánico de dudas* say) and house decisions, which are choices between valid options: *voseo*, curly quotes on the web, numerals from 10 up. Breaking the norm is an error; breaking a house decision, an inconsistency.

That sheet is the source of a [skill](skills.html), `corregir-texto`. Claude doesn't correct by taste, it corrects by the sheet. And if it can't cite the rule, it's not an error.

## Three categories, never mixed

- **Error**: it breaks the norm. It gets fixed and the rule is cited.
- **Suggestion**: an optional improvement. Few, only the ones that add something.
- **Question**: something Claude can't settle without me, like a fact, an intention or two valid options used at once.

The difference matters. A correction that mixes all three makes you argue every change, and by the fifth argument you accept everything just to be done.

## Separate passes

Spelling and punctuation first. Then grammar and vocabulary. Finally, the text level: coherence, register, paragraphs. Done together, errors slip through, the same way you miss an accent mark when you're reading for meaning.

## A reviewer to decide

I used to get a long table I never finished reading. Now the skill builds a local page with the text and every change marked: I accept or reject each one with the keyboard and download the final text. Errors come already applied in a copy; suggestions and questions wait for my decision.

## What adds up

Each correction adds its patterns to `errores-frecuentes.md`, with a count. It's the first thing the skill looks for in the next text. What happens to me most: missing italics (224 times) and diacritical accents (178). There's no shame in the list. There are statistics.

Two rules I learned: if Claude wrote the text, its errors don't go on my list, which is for mine. And the skill has test cases, to check it doesn't get worse every time I touch it.

```text
Build a skill to copyedit my texts using the style sheet I'm attaching as its source. It should split each change into error (with the rule cited), suggestion or question, never mixing them, and do separate passes: spelling and punctuation, grammar and vocabulary, and text level. It should keep an errores-frecuentes.md file with the patterns from each correction and how many times they appeared, and read it before starting the next one. Try it on a short text of mine and show me the result before installing it.
```
