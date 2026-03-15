const projectList = document.getElementById("project-list");
const projectCount = document.getElementById("project-count");
const projectDetail = document.getElementById("project-detail");
const emptyState = document.getElementById("empty-state");
const floorList = document.getElementById("floor-list");
const floorCount = document.getElementById("floor-count");
const focusButton = document.getElementById("focus-building");
const isolateButton = document.getElementById("toggle-isolate");
const resetButton = document.getElementById("reset-view");
const statusText = document.getElementById("status-text");
const projectTitle = document.getElementById("project-title");
const projectMeta = document.getElementById("project-meta");
const selectedFloorName = document.getElementById("selected-floor-name");
const selectedFloorMeta = document.getElementById("selected-floor-meta");
const DEBUG = true;

const projects = [
  {
    id: "park-residence",
    name: "Park Residence Tirana",
    district: "Keshilli i Evropes",
    summary: "8 floors, boulevard-facing parcel beside the park spine.",
    center: [19.81874, 41.32788],
    bearing: -24,
    zoomOverview: 16.15,
    zoomFocus: 18.55,
    pitchOverview: 48,
    pitchFocus: 68,
    footprint: [
      [19.81861, 41.32779],
      [19.81888, 41.32779],
      [19.81891, 41.32796],
      [19.81864, 41.32798],
      [19.81861, 41.32779],
    ],
    floorCount: 8,
    floorHeight: 3.35,
    roofHeight: 2.3,
    contextBuildings: [
      buildingFeature("park-ctx-1", polygonFromRect(19.81818, 41.32773, 0.00012, 0.00009), 18),
      buildingFeature("park-ctx-2", polygonFromRect(19.81829, 41.32796, 0.00011, 0.00008), 16),
      buildingFeature("park-ctx-3", polygonFromRect(19.81842, 41.32768, 0.00009, 0.00008), 14),
      buildingFeature("park-ctx-4", polygonFromRect(19.81815, 41.32815, 0.00014, 0.00009), 24),
      buildingFeature("park-ctx-5", polygonFromRect(19.81841, 41.32816, 0.00016, 0.0001), 20),
      buildingFeature("park-ctx-6", polygonFromRect(19.81898, 41.32812, 0.00014, 0.00009), 23),
      buildingFeature("park-ctx-7", polygonFromRect(19.81905, 41.32779, 0.00012, 0.00009), 17),
      buildingFeature("park-ctx-8", polygonFromRect(19.81896, 41.32754, 0.0001, 0.00008), 15),
      buildingFeature("park-ctx-9", polygonFromRect(19.81841, 41.32746, 0.00013, 0.00008), 18),
      buildingFeature("park-ctx-10", polygonFromRect(19.81802, 41.32748, 0.00011, 0.00008), 12),
      buildingFeature("park-ctx-11", polygonFromRect(19.8192, 41.32794, 0.00011, 0.00009), 21),
      buildingFeature("park-ctx-12", polygonFromRect(19.81921, 41.32762, 0.0001, 0.00008), 13),
    ],
  },
  {
    id: "vista-garden",
    name: "Vista Garden Tirana",
    district: "Komuna e Parisit",
    summary: "10 floors with a wider residential podium footprint.",
    center: [19.80592, 41.31887],
    bearing: 12,
    zoomOverview: 15.9,
    zoomFocus: 18.35,
    pitchOverview: 48,
    pitchFocus: 67,
    footprint: [
      [19.80577, 41.31877],
      [19.80609, 41.31877],
      [19.8061, 41.31897],
      [19.8058, 41.31899],
      [19.80577, 41.31877],
    ],
    floorCount: 10,
    floorHeight: 3.25,
    roofHeight: 2.4,
    contextBuildings: [
      buildingFeature("vista-ctx-1", polygonFromRect(19.80543, 41.31872, 0.00014, 0.0001), 18),
      buildingFeature("vista-ctx-2", polygonFromRect(19.80632, 41.31906, 0.00013, 0.0001), 22),
      buildingFeature("vista-ctx-3", polygonFromRect(19.8061, 41.3185, 0.00011, 0.00009), 15),
      buildingFeature("vista-ctx-4", polygonFromRect(19.80557, 41.31909, 0.0001, 0.00008), 14),
      buildingFeature("vista-ctx-5", polygonFromRect(19.80643, 41.31874, 0.0001, 0.00008), 16),
      buildingFeature("vista-ctx-6", polygonFromRect(19.8056, 41.31833, 0.00011, 0.00008), 13),
    ],
  },
  {
    id: "lakeview-point",
    name: "Lakeview Point",
    district: "Artificial Lake Edge",
    summary: "12 floors aimed at premium units with stronger skyline presence.",
    center: [19.82098, 41.31267],
    bearing: -38,
    zoomOverview: 15.75,
    zoomFocus: 18.25,
    pitchOverview: 50,
    pitchFocus: 69,
    footprint: [
      [19.82083, 41.31256],
      [19.82111, 41.31255],
      [19.82114, 41.31278],
      [19.82087, 41.31279],
      [19.82083, 41.31256],
    ],
    floorCount: 12,
    floorHeight: 3.2,
    roofHeight: 2.6,
    contextBuildings: [
      buildingFeature("lake-ctx-1", polygonFromRect(19.82136, 41.31271, 0.00015, 0.0001), 20),
      buildingFeature("lake-ctx-2", polygonFromRect(19.82052, 41.31242, 0.00012, 0.00009), 16),
      buildingFeature("lake-ctx-3", polygonFromRect(19.82124, 41.31302, 0.00011, 0.00008), 13),
      buildingFeature("lake-ctx-4", polygonFromRect(19.82053, 41.31297, 0.0001, 0.00008), 18),
      buildingFeature("lake-ctx-5", polygonFromRect(19.82158, 41.31246, 0.00011, 0.00008), 15),
      buildingFeature("lake-ctx-6", polygonFromRect(19.82091, 41.31317, 0.00012, 0.00008), 12),
    ],
  },
];

let map;
let mapReady = false;
let activeProject = null;
let selectedFloor = null;
let isolated = false;
let projectFocused = false;

bootstrap();

function debugLog(...args) {
  if (DEBUG) {
    console.log("[3dmap]", ...args);
  }
}

function bootstrap() {
  const maplibregl = window.maplibregl;
  if (!maplibregl) {
    statusText.textContent = "MapLibre failed to load.";
    return;
  }

  projectCount.textContent = `${projects.length} projects`;
  buildProjectCards();

  map = new maplibregl.Map({
    container: "map",
    style: {
      version: 8,
      sources: {
        "carto-light": {
          type: "raster",
          tiles: [
            "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
            "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
            "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
            "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          ],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
        },
      },
      layers: [
        {
          id: "carto-light",
          type: "raster",
          source: "carto-light",
        },
      ],
    },
    center: [19.8189, 41.3274],
    zoom: 12.5,
    pitch: 18,
    bearing: 0,
    antialias: true,
  });

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

  map.on("load", () => {
    mapReady = true;
    debugLog("map loaded");
    map.addSource("context-buildings", {
      type: "geojson",
      data: allContextBuildings(),
    });
    debugLog("source added", "context-buildings", allContextBuildings().features.length);
    map.addSource("selected-context-buildings", {
      type: "geojson",
      data: emptyFeatureCollection(),
    });
    debugLog("source added", "selected-context-buildings", 0);
    map.addSource("project-shell", {
      type: "geojson",
      data: emptyFeatureCollection(),
    });
    map.addSource("project-floors", {
      type: "geojson",
      data: emptyFeatureCollection(),
    });
    map.addSource("project-parcel", {
      type: "geojson",
      data: emptyFeatureCollection(),
    });
    debugLog("project sources added");

    map.addLayer({
      id: "context-buildings",
      type: "fill-extrusion",
      source: "context-buildings",
      paint: {
        "fill-extrusion-color": "#b7bbb7",
        "fill-extrusion-opacity": 0.72,
        "fill-extrusion-base": ["get", "base_height"],
        "fill-extrusion-height": ["get", "height"],
      },
    });
    debugLog("layer added", "context-buildings");

    map.addLayer({
      id: "selected-context-buildings",
      type: "fill-extrusion",
      source: "selected-context-buildings",
      paint: {
        "fill-extrusion-color": "#8f9690",
        "fill-extrusion-opacity": 0.96,
        "fill-extrusion-base": ["get", "base_height"],
        "fill-extrusion-height": ["get", "height"],
      },
    });
    debugLog("layer added", "selected-context-buildings");

    map.addLayer({
      id: "project-shell",
      type: "fill-extrusion",
      source: "project-shell",
      paint: {
        "fill-extrusion-color": "#da8f2f",
        "fill-extrusion-opacity": 0.82,
        "fill-extrusion-base": ["get", "base_height"],
        "fill-extrusion-height": ["get", "height"],
      },
    });
    debugLog("layer added", "project-shell");

    map.addLayer({
      id: "project-floors-base",
      type: "fill-extrusion",
      source: "project-floors",
      layout: { visibility: "none" },
      paint: {
        "fill-extrusion-color": "#f0d7b2",
        "fill-extrusion-opacity": 0,
        "fill-extrusion-base": ["get", "base_height"],
        "fill-extrusion-height": ["get", "height"],
      },
    });
    debugLog("layer added", "project-floors-base");

    map.addLayer({
      id: "project-floors-selected",
      type: "fill-extrusion",
      source: "project-floors",
      layout: { visibility: "none" },
      filter: ["==", ["get", "level"], -1],
      paint: {
        "fill-extrusion-color": "#ffb22c",
        "fill-extrusion-opacity": 0.92,
        "fill-extrusion-base": ["get", "base_height"],
        "fill-extrusion-height": ["get", "height"],
      },
    });
    debugLog("layer added", "project-floors-selected");

    map.addLayer({
      id: "project-parcel-fill",
      type: "fill",
      source: "project-parcel",
      paint: {
        "fill-color": "#ffefcc",
        "fill-opacity": 0.08,
      },
    });

    map.addLayer({
      id: "project-parcel-outline",
      type: "line",
      source: "project-parcel",
      paint: {
        "line-color": "#a45c00",
        "line-width": 3,
      },
    });
    debugLog("parcel layers added");

    debugLog("initial layer presence", {
      context: !!map.getLayer("context-buildings"),
      selectedContext: !!map.getLayer("selected-context-buildings"),
      shell: !!map.getLayer("project-shell"),
      floorsBase: !!map.getLayer("project-floors-base"),
      floorsSelected: !!map.getLayer("project-floors-selected"),
    });

    bindMapInteractions();
    statusText.textContent = "Choose a project card to load its parcel and 3D massing.";
  });

  focusButton.addEventListener("click", () => focusProject(true));
  resetButton.addEventListener("click", resetProjectView);
  isolateButton.addEventListener("click", toggleIsolation);
}

function buildProjectCards() {
  projectList.innerHTML = "";

  projects.forEach((project) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "project-card";
    card.dataset.projectId = project.id;
    card.innerHTML = `
      <span class="project-card-top">
        <span class="project-card-title">${project.name}</span>
        <span class="project-card-badge">${project.floorCount}F</span>
      </span>
      <span class="project-card-meta">${project.district}</span>
      <span class="project-card-copy">${project.summary}</span>
    `;
    card.addEventListener("click", () => selectProject(project.id));
    projectList.appendChild(card);
  });
}

function bindMapInteractions() {
  ["project-shell", "project-floors-base", "project-floors-selected"].forEach((layerId) => {
    map.on("mouseenter", layerId, () => {
      if (activeProject) {
        map.getCanvas().style.cursor = "pointer";
      }
    });
    map.on("mouseleave", layerId, () => {
      map.getCanvas().style.cursor = "";
    });
  });

  map.on("click", "project-shell", () => {
    if (activeProject) {
      focusProject(true);
    }
  });

  ["project-floors-base", "project-floors-selected"].forEach((layerId) => {
    map.on("click", layerId, (event) => {
      if (!activeProject) {
        return;
      }
      const feature = event.features && event.features[0];
      if (!feature) {
        return;
      }

      const level = Number(feature.properties.level);
      if (!projectFocused) {
        focusProject(false);
      }
      if (selectedFloor !== level) {
        isolated = false;
      }
      selectFloor(level);
    });
  });
}

function selectProject(projectId) {
  const project = projects.find((item) => item.id === projectId);
  if (!project || !mapReady) {
    debugLog("selectProject blocked", { projectId, mapReady, found: !!project });
    return;
  }

  debugLog("selectProject", {
    projectId,
    name: project.name,
    contextCount: project.contextBuildings.length,
    floorCount: project.floorCount,
  });

  activeProject = project;
  selectedFloor = null;
  isolated = false;
  projectFocused = false;

  updateProjectCards();
  hydrateProjectData(project);
  renderProjectDetails(project);
  setOverviewState(false);
  applyFloorState();

  emptyState.hidden = true;
  projectDetail.hidden = false;

  map.fitBounds(projectBounds(project), {
    padding: { top: 80, right: 80, bottom: 80, left: 420 },
    duration: 1500,
    pitch: project.pitchOverview,
    bearing: project.bearing,
    essential: true,
    maxZoom: project.zoomOverview,
  });
  debugLog("fitBounds applied", projectBounds(project));

  statusText.textContent = `Viewing ${project.name}. Use Focus Project to move into the building presentation view.`;
}

function hydrateProjectData(project) {
  const selectedContext = {
    type: "FeatureCollection",
    features: project.contextBuildings,
  };
  const shell = createProjectShell(project);
  const parcel = createProjectParcel(project);
  const floors = createFloorCollection(project);

  debugLog("hydrateProjectData", {
    project: project.id,
    selectedContext: selectedContext.features.length,
    shell: shell.features.length,
    parcel: parcel.features.length,
    floors: floors.features.length,
  });

  setGeoJsonSource("selected-context-buildings", selectedContext);
  setGeoJsonSource("project-shell", shell);
  setGeoJsonSource("project-parcel", parcel);
  setGeoJsonSource("project-floors", floors);
}

function renderProjectDetails(project) {
  projectTitle.textContent = project.name;
  projectMeta.textContent = `${project.floorCount} floors on ${project.district}`;
  floorCount.textContent = `${project.floorCount} floors`;
  selectedFloorName.textContent = "None";
  selectedFloorMeta.textContent = "Focus the project, then choose a floor.";
  buildFloorButtons(project);
}

function buildFloorButtons(project) {
  floorList.innerHTML = "";

  for (let level = 1; level <= project.floorCount; level += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "floor-button";
    button.innerHTML = `
      <span>
        <strong>Floor ${level}</strong>
        <small>${Math.round(level * project.floorHeight)}m elevation</small>
      </span>
      <span class="floor-pill">${level}</span>
    `;
    button.addEventListener("click", () => {
      if (!projectFocused) {
        focusProject(false);
      }
      if (selectedFloor !== level) {
        isolated = false;
      }
      selectFloor(level);
    });
    floorList.appendChild(button);
  }
}

function focusProject(withAnimation) {
  if (!mapReady || !activeProject) {
    return;
  }

  projectFocused = true;
  setOverviewState(true);
  applyContextEmphasis(true);

  map.easeTo({
    center: activeProject.center,
    zoom: activeProject.zoomFocus,
    pitch: Math.min(activeProject.pitchFocus, 60),
    bearing: activeProject.bearing,
    offset: [220, 40],
    duration: withAnimation ? 1600 : 0,
    essential: true,
  });

  statusText.textContent =
    "Project focused. Select a floor from the building or the list on the left.";
}

function resetProjectView() {
  if (!mapReady || !activeProject) {
    return;
  }

  projectFocused = false;
  selectedFloor = null;
  isolated = false;
  setOverviewState(false);
  applyContextEmphasis(false);
  applyFloorState();
  map.easeTo({
    center: activeProject.center,
    zoom: activeProject.zoomOverview,
    pitch: activeProject.pitchOverview,
    bearing: activeProject.bearing,
    offset: [99, 0],
    duration: 1200,
    essential: true,
  });
  statusText.textContent =
    "Overview restored. The parcel remains visible in context around the selected project.";
}

function selectFloor(level) {
  if (!mapReady || !activeProject) {
    return;
  }

  selectedFloor = level;
  applyFloorState();
  updateFloorButtons();
  map.easeTo({
    center: activeProject.center,
    zoom: activeProject.zoomFocus + 0.08,
    pitch: 58,
    bearing: activeProject.bearing,
    offset: [220, 40],
    duration: 700,
    essential: true,
  });
  statusText.textContent = `Floor ${level} selected. ${
    isolated ? "Only that level is emphasized." : "The rest of the building remains visible."
  }`;
}

function toggleIsolation() {
  if (!mapReady || !activeProject || !selectedFloor) {
    return;
  }

  isolated = !isolated;
  applyFloorState();
  statusText.textContent = isolated
    ? `Floor ${selectedFloor} isolated.`
    : `Floor ${selectedFloor} highlighted within the full building.`;
}

function setOverviewState(showFloors) {
  if (!mapReady) {
    debugLog("setOverviewState skipped", { mapReady, showFloors });
    return;
  }

  debugLog("setOverviewState", {
    showFloors,
    hasBase: !!map.getLayer("project-floors-base"),
    hasSelected: !!map.getLayer("project-floors-selected"),
    hasShell: !!map.getLayer("project-shell"),
  });

  if (map.getLayer("project-floors-base")) {
    map.setLayoutProperty("project-floors-base", "visibility", showFloors ? "visible" : "none");
  }
  if (map.getLayer("project-floors-selected")) {
    map.setLayoutProperty(
      "project-floors-selected",
      "visibility",
      showFloors ? "visible" : "none"
    );
  }
  if (map.getLayer("project-shell")) {
    map.setPaintProperty("project-shell", "fill-extrusion-opacity", showFloors ? 0.72 : 0.82);
    map.setPaintProperty("project-shell", "fill-extrusion-color", showFloors ? "#f0d7b2" : "#da8f2f");
  }

  updateFloorButtons();
  isolateButton.disabled = !showFloors || selectedFloor === null;
  if (!showFloors) {
    selectedFloorName.textContent = "None";
    selectedFloorMeta.textContent = "Focus the project, then choose a floor.";
  }
}

function applyFloorState() {
  const selectedLevel = selectedFloor ?? -1;
  debugLog("applyFloorState", {
    selectedFloor,
    isolated,
    selectedLevel,
  });

  if (map.getLayer("project-floors-selected")) {
    map.setFilter("project-floors-selected", ["==", ["get", "level"], selectedLevel]);
    map.setPaintProperty(
      "project-floors-selected",
      "fill-extrusion-opacity",
      selectedFloor !== null ? (isolated ? 1 : 0.92) : 0
    );
  }

  if (map.getLayer("project-floors-base")) {
    if (isolated && selectedFloor !== null) {
      map.setFilter("project-floors-base", ["!=", ["get", "level"], selectedLevel]);
      map.setPaintProperty("project-floors-base", "fill-extrusion-opacity", 0);
      if (map.getLayer("project-shell")) {
        map.setPaintProperty("project-shell", "fill-extrusion-opacity", 0.14);
      }
    } else {
      map.setFilter("project-floors-base", [">=", ["get", "level"], 1]);
      map.setPaintProperty("project-floors-base", "fill-extrusion-opacity", 0);
      if (map.getLayer("project-shell")) {
        map.setPaintProperty("project-shell", "fill-extrusion-opacity", 0.72);
      }
    }
  }

  isolateButton.disabled = selectedFloor === null;
  isolateButton.textContent = isolated ? "Show All Floors" : "Isolate Floor";
  selectedFloorName.textContent = selectedFloor ? `Floor ${selectedFloor}` : "None";
  selectedFloorMeta.textContent = selectedFloor
    ? isolated
      ? "Only the selected floor remains emphasized in the building stack."
      : "Selected floor is highlighted while neighboring floors stay faint."
    : "Focus the project, then choose a floor.";
}

function updateProjectCards() {
  Array.from(projectList.children).forEach((card) => {
    card.classList.toggle("active", card.dataset.projectId === activeProject?.id);
  });
}

function updateFloorButtons() {
  Array.from(floorList.children).forEach((button, index) => {
    const level = index + 1;
    button.classList.toggle("active", selectedFloor === level);
    button.disabled = !projectFocused;
  });
}

function setGeoJsonSource(sourceId, data) {
  const source = map.getSource(sourceId);
  if (source) {
    source.setData(data);
    debugLog("source updated", sourceId, data.features.length);
  } else {
    debugLog("source missing", sourceId);
  }
}

function createProjectShell(project) {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          id: `${project.id}-shell`,
          name: project.name,
          height: project.floorCount * project.floorHeight + project.roofHeight,
          base_height: 0,
        },
        geometry: {
          type: "Polygon",
          coordinates: [project.footprint],
        },
      },
    ],
  };
}

function createProjectParcel(project) {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { id: `${project.id}-parcel` },
        geometry: {
          type: "Polygon",
          coordinates: [project.footprint],
        },
      },
    ],
  };
}

function createFloorCollection(project) {
  return {
    type: "FeatureCollection",
    features: Array.from({ length: project.floorCount }, (_, index) => ({
      type: "Feature",
      properties: {
        id: `${project.id}-floor-${index + 1}`,
        level: index + 1,
        base_height: index * project.floorHeight + project.floorHeight * 0.44,
        height: index * project.floorHeight + project.floorHeight * 0.56,
      },
      geometry: {
        type: "Polygon",
        coordinates: [insetPolygon(project.footprint, 0.985)],
      },
    })),
  };
}

function emptyFeatureCollection() {
  return { type: "FeatureCollection", features: [] };
}

function allContextBuildings() {
  return {
    type: "FeatureCollection",
    features: projects.flatMap((project) => project.contextBuildings),
  };
}

function applyContextEmphasis(focused) {
  if (!mapReady) {
    return;
  }

  if (map.getLayer("context-buildings")) {
    map.setPaintProperty(
      "context-buildings",
      "fill-extrusion-opacity",
      focused ? 0.38 : 0.72
    );
  }

  if (map.getLayer("selected-context-buildings")) {
    map.setPaintProperty(
      "selected-context-buildings",
      "fill-extrusion-opacity",
      focused ? 0.52 : 0.96
    );
  }
}

function projectBounds(project) {
  const coordinates = [
    ...project.footprint,
    ...project.contextBuildings.flatMap((feature) => feature.geometry.coordinates[0]),
  ];

  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;

  coordinates.forEach(([lon, lat]) => {
    minLon = Math.min(minLon, lon);
    minLat = Math.min(minLat, lat);
    maxLon = Math.max(maxLon, lon);
    maxLat = Math.max(maxLat, lat);
  });

  return [
    [minLon, minLat],
    [maxLon, maxLat],
  ];
}

function polygonFromRect(centerLon, centerLat, lonOffset, latOffset) {
  return [
    [centerLon - lonOffset, centerLat - latOffset],
    [centerLon + lonOffset, centerLat - latOffset],
    [centerLon + lonOffset, centerLat + latOffset],
    [centerLon - lonOffset, centerLat + latOffset],
    [centerLon - lonOffset, centerLat - latOffset],
  ];
}

function insetPolygon(ring, scale) {
  const uniquePoints = ring.slice(0, -1);
  const center = uniquePoints.reduce(
    (accumulator, [lon, lat]) => {
      return [accumulator[0] + lon / uniquePoints.length, accumulator[1] + lat / uniquePoints.length];
    },
    [0, 0]
  );

  const inset = uniquePoints.map(([lon, lat]) => {
    return [
      center[0] + (lon - center[0]) * scale,
      center[1] + (lat - center[1]) * scale,
    ];
  });

  inset.push(inset[0]);
  return inset;
}

function buildingFeature(id, polygon, height) {
  return {
    type: "Feature",
    properties: {
      id,
      height,
      base_height: 0,
    },
    geometry: {
      type: "Polygon",
      coordinates: [polygon],
    },
  };
}
