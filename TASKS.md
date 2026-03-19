# PRO X Task List

This file tracks the concept-pitch prototype for the client brief in `request.md`.
Goal: sell the vision fast with a premium experience, not build production scope.

## Phase 1 Concept Pitch

- [x] Show all projects as lightweight map markers on first load.
- [x] Load heavy GLB models only when a project is selected or surfaced by close zoom.
- [ ] Add visible parcel highlight for the selected project.
- [x] Rebrand the experience from a simple project list into `PRO X`.
- [x] Move the visual direction to dark, premium, cinematic, and glassmorphism-led.
- [x] Add an `AI Omni-Search` hero interaction with sample investor prompts.
- [x] Reframe project detail into a mini pitch deck, not plain metadata.

## Content Alignment With Client Brief

- [ ] Narrow the concept to 3 hero projects for the pitch.
- [x] Represent the real categories from the brief:
- [x] `Land & Development`
- [x] `Seeking Partners / Co-Investment`
- [x] `Turn-key / Built`
- [x] `Under Construction / Off-Plan`
- [x] Add investment-facing metadata per project:
- [x] stage
- [x] ROI / expected yield
- [x] ticket size / funding ask
- [x] access tier (`Open`, `VIP`, `Invite Only`)
- [x] one-line investment thesis

## Demo Experience

- [x] Add cinematic fly-to behavior tied to search intent and project selection.
- [x] Add curated category browsing (`Explore`) rather than only a flat list.
- [x] Add status copy that sounds investor-facing, not developer-facing.
- [x] Add one polished empty/default state that explains the concept immediately.
- [x] Add a stronger hero message and tagline from the brief.

## Premium Project Detail

- [x] Add a visual timeline for project phase.
- [x] Add placeholders for `Data Room`, `AR Ready`, and `360 Walkthrough`.
- [x] Show why the opportunity matters, not only what the building is.
- [x] Add one "investment memo" style summary per project.

## Technical Reliability For Demo

- [x] Prevent GLB race condition on fast switching.
- [x] Add explicit loading / error / fallback states for model loads.
- [x] Reduce unnecessary repaint work in the custom GL layer.
- [x] Make camera offsets responsive on smaller screens.
- [x] Ensure first click always produces visible feedback.

## Before Client Demo

- [ ] Run with `python3 -m http.server 8000` and hard refresh.
- [ ] Test every project card and search prompt once.
- [ ] Confirm first paint is fast and map feels alive before any click.
- [ ] Confirm fallback still looks convincing if a GLB fails.
- [ ] Prepare a 30-second narrative for the 3 hero projects.

## Later / Parking Lot

- [ ] Add authentication and VIP-gated sections.
- [ ] Replace placeholder data with real GIS, permit, and ROI documents.
- [ ] Add true AI search backed by project metadata and embeddings.
- [ ] Split `main.js` into focused modules if prototype grows further.
- [ ] Add test coverage once the concept direction stabilizes.
