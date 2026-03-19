const projectList = document.getElementById("project-list");
const projectCount = document.getElementById("project-count");
const projectDetail = document.getElementById("project-detail");
const emptyState = document.getElementById("empty-state");
const focusButton = document.getElementById("focus-building");
const resetButton = document.getElementById("reset-view");
const statusText = document.getElementById("status-text");
const projectTitle = document.getElementById("project-title");
const projectMeta = document.getElementById("project-meta");
const projectThesis = document.getElementById("project-thesis");
const projectCategory = document.getElementById("project-category");
const projectRoi = document.getElementById("project-roi");
const projectTicket = document.getElementById("project-ticket");
const projectStage = document.getElementById("project-stage");
const projectAccess = document.getElementById("project-access");
const projectTimeline = document.getElementById("project-timeline");
const projectMemo = document.getElementById("project-memo");
const categoryList = document.getElementById("category-list");
const promptList = document.getElementById("prompt-list");
const searchForm = document.getElementById("search-form");
const omniSearch = document.getElementById("omni-search");

const DEBUG = false;
const CAN_FETCH_LOCAL_ASSET = window.location.protocol !== "file:";

const exploreCategories = [
  { id: "all", label: "All Opportunities" },
  { id: "land", label: "Land & Development" },
  { id: "partners", label: "Seeking Partners" },
  { id: "turnkey", label: "Turn-key / Built" },
  { id: "offplan", label: "Off-Plan Vision" },
];

const promptExamples = [
  "Projects in Durres with waterfront positioning",
  "Projects in Tirana seeking co-investors above 8% ROI",
  "Stabilized commercial asset in Prishtina",
];

const projects = [
  {
    id: "palase-horizon",
    name: "Tirana Skyline Residences",
    city: "Tirana",
    district: "Liqeni i Thate",
    categoryId: "land",
    categoryLabel: "Land & Development",
    access: "VIP",
    roi: "12.4%",
    ticket: "EUR 10.8M equity",
    stage: "Approved Permit",
    timeline: ["Land Control", "Approved Permit", "Capital Raise", "Construction"],
    summary: "A permit-ready premium residential site in Tirana positioned for a high-visibility, high-margin launch.",
    thesis:
      "Planning clarity, premium neighborhood positioning, and strong end-market depth make this a cleaner development story than a resort concept.",
    center: [19.8208, 41.3099],
    bearing: -20,
    zoomOverview: 15.2,
    zoomFocus: 17.9,
    pitchOverview: 54,
    pitchFocus: 64,
    footprint: [
      [19.82052, 41.30973],
      [19.82103, 41.30969],
      [19.82116, 41.31007],
      [19.82063, 41.31011],
      [19.82052, 41.30973],
    ],
    floorCount: 11,
    floorHeight: 3.55,
    roofHeight: 3.1,
    modelSrc: "./assets/louisiana_state_house.glb",
    searchTerms: ["tirana", "permit", "residences", "land", "development", "premium"],
  },
  {
    id: "boulevard-crown",
    name: "Boulevard Crown Tower",
    city: "Tirana",
    district: "Bulevardi i Ri",
    categoryId: "partners",
    categoryLabel: "Seeking Partners",
    access: "Invite Only",
    roi: "9.2%",
    ticket: "EUR 8.5M for 30%",
    stage: "Capital Raise",
    timeline: ["Concept Ready", "Business Plan", "Capital Raise", "Permit Delivery"],
    summary: "Urban tower concept seeking a strategic co-investor with plan, visibility, and central-city momentum.",
    thesis:
      "Institutional-style entry into a flagship Tirana position with capital leverage and a ready-made story for partnership discussions.",
    center: [19.8317, 41.3406],
    bearing: -12,
    zoomOverview: 15.4,
    zoomFocus: 18.15,
    pitchOverview: 56,
    pitchFocus: 66,
    footprint: [
      [19.83145, 41.34042],
      [19.83192, 41.3404],
      [19.83203, 41.34075],
      [19.83157, 41.34079],
      [19.83145, 41.34042],
    ],
    floorCount: 18,
    floorHeight: 3.35,
    roofHeight: 3.3,
    modelSrc: "./assets/le_millefiori.glb",
    searchTerms: ["tirana", "partner", "co-investor", "roi", "tower", "boulevard", "bulevardi"],
  },
  {
    id: "prishtina-prime",
    name: "Prishtina Prime Offices",
    city: "Prishtina",
    district: "Central Business District",
    categoryId: "turnkey",
    categoryLabel: "Turn-key / Built",
    access: "Open",
    roi: "8.1%",
    ticket: "EUR 6.2M acquisition",
    stage: "Stabilized Asset",
    timeline: ["Completed", "Leased", "Cash Flow", "Refinance / Exit"],
    summary: "Finished commercial floorplate with tenant narrative and clean yield messaging for conservative capital.",
    thesis:
      "A lower-volatility income play suited for investors prioritizing occupancy strength, lease certainty, and immediate cash flow.",
    center: [21.1618, 42.6627],
    bearing: 18,
    zoomOverview: 15.25,
    zoomFocus: 17.75,
    pitchOverview: 52,
    pitchFocus: 63,
    footprint: [
      [21.16153, 42.6625],
      [21.16201, 42.66246],
      [21.16212, 42.66282],
      [21.16166, 42.66287],
      [21.16153, 42.6625],
    ],
    floorCount: 14,
    floorHeight: 3.2,
    roofHeight: 2.8,
    modelSrc: "./assets/singer_building.glb",
    searchTerms: ["prishtina", "office", "commercial", "yield", "built", "turnkey", "leased"],
  },
  {
    id: "lalzi-villas",
    name: "Durres Marina Residences",
    city: "Durres",
    district: "Seafront Growth Corridor",
    categoryId: "offplan",
    categoryLabel: "Off-Plan Vision",
    access: "VIP",
    roi: "10.9%",
    ticket: "EUR 6.1M block buy",
    stage: "Construction Start",
    timeline: ["Concept Ready", "Sales Launch", "Construction Start", "Delivery"],
    summary: "A seafront residential concept framed for early-entry buyers seeking Durres waterfront upside before full area repricing.",
    thesis:
      "Durres tourism momentum and cleaner urban positioning make this a stronger waterfront story than the previous out-of-market villa placeholder.",
    center: [19.4381, 41.3138],
    bearing: -22,
    zoomOverview: 14.8,
    zoomFocus: 17.45,
    pitchOverview: 53,
    pitchFocus: 64,
    footprint: [
      [19.43778, 41.31357],
      [19.43832, 41.31355],
      [19.43847, 41.31398],
      [19.43791, 41.31402],
      [19.43778, 41.31357],
    ],
    floorCount: 9,
    floorHeight: 3.15,
    roofHeight: 2.7,
    modelSrc: "./assets/skyscraper.glb",
    searchTerms: ["durres", "marina", "residences", "off-plan", "construction", "waterfront"],
  },
];

let map;
let mapReady = false;
let activeProject = null;
let glbState = null;
let glbInitPromise = null;
let activeCategory = "all";
let visibleProjects = [...projects];
let projectLoadToken = 0;
let activeProjectAuto = false;
let pulseFrame = 0;
let pulseAnimationId = 0;

const MODEL_REVEAL_ZOOM_BUFFER = 0.6;
const AUTO_SELECT_ZOOM = 15.5;
const AUTO_SELECT_DISTANCE_METERS = 700;

bootstrap();

function debugLog(...args) {
  if (DEBUG) {
    console.log("[pro-x]", ...args);
  }
}

function bootstrap() {
  const maplibregl = window.maplibregl;
  if (!maplibregl) {
    statusText.textContent = "Map engine failed to load.";
    return;
  }

  buildCategoryChips();
  buildPromptChips();
  renderProjectList();

  map = new maplibregl.Map({
    container: "map",
    style: {
      version: 8,
      sources: {
        "carto-dark": {
          type: "raster",
          tiles: [
            "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
          ],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
        },
      },
      layers: [{ id: "carto-dark", type: "raster", source: "carto-dark" }],
    },
    center: [20.45, 41.25],
    zoom: 7.15,
    pitch: 34,
    bearing: -8,
    antialias: true,
  });

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

  map.on("load", () => {
    mapReady = true;
    debugLog("map loaded");

    map.addSource("projects-overview-points", {
      type: "geojson",
      data: createProjectsOverviewPoints(getOverviewPointProjects()),
    });
    map.addLayer({
      id: "projects-glow-outer",
      type: "circle",
      source: "projects-overview-points",
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 10, 10, 18, 14, 28, 16.2, 0],
        "circle-color": "#d6a86a",
        "circle-opacity": ["interpolate", ["linear"], ["zoom"], 6, 0.16, 10, 0.12, 14, 0.08, 16.2, 0],
        "circle-blur": 0.5,
      },
    });
    map.addLayer({
      id: "projects-glow-inner",
      type: "circle",
      source: "projects-overview-points",
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 3.6, 10, 6.5, 14, 8, 16.2, 0],
        "circle-color": "#f0c884",
        "circle-opacity": ["interpolate", ["linear"], ["zoom"], 6, 0.92, 10, 0.84, 14, 0.72, 16.2, 0],
        "circle-stroke-width": 0.8,
        "circle-stroke-color": "rgba(255,255,255,0.36)",
      },
    });

    map.addSource("active-project-point", {
      type: "geojson",
      data: emptyFeatureCollection(),
    });
    map.addLayer({
      id: "active-project-pulse",
      type: "circle",
      source: "active-project-point",
      paint: {
        "circle-radius": 18,
        "circle-color": "#f0c884",
        "circle-opacity": 0,
        "circle-blur": 0.55,
      },
    });
    map.addLayer({
      id: "active-project-core",
      type: "circle",
      source: "active-project-point",
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 4.5, 10, 7.5, 14, 9, 16.2, 0],
        "circle-color": "#f0c884",
        "circle-opacity": ["interpolate", ["linear"], ["zoom"], 6, 1, 10, 0.94, 14, 0.82, 16.2, 0],
        "circle-stroke-width": 1.2,
        "circle-stroke-color": "rgba(255,255,255,0.48)",
      },
    });

    map.addSource("project-parcel", {
      type: "geojson",
      data: emptyFeatureCollection(),
    });

    statusText.textContent =
      "The map opens in market view. Use AI prompts or choose a curated opportunity to begin.";

    if (!CAN_FETCH_LOCAL_ASSET) {
      statusText.textContent =
        "Open through http://localhost to unlock GLB presentation mode. Market view still works.";
    }

    map.on("move", handleMapCameraChange);
    map.on("moveend", () => {
      handleMapCameraChange();
      autoSelectProjectForCurrentView();
      queueVisibleModelSync();
    });
    refreshOverviewSources();
    startActivePointPulse();
  });

  focusButton.addEventListener("click", () => focusProject(true));
  resetButton.addEventListener("click", resetProjectView);
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runOmniSearch(omniSearch.value.trim());
  });
}

function buildCategoryChips() {
  categoryList.innerHTML = "";
  exploreCategories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-chip";
    button.textContent = category.label;
    button.dataset.categoryId = category.id;
    button.addEventListener("click", () => {
      activeCategory = category.id;
      omniSearch.value = "";
      applyProjectFilter(filterProjectsByCategory(category.id));
      updateCategoryButtons();
      statusText.textContent = `${category.label} curated for review.`;
    });
    categoryList.appendChild(button);
  });
  updateCategoryButtons();
}

function buildPromptChips() {
  promptList.innerHTML = "";
  promptExamples.forEach((prompt) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "prompt-chip";
    button.textContent = prompt;
    button.addEventListener("click", () => {
      omniSearch.value = prompt;
      runOmniSearch(prompt);
    });
    promptList.appendChild(button);
  });
}

function renderProjectList() {
  projectList.innerHTML = "";
  projectCount.textContent = `${visibleProjects.length} opportunities`;

  visibleProjects.forEach((project) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "project-card";
    card.dataset.projectId = project.id;
    card.innerHTML = `
      <span class="project-card-top">
        <span class="project-card-title">${project.name}</span>
        <span class="project-card-badge">${project.access}</span>
      </span>
      <span class="project-card-meta">${project.categoryLabel} • ${project.city}</span>
      <span class="project-card-copy">${project.summary}</span>
      <span class="project-card-stats">
        <span class="stat-pill">ROI ${project.roi}</span>
        <span class="stat-pill">${project.stage}</span>
        <span class="stat-pill">${project.ticket}</span>
      </span>
    `;
    card.addEventListener("click", () => selectProject(project.id, { autoFocus: true }));
    projectList.appendChild(card);
  });

  updateProjectCards();
}

function updateCategoryButtons() {
  Array.from(categoryList.children).forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.categoryId === activeCategory);
  });
}

function filterProjectsByCategory(categoryId) {
  if (categoryId === "all") {
    return [...projects];
  }
  return projects.filter((project) => project.categoryId === categoryId);
}

function applyProjectFilter(filteredProjects) {
  visibleProjects = filteredProjects;
  renderProjectList();
  refreshOverviewSources();

  const hasResults = visibleProjects.length > 0;
  emptyState.hidden = hasResults;
  if (!hasResults) {
    projectDetail.hidden = true;
    setGeoJsonSource("project-parcel", emptyFeatureCollection());
    activeProject = null;
    refreshOverviewSources();
    updateGlbVisibility();
    statusText.textContent = "No matching opportunities found. Try a broader investor query.";
  }
}

function runOmniSearch(query) {
  if (!query) {
    applyProjectFilter(filterProjectsByCategory(activeCategory));
    statusText.textContent = "Showing the curated market view again.";
    return;
  }

  const matches = scoreProjects(query)
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.project);

  if (matches.length === 0) {
    applyProjectFilter([]);
    return;
  }

  activeCategory = "all";
  updateCategoryButtons();
  applyProjectFilter(matches);
  statusText.textContent = `${matches.length} matching opportunities surfaced for "${query}".`;
  selectProject(matches[0].id, { autoFocus: true });
}

function scoreProjects(query) {
  const normalizedQuery = normalizeText(query);
  const roiThresholdMatch = normalizedQuery.match(/(?:roi|yield).{0,12}?(\d+(?:\.\d+)?)/);
  const roiThreshold = roiThresholdMatch ? Number(roiThresholdMatch[1]) : null;

  return projects.map((project) => {
    let score = 0;
    const projectText = normalizeText(
      [
        project.name,
        project.city,
        project.district,
        project.categoryLabel,
        project.access,
        project.stage,
        project.summary,
        project.thesis,
        ...project.searchTerms,
      ].join(" ")
    );

    if (projectText.includes(normalizedQuery)) {
      score += 12;
    }

    normalizedQuery.split(" ").forEach((term) => {
      if (term.length > 2 && projectText.includes(term)) {
        score += 2;
      }
    });

    if (/tirana|co-invest|partner|partnere|boulevard|capital/.test(normalizedQuery) && project.id === "boulevard-crown") {
      score += 8;
    }
    if (/tirana|permit|land|development|residential|liqeni/.test(normalizedQuery) && project.id === "palase-horizon") {
      score += 8;
    }
    if (/prishtina|commercial|office|yield|built|stabil/.test(normalizedQuery) && project.id === "prishtina-prime") {
      score += 8;
    }
    if (/durres|waterfront|marina|off plan|construction|seafront/.test(normalizedQuery) && project.id === "lalzi-villas") {
      score += 8;
    }

    if (roiThreshold !== null) {
      const projectRoiValue = parseFloat(project.roi);
      if (projectRoiValue >= roiThreshold) {
        score += 4;
      }
    }

    return { project, score };
  });
}

function normalizeText(value) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
}

function selectProject(projectId, options = {}) {
  const project = projects.find((item) => item.id === projectId);
  if (!project || !mapReady) {
    return;
  }

  activeProject = project;
  activeProjectAuto = Boolean(options.autoSelected);
  projectLoadToken += 1;
  const loadToken = projectLoadToken;

  updateProjectCards();
  updateProjectDetail(project);
  setGeoJsonSource("project-parcel", createProjectParcel(project));
  refreshOverviewSources();
  updateGlbVisibility();

  if (CAN_FETCH_LOCAL_ASSET) {
    if (!options.silentStatus) {
      statusText.textContent = `Loading ${project.name} presentation model...`;
    }
    ensureProjectModel(project, loadToken)
      .then(() => {
        if (loadToken !== projectLoadToken || activeProject?.id !== project.id) {
          return;
        }
        if (!options.silentStatus) {
          statusText.textContent = `${project.name} is ready for presentation view.`;
        }
      })
      .catch((error) => {
        console.error(error);
        debugLog("glb switch failed", String(error));
        if (loadToken !== projectLoadToken) {
          return;
        }
        if (!options.silentStatus) {
          statusText.textContent =
            "Model preview could not load. Parcel and market narrative are still available.";
        }
      });
  } else {
    if (!options.silentStatus) {
      statusText.textContent =
        "Market view is active. Run the app on localhost to unlock the GLB presentation layer.";
    }
  }

  if (!options.preserveCamera) {
    map.fitBounds(projectBounds(project), {
      padding: getOverviewPadding(),
      duration: 1000,
      pitch: project.pitchOverview,
      bearing: project.bearing,
      essential: true,
      maxZoom: project.zoomOverview,
    });
  }

  if (options.autoFocus !== false) {
    map.once("moveend", () => {
      if (!activeProject || activeProject.id !== project.id) {
        return;
      }
      focusProject(true);
    });
  }
}

function updateProjectDetail(project) {
  emptyState.hidden = true;
  projectDetail.hidden = false;
  projectTitle.textContent = project.name;
  projectMeta.textContent = `${project.city} • ${project.district}`;
  projectThesis.textContent = project.thesis;
  projectCategory.textContent = project.categoryLabel;
  projectRoi.textContent = project.roi;
  projectTicket.textContent = project.ticket;
  projectStage.textContent = project.stage;
  projectAccess.textContent = project.access;
  projectMemo.textContent = buildInvestmentMemo(project);
  renderTimeline(project.timeline, project.stage);
}

function renderTimeline(steps, activeStep) {
  projectTimeline.innerHTML = "";
  steps.forEach((step) => {
    const item = document.createElement("div");
    item.className = "timeline-step";
    if (step === activeStep) {
      item.classList.add("active");
    }
    item.textContent = step;
    projectTimeline.appendChild(item);
  });
}

function focusProject(withAnimation) {
  if (!mapReady || !activeProject) {
    return;
  }

  map.easeTo({
    center: activeProject.center,
    zoom: activeProject.zoomFocus,
    pitch: activeProject.pitchFocus,
    bearing: activeProject.bearing + 10,
    offset: getFocusOffset(),
    duration: withAnimation ? 1200 : 0,
    essential: true,
  });

  if (CAN_FETCH_LOCAL_ASSET) {
    updateGlbVisibility();
    statusText.textContent = `${activeProject.name} is now in cinematic presentation view.`;
  }
}

function resetProjectView() {
  if (!mapReady || !activeProject) {
    return;
  }

  map.easeTo({
    center: activeProject.center,
    zoom: activeProject.zoomOverview,
    pitch: activeProject.pitchOverview,
    bearing: activeProject.bearing,
    offset: [0, 0],
    duration: 900,
    essential: true,
  });
  statusText.textContent = `${activeProject.name} returned to market view.`;
}

function getOverviewPadding() {
  if (window.innerWidth < 980) {
    return { top: 250, right: 24, bottom: 24, left: 24 };
  }
  return { top: 120, right: 80, bottom: 80, left: 500 };
}

function getFocusOffset() {
  return window.innerWidth < 980 ? [0, 110] : [180, 90];
}

function updateProjectCards() {
  Array.from(projectList.children).forEach((card) => {
    card.classList.toggle("active", card.dataset.projectId === activeProject?.id);
  });
}

function refreshOverviewSources() {
  if (!mapReady) {
    return;
  }
  setGeoJsonSource("projects-overview-points", createProjectsOverviewPoints(getOverviewPointProjects()));
  setGeoJsonSource("active-project-point", createActiveProjectPoint());
  handleMapCameraChange();
  queueVisibleModelSync();
}

function setGeoJsonSource(sourceId, data) {
  const source = map.getSource(sourceId);
  if (source) {
    source.setData(data);
  }
}

function createProjectParcel(project) {
  return emptyFeatureCollection();
}

function createProjectsOverviewPoints(projectItems) {
  return {
    type: "FeatureCollection",
    features: projectItems.map((project) => ({
      type: "Feature",
      properties: { id: `${project.id}-point` },
      geometry: {
        type: "Point",
        coordinates: project.center,
      },
    })),
  };
}

function createActiveProjectPoint() {
  if (!activeProject) {
    return emptyFeatureCollection();
  }

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { id: `${activeProject.id}-active-point` },
        geometry: {
          type: "Point",
          coordinates: activeProject.center,
        },
      },
    ],
  };
}

function getOverviewPointProjects() {
  return visibleProjects.filter((project) => project.id !== activeProject?.id);
}

function emptyFeatureCollection() {
  return { type: "FeatureCollection", features: [] };
}

function projectBounds(project) {
  const coordinates = project.footprint;
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

function updateGlbVisibility() {
  if (!glbState) {
    return;
  }
  map.triggerRepaint();
}

function getModelRevealZoom(project) {
  return Math.max(project.zoomOverview + MODEL_REVEAL_ZOOM_BUFFER, project.zoomFocus - 1.1);
}

function handleMapCameraChange() {
  if (!mapReady) {
    return;
  }

  updateGlbVisibility();

  if (!map.getLayer("active-project-pulse")) {
    return;
  }

  const revealZoom = activeProject ? getModelRevealZoom(activeProject) : 16.2;
  const fadeProgress = clamp((map.getZoom() - (revealZoom - 0.7)) / 0.7, 0, 1);
  const activeOpacity = activeProject ? 1 - fadeProgress : 0;

  map.setPaintProperty("active-project-core", "circle-opacity", activeOpacity * 0.96);
  map.setPaintProperty("active-project-pulse", "circle-opacity", activeOpacity * 0.22);
}

function autoSelectProjectForCurrentView() {
  if (!mapReady) {
    return;
  }

  if (activeProject && !activeProjectAuto) {
    return;
  }

  if (map.getZoom() < AUTO_SELECT_ZOOM) {
    if (activeProjectAuto) {
      clearActiveProject();
    }
    return;
  }

  const mapCenter = map.getCenter();
  const nearestProject = visibleProjects
    .map((project) => ({
      project,
      distance: distanceBetweenLngLat(project.center, [mapCenter.lng, mapCenter.lat]),
    }))
    .sort((a, b) => a.distance - b.distance)[0];

  if (!nearestProject || nearestProject.distance > AUTO_SELECT_DISTANCE_METERS) {
    if (activeProjectAuto) {
      clearActiveProject();
    }
    return;
  }

  if (activeProject?.id === nearestProject.project.id) {
    return;
  }

  selectProject(nearestProject.project.id, {
    autoFocus: false,
    preserveCamera: true,
    silentStatus: true,
    autoSelected: true,
  });
}

function queueVisibleModelSync() {
  if (!mapReady || !CAN_FETCH_LOCAL_ASSET) {
    return;
  }

  const loadToken = projectLoadToken;
  const projectsToSync = visibleProjects.filter((project) => shouldRenderProjectModel(project));
  projectsToSync.forEach((project) => {
    ensureProjectModel(project, loadToken).catch((error) => {
      debugLog("visible model sync failed", project.id, String(error));
    });
  });
}

function startActivePointPulse() {
  if (pulseAnimationId || !map) {
    return;
  }

  const tick = () => {
    pulseAnimationId = window.requestAnimationFrame(tick);
    if (!mapReady || !map.getLayer("active-project-pulse")) {
      return;
    }

    pulseFrame += 0.035;
    const zoom = map.getZoom();
    const revealZoom = activeProject ? getModelRevealZoom(activeProject) : 16.2;
    const fadeProgress = clamp((zoom - (revealZoom - 0.7)) / 0.7, 0, 1);
    const activeOpacity = activeProject ? 1 - fadeProgress : 0;
    const radius = 16 + Math.sin(pulseFrame) * 3 + activeOpacity * 8;

    map.setPaintProperty("active-project-pulse", "circle-radius", radius);
    map.setPaintProperty("active-project-pulse", "circle-opacity", activeOpacity * 0.22);
  };

  pulseAnimationId = window.requestAnimationFrame(tick);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function clearActiveProject() {
  activeProject = null;
  activeProjectAuto = false;
  projectLoadToken += 1;
  projectDetail.hidden = true;
  emptyState.hidden = false;
  setGeoJsonSource("project-parcel", emptyFeatureCollection());
  updateProjectCards();
  refreshOverviewSources();
  updateGlbVisibility();
  statusText.textContent = "Zoom into a nearby project or choose one from the curated list.";
}

function distanceBetweenLngLat([lonA, latA], [lonB, latB]) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusMeters = 6371000;
  const dLat = toRadians(latB - latA);
  const dLon = toRadians(lonB - lonA);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(latA)) * Math.cos(toRadians(latB)) * Math.sin(dLon / 2) ** 2;

  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildInvestmentMemo(project) {
  return `${project.stage}. ${project.ticket}. ${project.thesis}`;
}

async function initGlbLayer() {
  if (glbState || glbInitPromise) {
    return glbInitPromise;
  }

  glbInitPromise = (async () => {
    const THREE_NS = await import("https://esm.sh/three@0.161.0");
    const { GLTFLoader } = await import(
      "https://esm.sh/three@0.161.0/examples/jsm/loaders/GLTFLoader?deps=three@0.161.0"
    );
    const { RoomEnvironment } = await import(
      "https://esm.sh/three@0.161.0/examples/jsm/environments/RoomEnvironment?deps=three@0.161.0"
    );

    glbState = {
      THREE_NS,
      ready: false,
      scene: null,
      camera: null,
      renderer: null,
      loader: null,
      modelCache: new Map(),
      modelEntries: new Map(),
    };

    const customLayer = {
      id: "project-glb-model",
      type: "custom",
      renderingMode: "3d",
      onAdd() {
        const { THREE_NS: THREE } = glbState;
        glbState.camera = new THREE.Camera();
        glbState.scene = new THREE.Scene();

        glbState.scene.add(new THREE.AmbientLight(0xffffff, 1.45));
        glbState.scene.add(new THREE.HemisphereLight(0xfff1d8, 0x314f76, 1.05));

        const lightA = new THREE.DirectionalLight(0xffffff, 1.55);
        lightA.position.set(110, 150, 110);
        glbState.scene.add(lightA);

        const lightB = new THREE.DirectionalLight(0xf8d9a7, 1.05);
        lightB.position.set(-95, 120, -80);
        glbState.scene.add(lightB);

        const rimLight = new THREE.DirectionalLight(0xbfd8ff, 0.9);
        rimLight.position.set(40, 80, -140);
        glbState.scene.add(rimLight);

        glbState.renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: map.painter.context.gl,
          antialias: true,
        });
        glbState.renderer.autoClear = false;
        glbState.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        glbState.renderer.toneMappingExposure = 1.25;
        glbState.renderer.outputColorSpace = THREE.SRGBColorSpace;

        const pmremGenerator = new THREE.PMREMGenerator(glbState.renderer);
        const environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
        glbState.scene.environment = environment.texture;
        pmremGenerator.dispose();

        glbState.loader = new GLTFLoader();
      },
      render(_gl, matrix) {
        if (!glbState || !glbState.ready || !glbState.modelEntries.size) {
          return;
        }

        const { THREE_NS: THREE } = glbState;
        const baseMatrix = new THREE.Matrix4().fromArray(matrix);
        let hasVisibleModel = false;

        glbState.modelEntries.forEach((entry) => {
          entry.group.visible = false;
        });

        glbState.modelEntries.forEach((entry) => {
          const shouldShow = shouldRenderProjectModel(entry.project);
          if (!shouldShow) {
            return;
          }

          const mercator = window.maplibregl.MercatorCoordinate.fromLngLat(entry.project.center, 0);
          const desiredHeightMeters =
            entry.project.floorCount * entry.project.floorHeight + entry.project.roofHeight;
          const scale =
            mercator.meterInMercatorCoordinateUnits() * (desiredHeightMeters / entry.modelHeight);

          const modelMatrix = new THREE.Matrix4()
            .makeTranslation(mercator.x, mercator.y, mercator.z)
            .scale(new THREE.Vector3(scale, -scale, scale));

          entry.group.visible = true;
          glbState.camera.projectionMatrix = baseMatrix.clone().multiply(modelMatrix);
          glbState.renderer.resetState();
          glbState.renderer.clearDepth();
          glbState.renderer.render(glbState.scene, glbState.camera);
          entry.group.visible = false;
          hasVisibleModel = true;
        });

        if (!hasVisibleModel) {
          return;
        }
      },
    };

    map.addLayer(customLayer);
  })();

  return glbInitPromise;
}

async function ensureProjectModel(project, loadToken) {
  if (!project?.modelSrc) {
    return;
  }

  await initGlbLayer();
  if (!glbState || !glbState.scene || !glbState.loader || loadToken !== projectLoadToken) {
    return;
  }

  if (glbState.modelEntries.has(project.id)) {
    return;
  }

  const { THREE_NS: THREE } = glbState;
  let template = glbState.modelCache.get(project.modelSrc);
  if (!template) {
    const gltf = await glbState.loader.loadAsync(project.modelSrc);
    if (loadToken !== projectLoadToken) {
      return;
    }
    template = gltf.scene;
    glbState.modelCache.set(project.modelSrc, template);
  }

  if (loadToken !== projectLoadToken) {
    return;
  }

  const group = new THREE.Group();
  const instance = template.clone(true);
  prepareModelInstance(instance);
  instance.rotation.x = Math.PI / 2;
  group.add(instance);
  glbState.scene.add(group);

  const box = new THREE.Box3().setFromObject(instance);
  const size = box.getSize(new THREE.Vector3());
  glbState.modelEntries.set(project.id, {
    project,
    group,
    modelHeight: Math.max(size.y, 1),
  });
  glbState.ready = true;
  map.triggerRepaint();
}

function shouldRenderProjectModel(project) {
  if (!mapReady || !map || map.getZoom() < getModelRevealZoom(project)) {
    return false;
  }

  if (!visibleProjects.some((item) => item.id === project.id)) {
    return false;
  }

  const bounds = map.getBounds();
  return bounds.contains(project.center);
}

function prepareModelInstance(root) {
  root.traverse((node) => {
    if (!node.isMesh) {
      return;
    }

    node.castShadow = false;
    node.receiveShadow = false;
    node.frustumCulled = false;
  });
}
