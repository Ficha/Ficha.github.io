---
slug: imagenes
nivel: 6
nuevo: si
titulo: Commons images with your own treatment
bajada: Millions of free images, what each license says and a script-made filter so they look like they belong to you.
---

A site without images shares badly: on social media, every link is a gray rectangle with a title. But not all of us have an illustrator, and AI-generated images have their own [signs](signos-ia.html), plus their own debates.

[Wikimedia Commons](https://commons.wikimedia.org/wiki/Special:MediaSearch) has millions of free images. For science it's a gold mine: micrographs, old botanical illustrations, engravings, diagrams, archive photos.

## Licenses, what matters

- **Public domain and CC0**: free, no conditions. Prefer them.
- **CC BY**: use and modify it, with attribution (author, license, link).
- **CC BY-SA**: same, but the modified image has to be released under the same license. Allowed, but you have to say so.
- **NC** (non-commercial): avoid them if the site sells anything or has sponsors.

Commons has a page explaining [how to attribute](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia). A line under the image and a credits page are enough.

## The treatment

A Commons photo pasted as is looks like it came from Wikipedia, because it did. To make them all look like they belong to the same house, run them through the same filter, and make the filter a script: that way image number 40 comes out like the first.

On my site I use black-and-white print halftones, which go with the rest of the design. For another site I'd think of something of its own: a duotone with the two colors of its palette, a soft grain, a fixed crop. The filter is part of the identity, so don't copy mine.

## What the script does

- Applies the treatment and crops to the sizes the site uses, including 1200 × 630 for sharing.
- Exports in light formats (AVIF and WebP) and in three widths, so phones don't download the desktop version.
- Writes title, author, license and link to a data file, which feeds the caption and the credits page.

The alt text isn't written by the script: a person writes it, describing what you see and why it's there.

```text
Write a Python script (with Pillow) that takes an image from Wikimedia Commons and returns: a version with a treatment of my own for my site (propose three, based on my palette, and I'll choose), cropped to 16:9 and to 1200×630; outputs in AVIF and WebP in three widths, plus a JPG for sharing; and a credits line (title, author, license, link) in a data file. Before processing, it should check the license and stop if it's NC. Try it with a public-domain image and show me the result.
```
