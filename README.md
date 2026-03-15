# Tirana Apartment Explorer

Map-first prototype for presenting a builder project in Tirana to apartment buyers.

## What it demonstrates

- recognizable base map, not a raw globe
- surrounding context buildings
- highlighted real parcel/project footprint
- click project to move from overview into a closer 3D presentation angle
- click a floor from the map or side panel
- isolate the selected floor

## Tech choice

This version uses `MapLibre GL JS` instead of Cesium because the goal is a client-facing real estate presentation, not a globe viewer. A map-first camera and extrusion layers make parcel context much easier to understand.

## Run

Serve the folder locally:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Files

- [index.html](/Users/orlando/Desktop/Projects/3dmap/index.html): app shell and MapLibre includes
- [main.js](/Users/orlando/Desktop/Projects/3dmap/main.js): map setup, parcel/building/floor logic, interactions
- [styles.css](/Users/orlando/Desktop/Projects/3dmap/styles.css): client-demo layout and visual styling

## Production next step

Replace the simulated context buildings and project geometry with:

- real parcel geometry from your GIS/CAD data
- real building massing or georeferenced `.glb`
- apartment metadata by floor/unit
