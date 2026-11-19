---
slug: auditar-web
nivel: 6
nuevo: si
titulo: Auditing a website
bajada: Measure before touching, Search Console, the SEO you can't see and a check that runs before publishing.
---

I offered a friend's outlet a review of their site with what I've been learning. The site was well built, and I still found a list. I sorted it into blocks, each with its links and a prompt for them to run with their Claude. This card is that list, without the site.

## 1. Measure before touching

[PageSpeed Insights](https://pagespeed.web.dev/) measures speed, accessibility, best practices and SEO. Run it on mobile, which is how almost everyone reads and the version Google uses to rank results. Write down the four scores with the date. Without that snapshot you won't know whether the changes helped.

One suspicion that's almost always confirmed: fonts. Three Google Fonts families with several weights each are usually the first thing it flags.

## 2. Search Console

[Search Console](https://search.google.com/search-console) tells you what people search for when they reach your site, which pages Google indexed and which it didn't, and why. It's free and it's the most useful thing on this card. Bing has its own and can import it. You do this part yourself: Claude doesn't need to log into your accounts.

## 3. The SEO you can't see

- **Title, description and canonical URL** on every page.
- **Share preview** (`og:*`): a 1200 × 630 image with alt text. If every page uses the same one, they all look identical on WhatsApp.
- **Structured data** (JSON-LD): it tells Google “this is an article, by this author, published on this day”.
- **A `sitemap.xml` with dates**, an RSS feed and an `llms.txt` for AI search engines.

## 4. Make it followable

What mattered most on my friend's site wasn't technical: there was no way to follow them. No newsletter, no RSS, no form. Anyone who read a piece and liked it had no way back.

## The check before publishing

On my site, nothing gets merged without passing a script, `verificar_seo.py`, with zero failures. It checks point 3 on the pages that changed. It uses no AI: every new page goes through the same checks, whether I remember or not. Accessibility (44 px buttons, contrast) is in [Accessible from the start](accesibilidad.html).

```text
Audit the site in this folder. First I'll paste the PageSpeed Insights mobile report: sort the problems by impact and tell me which file each one changes. Then check every page: title, description, canonical, og:* with a 1200×630 image and alt text, twitter:card, JSON-LD, presence in the sitemap with a date, RSS feed and llms.txt. Also check whether there's a way to subscribe. Build a script with no AI that fails if a page is missing anything on that list. Show me the plan before changing anything.
```
