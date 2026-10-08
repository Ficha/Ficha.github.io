---
slug: briefs
nivel: 2
titulo: Distilling what you consult often
bajada: Read a long document once and keep the page that matters.
---

There are documents I consult all the time: my style sheet, a contest's guidelines, a course's rules. If every time I ask Claude to read them in full, I pay for the whole document in every conversation. And again. And again.

The fix is to distill them once into a one-page brief, a `_brief.md` inside the project, and from then on work with that. The original stays saved in case it's needed, but it doesn't get opened.

## What a good brief has

- What I'm going to consult often, not a summary of the document.
- Concrete criteria and short examples: “dates as numbers; centuries in Roman numerals” is more useful than “follow the standard”.
- No narrative. If a section isn't going to be consulted, it doesn't go in.

## The voice manual

The brief I use most is the one for my newsletter. At first it was a voice profile built from a few issues; then I turned it into a manual, with how I open, how I close, which words I use and which I never do, how I build lists and where I put parentheses (everywhere). Now, when I correct a text in my voice, Claude reads the manual instead of rereading five years of issues. My [proofreading](skills.html) skill uses it, along with the style sheet I built at university.

One caution: if you replace one brief with another, update the pointers. For a few days my [general file](contexto-general.html) kept sending it to the old brief.

## Text, not PDF

The same goes for raw material. I turn my scanned university PDFs into text on my computer, with an OCR script, and Claude reads only the `.txt`. A 40-page scanned PDF can cost more than a week of conversations. I'm not exaggerating (well, a little). That step is now part of a [skill](skills.html).

```text
Read [document] just once and distill it into a one-page _brief.md: what I'm going to consult often, with concrete criteria and short examples, no narrative summary. Then find which files or skills mention the original document and propose changing those pointers to the brief. From now on, work with the brief and leave the original alone.
```
