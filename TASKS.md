# Prototype Task List

This file tracks tasks for the 3D map prototype and sales demo.
Scope is speed, clarity, and demo stability (not production hardening).

## Must Do (Demo Critical)

- [ ] Render selected parcel visibly on the map (`project-parcel` fill + outline layer).
- [ ] Prevent GLB model race on fast project switching (latest click wins).
- [ ] Add simple loading/error states for model loads in `#status-text`.
- [ ] Confirm all project cards focus reliably on first click.
- [ ] Smoke-test demo flow on local server before each presentation.

## Should Do (Demo Quality)

- [ ] Reduce unnecessary repaint workload in custom GL layer.
- [ ] Make map camera offsets responsive for smaller screens.
- [ ] Add active/selected accessibility attributes (`aria-pressed` or equivalent).
- [ ] Add one fallback mode when model fails (parcel-only still looks good).
- [ ] Align README feature list with current implementation.

## Nice To Have (If Time Allows)

- [ ] Split `main.js` into small modules (`data`, `ui`, `map`, `glb`).
- [ ] Add quick keyboard controls for focus/reset.
- [ ] Add one additional project with validated footprint and model.
- [ ] Add a "demo reset" button that returns to initial neutral state.
- [ ] Optional: add offline asset strategy for poor network conditions.

## Demo Prep Checklist (Before Showing Client)

- [ ] Run with `python3 -m http.server 8000` (not `file://`).
- [ ] Open app and click each project once.
- [ ] Verify model appears and camera transitions look smooth.
- [ ] Verify reset/overview always returns to expected angle.
- [ ] Keep one fallback narrative ready if model load fails.

## Parking Lot

- [ ] Add tests for selection and camera behavior.
- [ ] Introduce bundler/tooling (`npm`, linting, formatting) if prototype grows.
- [ ] Add telemetry/logging toggle for demo diagnostics.
