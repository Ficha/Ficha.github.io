---
name: weekly-newsletter
description: Builds my weekly newsletter: status of my projects, proposals to improve my setup, AI news and Claude tips.
---

Build my personal weekly newsletter. Write in [language], with a close, concrete tone. Save tokens: read indexes and "Status" sections, not heavy files (PDF, .docx). It reads in 5 minutes: no filler.

## 0. Context
- Read my general `CLAUDE.md` (who I am and the project map).
- Read the last 4 issues in `[folder]/issues/` (if any) so you don't repeat tips or news.
- Today is the system date. The issue covers the last 7 days.

## 1. News and tips (web)
- **News** (5 max): Anthropic and Claude updates, and the most important things in AI in general. Prefer primary sources (anthropic.com/news, official docs, changelogs, official blogs) and serious outlets. Each item: title, 2 lines on why it matters to me and the link. If you can't verify something, leave it out.
- **3 Claude tips** I can apply right away (skills, scheduled tasks, connectors, prompts, token saving), tied to my projects when possible.
- **2 general AI tips** useful for [my work].

## 2. For you
For each project in the map, read ONLY the "Status" section of its `CLAUDE.md` and check it against something real (change history, file dates, calendar, [other sources]). If Status says "pending" but it's already done, say so.
- Per project: one status line and **one** concrete action for this week.
- Dates in the next 14 days: [deliveries, deadlines, open calls].
- Close with "Most important this week" (1 or 2 things).

## 3. Building infrastructure
Goal: every week costs fewer tokens and comes out better than the last. Read `token-economy.md`, the "Token economy" section of the general `CLAUDE.md` and the existing skills (header only).
- **Lessons of the week** (3 max): what worked, what got stuck or repeated, what agent mistake showed up.
- **Proposals** (3 max, ranked by payoff): new skills or improvements to existing ones; `_brief.md` briefs for long documents consulted often; trims to context files that grew (over ~3 KB or stale Status sections); scheduled tasks or model changes. Each proposal: what, why it saves or improves, an estimated weight (light, medium or heavy), the suggested model and **the request ready to paste**.
- **Quota plan**: the limit resets on [day] at [time]. Order the proposals so they fit in the quota left before the reset.
Don't implement anything: only propose.

## 4. Assembly and delivery
- Save the issue in `[folder]/issues/YYYY-MM-DD.md`. Subject: "Your week with AI · <date> · <top headline>".
- Sections: 1) For you, 2) Building infrastructure, 3) News, 4) Claude tips, 5) General AI, 6) Try this week.
- [Optional: leave it as a draft in my email with the Gmail connector, addressed only to me].

## Limits
Only read, build and save (or leave the draft). Don't modify project files, don't send anything to anyone else, don't publish or implement the proposals.
