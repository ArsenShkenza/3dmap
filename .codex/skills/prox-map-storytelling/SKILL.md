---
name: prox-map-storytelling
description: Use when changing the map behavior, project geography, or map-related storytelling in this PRO X codebase. Keep the map cinematic, selective, and useful for investor conversations rather than broad GIS exploration.
---

# PRO X Map Storytelling

Use this skill for map interactions, parcel rendering, camera behavior, and anything that changes how location supports the investment story.

## Workflow

1. Read `request.md` for the brief.
2. Read `lib/projects.js` for the current hero projects and their geographic metadata.
3. Read `components/MapExperience.js` before changing layers, source data, or camera behavior.
4. Keep the map optimized for pitch conversations:
   - highlight only a few hero opportunities
   - make selection immediately obvious
   - use camera motion to reinforce narrative shifts
   - favor clean parcel and marker readability over layer density
   - remember that imported GLB assets may exist beyond the mapped hero opportunities; the map stays selective even when the asset vault is broader

## Guardrails

- The map is not a full GIS workstation.
- Avoid cluttered legends, noisy controls, or too many simultaneous overlays.
- Every visible map layer should support one of these jobs:
  - orient the user
  - show where the opportunity is
  - signal relative exclusivity or stage
  - create premium atmosphere
- Preserve graceful fallbacks if a heavier 3D layer is reintroduced later.
- Protect the desktop split-screen composition. The map should feel like the primary stage on the right, not a secondary panel.

## References

- For the current map narrative patterns, read `references/map-principles.md`.
