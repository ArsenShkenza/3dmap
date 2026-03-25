# PRO X Next.js Prototype

Premium investor-facing map experience for showcasing three flagship real estate opportunities across Albania and Kosovo.

## What changed

- migrated the static prototype into a `Next.js` App Router project
- narrowed the concept pitch to 3 hero opportunities from the client brief
- upgraded the UI toward a more exclusive private-capital feel
- preserved the interactive map as the centerpiece of the experience
- added in-repo skill files for future UI and map-story work

## Run

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Structure

- `app/`: Next.js entrypoints and global styling
- `components/`: interactive UI and map experience
- `lib/projects.js`: curated investment data for the concept pitch
- `public/assets/`: the single source of truth for models and other static media
- `.codex/skills/`: project-specific skills for future iteration

## Project skills

- `.codex/skills/prox-next-investor-ui`: guardrails for premium investor-facing UI work in this codebase
- `.codex/skills/prox-map-storytelling`: guidance for keeping the map interaction focused on pitch-driven storytelling

## Notes

- The current map uses open raster tiles, glow-dot selection, and conceptual 3D massing for the concept deck.
- Add new GLBs and other static media directly to `public/assets/`.
- Authentication, a true data room, and AI-backed search are still concept-stage items.
