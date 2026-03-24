---
name: prox-next-investor-ui
description: Use when working on this PRO X codebase to design or refactor the Next.js investor-facing interface. Apply the project's premium private-capital positioning, keep the concept narrowed to a small curated set of hero opportunities, and preserve a polished desktop-and-mobile map-led experience.
---

# PRO X Next Investor UI

Use this skill when the task touches the visual design, information architecture, or interaction model of the PRO X Next.js app.

## Goals

- Make the experience feel like a private capital platform, not a listing portal.
- Keep the concept focused on a very small curated set of flagship opportunities.
- Let the map remain the visual anchor while the left-side content sells the investment story.
- Prefer premium clarity over feature sprawl.
- Preserve a clean hierarchy in the left rail: brand and controls first, compact opportunity navigation second, main memo surface third.

## Workflow

1. Read `request.md` for the original client brief and tone.
2. Read `lib/projects.js` to understand the curated project deck and how the pitch is framed.
3. Read `app/globals.css` and the relevant component files before changing layout or styling.
4. When updating UI, keep one clear visual direction:
   - dark cinematic backdrop
   - gold / bronze trust signals
   - glassmorphism panels only where they improve hierarchy
   - serif-led headlines and restrained supporting type
   - avoid making every section look like the same card
5. Preserve these high-priority sections unless the task explicitly changes the product story:
   - brand / exclusivity message
   - natural-language investor search
   - curated project selection
   - investment memo detail area
   - map-led market view
   - imported asset vault as a supporting library, not the primary story
6. Test both desktop and narrow widths conceptually before finishing. Avoid designs that depend on hover alone.
7. On desktop, preserve the full-height split layout:
   - left rail scrolls independently
   - right map stays as the visual stage
   - avoid sticky overlays that make sections appear stacked on top of each other

## Guardrails

- Do not turn the experience into a generic dashboard or marketplace grid.
- Do not re-expand the project set without a reason tied to the client pitch.
- Prefer investor language such as `capital`, `diligence`, `access`, `memo`, `yield`, and `partnership` over broker-style listing copy.
- Keep animations subtle and meaningful.
- If adding new UI sections, ensure they support the pitch narrative rather than dilute it.
- Normalize section hierarchy before adding more surfaces. If multiple cards feel visually identical, reduce repetition instead of adding styling noise.

## References

- For the brand and narrative constraints, read `references/product-direction.md`.
