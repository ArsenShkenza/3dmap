const projectList = document.getElementById("project-list");
const projectCount = document.getElementById("project-count");
const projectDetail = document.getElementById("project-detail");
const openProjectPageButton = document.getElementById("open-project-page");
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
const categoryList = document.getElementById("category-list");
const promptList = document.getElementById("prompt-list");
const searchForm = document.getElementById("search-form");
const omniSearch = document.getElementById("omni-search");
const experiencePage = document.getElementById("experience-page");
const experienceClose = document.getElementById("experience-close");
const experienceKicker = document.getElementById("experience-kicker");
const experienceTitle = document.getElementById("experience-title");
const experienceMeta = document.getElementById("experience-meta");
const experienceSummary = document.getElementById("experience-summary");
const experienceAccess = document.getElementById("experience-access");
const experienceCategory = document.getElementById("experience-category");
const experienceRoi = document.getElementById("experience-roi");
const experienceStage = document.getElementById("experience-stage");
const floorElevation = document.getElementById("floor-elevation");

const DEBUG = false;
const CAN_FETCH_LOCAL_ASSET = window.location.protocol !== "file:";
const BUILDING_ELEVATION_SRC = "./assets/building5.jpg";
/**
 * Optional manual polygon overrides (percent coordinates) per project and floor number.
 * Example:
 * FLOOR_SHAPES["palase-horizon"][37] = [[8,0],[92,0],...,[0,50]]
 */
const FLOOR_SHAPES = {
  "palase-horizon": {
    // Top crown samples - edit these and add more floors as needed.
    37: [
      [9.2, 0],
      [90.8, 0],
      [94.8, 7.0],
      [97.2, 15.0],
      [99.0, 28.0],
      [100, 50.0],
      [99.0, 72.0],
      [97.2, 85.0],
      [94.8, 93.0],
      [90.8, 100],
      [9.2, 100],
      [5.2, 93.0],
      [2.8, 85.0],
      [1.0, 72.0],
      [0, 50.0],
      [1.0, 28.0],
      [2.8, 15.0],
      [5.2, 7.0],
    ],
    36: [
      [8.7, 0],
      [91.3, 0],
      [95.0, 6.5],
      [97.1, 14.0],
      [99.0, 25.0],
      [100, 50.0],
      [99.0, 75.0],
      [97.1, 86.0],
      [95.0, 93.5],
      [91.3, 100],
      [8.7, 100],
      [5.0, 93.5],
      [2.9, 86.0],
      [1.0, 75.0],
      [0, 50.0],
      [1.0, 25.0],
      [2.9, 14.0],
      [5.0, 6.5],
    ],
    1: [
      [2.0, 0],
      [98.0, 0],
      [100, 10.0],
      [100, 20.0],
      [99.0, 34.0],
      [99.4, 66.0],
      [100, 80.0],
      [100, 90.0],
      [98.0, 100],
      [2.0, 100],
      [0, 90.0],
      [0, 80.0],
      [0.8, 66.0],
      [1.0, 34.0],
      [0, 20.0],
      [0, 10.0],
    ],
  },
};
/**
 * Exact floor polygons in original image pixel space (full facade image coordinates).
 * Use this when you have coordinates from <area coords="..."> maps.
 */
const FLOOR_POLYGONS_ABSOLUTE = {
  "palase-horizon": {
    // Match tracing tool output from building5.jpg
    sourceWidth: 1089,
    sourceHeight: 2171,
    floors: {
      37: [
        116,
        276,
        325,
        58,
        968,
        281,
        968,
        337,
        328,
        121,
        116,
        334,
        116,
        276
      ],
      36: [
        116,
        334,
        328,
        117,
        968,
        340,
        969,
        389,
        328,
        174,
        117,
        380,
        116,
        334
      ],
    },
  },
};

const exploreCategories = [
  { id: "all", label: "All Opportunities" },
  { id: "land", label: "Land & Development" },
  { id: "partners", label: "Seeking Partners" },
  { id: "turnkey", label: "Turn-key / Built" },
  { id: "offplan", label: "Off-Plan Vision" },
];

const promptExamples = [
  "Land and development opportunities in Tirana or Durres",
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
    floorCount: 37,
    floorHeight: 3.55,
    roofHeight: 3.1,
    objectKind: "glb",
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
    objectKind: "glb",
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
    objectKind: "glb",
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
    objectKind: "glb",
    modelSrc: "./assets/skyscraper.glb",
    searchTerms: ["durres", "marina", "residences", "off-plan", "construction", "waterfront"],
  },
  {
    id: "tirana-reserve-parcel",
    name: "Tirana Reserve Parcel",
    city: "Tirana",
    district: "Northern Expansion Belt",
    categoryId: "land",
    categoryLabel: "Land & Development",
    access: "Open",
    roi: "11.1%",
    ticket: "EUR 5.2M land entry",
    stage: "Planning Stage",
    timeline: ["Site Control", "Planning", "Permit Strategy", "Capital Raise"],
    summary: "A clean urban parcel positioned for mixed-use development once planning parameters are finalized.",
    thesis:
      "This is a lower-ticket land story for investors who want to secure city exposure before vertical development economics are fully priced in.",
    center: [19.8187, 41.3478],
    bearing: -6,
    zoomOverview: 15.0,
    zoomFocus: 17.4,
    pitchOverview: 49,
    pitchFocus: 58,
    footprint: [
      [19.81836, 41.34756],
      [19.81903, 41.34753],
      [19.81918, 41.34802],
      [19.81848, 41.34808],
      [19.81836, 41.34756],
    ],
    floorCount: 0,
    floorHeight: 0,
    roofHeight: 0,
    objectKind: "land",
    objectColor: "#7ca2d8",
    modelSrc: "",
    searchTerms: ["tirana", "land", "parcel", "planning", "mixed-use", "reserve"],
  },
  {
    id: "durres-port-assembly",
    name: "Durres Port Assembly Plot",
    city: "Durres",
    district: "Port Access Corridor",
    categoryId: "land",
    categoryLabel: "Land & Development",
    access: "VIP",
    roi: "10.2%",
    ticket: "EUR 7.8M site assembly",
    stage: "Site Assembly",
    timeline: ["Site Assembly", "Control", "Structuring", "Execution"],
    summary: "A logistics-adjacent land package suited for phased development and strategic assembly buyers.",
    thesis:
      "Port adjacency and infrastructure exposure make this a pragmatic land story with optionality beyond a single product type.",
    center: [19.4472, 41.3195],
    bearing: -14,
    zoomOverview: 14.6,
    zoomFocus: 17.0,
    pitchOverview: 47,
    pitchFocus: 57,
    footprint: [
      [19.44673, 41.31917],
      [19.44756, 41.31915],
      [19.44768, 41.31972],
      [19.44684, 41.31978],
      [19.44673, 41.31917],
    ],
    floorCount: 0,
    floorHeight: 0,
    roofHeight: 0,
    objectKind: "land",
    objectColor: "#6f9bb2",
    modelSrc: "",
    searchTerms: ["durres", "land", "port", "assembly", "logistics", "site"],
  },
  {
    id: "prishtina-urban-reserve",
    name: "Prishtina Urban Reserve",
    city: "Prishtina",
    district: "Mixed-Use Growth Edge",
    categoryId: "land",
    categoryLabel: "Land & Development",
    access: "Open",
    roi: "10.7%",
    ticket: "EUR 4.9M land banking",
    stage: "Feasibility",
    timeline: ["Feasibility", "Concepting", "Planning", "Raise"],
    summary: "A future mixed-use parcel used to present long-horizon upside without requiring immediate vertical execution.",
    thesis:
      "This is a patient capital play that secures strategic city-edge positioning before the next planning cycle lifts land values.",
    center: [21.1702, 42.6487],
    bearing: 10,
    zoomOverview: 14.9,
    zoomFocus: 17.2,
    pitchOverview: 48,
    pitchFocus: 58,
    footprint: [
      [21.16987, 42.64845],
      [21.17045, 42.64841],
      [21.17058, 42.64891],
      [21.16998, 42.64896],
      [21.16987, 42.64845],
    ],
    floorCount: 0,
    floorHeight: 0,
    roofHeight: 0,
    objectKind: "land",
    objectColor: "#8aa5c0",
    modelSrc: "",
    searchTerms: ["prishtina", "land", "reserve", "mixed-use", "planning", "future"],
  },
  {
    id: "tirana-garden-offices",
    name: "Tirana Garden Offices",
    city: "Tirana",
    district: "Inner Residential Belt",
    categoryId: "turnkey",
    categoryLabel: "Turn-key / Built",
    access: "Open",
    roi: "8.5%",
    ticket: "EUR 3.9M acquisition",
    stage: "Operational Asset",
    timeline: ["Completed", "Operational", "Lease-Up", "Yield Hold"],
    summary: "A smaller office-led building positioned as a cleaner entry point for buyers who want income without landmark-scale exposure.",
    thesis:
      "A mid-market office acquisition with a simpler leasing story and lower capital intensity than the flagship assets.",
    center: [19.8114, 41.3256],
    bearing: 6,
    zoomOverview: 15.5,
    zoomFocus: 17.9,
    pitchOverview: 50,
    pitchFocus: 61,
    footprint: [
      [19.81117, 41.32542],
      [19.81155, 41.3254],
      [19.81162, 41.32572],
      [19.81124, 41.32575],
      [19.81117, 41.32542],
    ],
    floorCount: 7,
    floorHeight: 3.15,
    roofHeight: 2.4,
    objectKind: "massing",
    objectColor: "#c2a678",
    modelSrc: "",
    searchTerms: ["tirana", "office", "built", "acquisition", "income", "garden"],
  },
  {
    id: "durres-trade-lofts",
    name: "Durres Trade Lofts",
    city: "Durres",
    district: "Commercial Waterfront Edge",
    categoryId: "partners",
    categoryLabel: "Seeking Partners",
    access: "Invite Only",
    roi: "9.4%",
    ticket: "EUR 4.4M co-investment",
    stage: "Structuring",
    timeline: ["Concept Ready", "Structuring", "Partner Raise", "Execution"],
    summary: "A mid-rise commercial block used to show a more practical co-investment story beyond the hero tower opportunity.",
    thesis:
      "This is a lower-friction partner deal with compact scale, clearer phasing, and stronger flexibility on exit strategy.",
    center: [19.4436, 41.3121],
    bearing: -18,
    zoomOverview: 15.0,
    zoomFocus: 17.4,
    pitchOverview: 49,
    pitchFocus: 60,
    footprint: [
      [19.44335, 41.31194],
      [19.44379, 41.31191],
      [19.44387, 41.31227],
      [19.44342, 41.31231],
      [19.44335, 41.31194],
    ],
    floorCount: 8,
    floorHeight: 3.2,
    roofHeight: 2.5,
    objectKind: "massing",
    objectColor: "#a78668",
    modelSrc: "",
    searchTerms: ["durres", "partner", "commercial", "mid-rise", "trade", "lofts"],
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
let experienceProjectId = "";
let hoveredFloorId = "";
let selectedFloorId = "";
const floorTraceState = {
  enabled: false,
  floorNumber: 37,
  pointsPct: [],
  pointsByFloor: {},
  closedByFloor: {},
  isClosed: false,
  cursorPct: null,
};

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
    document.documentElement.classList.remove("experience-launch");
    return;
  }

  buildCategoryChips();
  buildPromptChips();
  renderProjectList();
  consumeExperienceQueryParam();

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

    map.addSource("projects-close-objects", {
      type: "geojson",
      data: createCloseObjectCollection(visibleProjects),
    });
    map.addLayer({
      id: "projects-close-land-fill",
      type: "fill",
      source: "projects-close-objects",
      filter: ["==", ["get", "objectKind"], "land"],
      paint: {
        "fill-color": ["get", "objectColor"],
        "fill-opacity": ["interpolate", ["linear"], ["zoom"], 14.2, 0, 15.2, 0.14, 17.8, 0.22],
      },
    });
    map.addLayer({
      id: "projects-close-land-line",
      type: "line",
      source: "projects-close-objects",
      filter: ["==", ["get", "objectKind"], "land"],
      paint: {
        "line-color": ["get", "objectColor"],
        "line-opacity": ["interpolate", ["linear"], ["zoom"], 14.2, 0, 15.2, 0.42, 17.8, 0.75],
        "line-width": ["interpolate", ["linear"], ["zoom"], 14.2, 0.8, 17.8, 2.1],
      },
    });
    map.addLayer({
      id: "projects-close-massing",
      type: "fill-extrusion",
      source: "projects-close-objects",
      filter: ["==", ["get", "objectKind"], "massing"],
      paint: {
        "fill-extrusion-color": ["get", "objectColor"],
        "fill-extrusion-height": ["get", "heightMeters"],
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": ["interpolate", ["linear"], ["zoom"], 14.5, 0, 15.5, 0.3, 17.8, 0.56],
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
    bindMapInteractions();
    refreshOverviewSources();
    startActivePointPulse();
  });

  focusButton.addEventListener("click", () => focusProject(true));
  openProjectPageButton.addEventListener("click", () => {
    if (!activeProject) {
      return;
    }
    openProjectExperienceInNewTab(activeProject.id);
  });
  resetButton.addEventListener("click", resetProjectView);
  experienceClose.addEventListener("click", closeProjectExperience);
  experiencePage.querySelector(".experience-backdrop")?.addEventListener("click", closeProjectExperience);
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runOmniSearch(omniSearch.value.trim());
  });
}

function bindMapInteractions() {
  const interactiveLayers = [
    "projects-glow-inner",
    "projects-glow-outer",
    "active-project-core",
    "projects-close-land-fill",
    "projects-close-land-line",
    "projects-close-massing",
  ];

  interactiveLayers.forEach((layerId) => {
    map.on("mouseenter", layerId, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", layerId, () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("click", layerId, (event) => {
      const projectId = event.features?.[0]?.properties?.projectId;
      if (!projectId) {
        return;
      }
      selectProject(projectId, { autoFocus: true, autoSelected: false });
    });
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
    const card = document.createElement("article");
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
      <span class="project-card-actions">
        <button type="button" class="go-to-project-button">Go To Project</button>
        <button type="button" class="ghost-button open-project-page-button">Open Project</button>
      </span>
    `;
    card.querySelector(".go-to-project-button")?.addEventListener("click", () => {
      selectProject(project.id, { autoFocus: true, autoSelected: false });
    });
    card.querySelector(".open-project-page-button")?.addEventListener("click", () => {
      openProjectExperienceInNewTab(project.id);
    });
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

  if (CAN_FETCH_LOCAL_ASSET && project.modelSrc) {
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
      statusText.textContent = project.modelSrc
        ? "Market view is active. Run the app on localhost to unlock the GLB presentation layer."
        : `${project.name} is surfaced as a site opportunity on the map.`;
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

function openProjectExperienceInNewTab(projectId) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) {
    return;
  }
  const url = new URL(window.location.href);
  url.searchParams.set("experience", projectId);
  window.open(url.toString(), "_blank", "noopener,noreferrer");
}

function consumeExperienceQueryParam() {
  const params = new URLSearchParams(window.location.search);
  const experienceId = params.get("experience");
  if (!experienceId) {
    return;
  }

  const project = projects.find((item) => item.id === experienceId);
  params.delete("experience");
  const newQuery = params.toString();
  const cleanUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ""}${window.location.hash}`;
  history.replaceState(null, "", cleanUrl);

  if (project) {
    openProjectExperience(experienceId, { focusMap: false });
  }

  document.documentElement.classList.remove("experience-launch");
}

function openProjectExperience(projectId, options = {}) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) {
    return;
  }

  experienceProjectId = project.id;
  const experience = buildProjectExperience(project);
  const defaultFloor = experience.floors[0];
  hoveredFloorId = defaultFloor?.id ?? "";
  selectedFloorId = defaultFloor?.id ?? "";

  experienceKicker.textContent = project.objectKind === "land" ? "Development Opportunity" : "Full Project Experience";
  experienceTitle.textContent = project.name;
  experienceMeta.textContent = `${project.city} • ${project.district}`;
  experienceSummary.textContent = project.summary;
  experienceAccess.textContent = project.access;
  experienceCategory.textContent = project.categoryLabel;
  experienceRoi.textContent = project.roi;
  experienceStage.textContent = project.stage;

  renderExperienceElevation(experience);

  experiencePage.hidden = false;

  if (options.focusMap !== false) {
    selectProject(project.id, {
      autoFocus: false,
      preserveCamera: false,
      silentStatus: false,
      autoSelected: false,
    });
  }
}

function closeProjectExperience() {
  experiencePage.hidden = true;
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
}

function buildProjectExperience(project) {
  const floorCount = Math.max(project.floorCount || 0, project.objectKind === "land" ? 6 : 4);
  const floors = Array.from({ length: floorCount }, (_, index) => {
    const floorNumber = floorCount - index;
    const unitsPerFloor = project.objectKind === "land" ? 3 : project.floorCount > 12 ? 4 : 3;
    const units = Array.from({ length: unitsPerFloor }, (__unused, unitIndex) => {
      const areaBase = project.objectKind === "land" ? 95 : 78;
      const area = areaBase + floorNumber * 3 + unitIndex * 11;
      const unitType =
        project.objectKind === "land"
          ? unitIndex === 0
            ? "Retail / Lobby"
            : unitIndex === 1
              ? "Typical Residential"
              : "Amenity / Terrace"
          : unitIndex === 0
            ? "Corner Unit"
            : unitIndex === unitsPerFloor - 1
              ? "Premium Suite"
              : "Standard Unit";

      return {
        id: `${project.id}-f${floorNumber}-u${unitIndex + 1}`,
        name: `${String.fromCharCode(65 + unitIndex)}${floorNumber}`,
        area,
        type: unitType,
        status:
          unitIndex === 0 ? "Available" : unitIndex === 1 ? "Reserved" : project.objectKind === "land" ? "Indicative" : "Available",
      };
    });

    return {
      id: `${project.id}-floor-${floorNumber}`,
      number: floorNumber,
      label: project.objectKind === "land" ? `Indicative Level ${floorNumber}` : `Floor ${floorNumber}`,
      meta: project.objectKind === "land" ? "Concept stack" : `${units.length} units`,
      units,
    };
  });

  return { project, floors };
}

function getFacadeZoneLayout(floorCount) {
  const safeFloorCount = Math.max(floorCount, 1);
  const facadeTop = 0.068;
  const facadeBottom = 0.972;
  const facadeHeight = facadeBottom - facadeTop;
  const podiumWeight = 1.34;
  const typicalGapWeight = 0.18;
  const upperSetbackWeight = 0.42;
  const typicalFloorCount = Math.max(safeFloorCount - 1, 0);
  const totalWeight =
    upperSetbackWeight +
    podiumWeight +
    Math.max(typicalFloorCount - 1, 0) * typicalGapWeight +
    typicalFloorCount;
  const unit = facadeHeight / totalWeight;
  const zones = [];
  let cursor = facadeBottom;

  zones.push({
    top: cursor - podiumWeight * unit,
    height: podiumWeight * unit,
  });
  cursor = zones[0].top;

  for (let floorIndex = 0; floorIndex < typicalFloorCount; floorIndex += 1) {
    const zoneHeight = unit;
    zones.push({
      top: cursor - zoneHeight,
      height: zoneHeight,
    });
    cursor -= zoneHeight;
    if (floorIndex < typicalFloorCount - 1) {
      cursor -= typicalGapWeight * unit;
    }
  }

  if (zones.length > 1) {
    zones[zones.length - 1].top -= upperSetbackWeight * unit;
    zones[zones.length - 1].height += upperSetbackWeight * unit;
  }

  return zones
    .reverse()
    .map((zone, zoneIndex, allZones) => {
      const center = zone.top + zone.height / 2;
      const silhouette = getFacadeSliceSilhouette(center);
      return {
        ...zone,
        index: zoneIndex,
        yRatio: center,
        floorCount: allZones.length,
        leftInset: silhouette.leftInset,
        rightInset: silhouette.rightInset,
      };
    });
}

function getFacadeSliceSilhouette(yRatio) {
  const y = clamp(yRatio, 0, 1);
  // Keyframed profile sampled from building5 facade silhouette (top -> bottom).
  const profile = [
    { y: 0.0, leftInset: 29.2, rightInset: 30.0 },
    { y: 0.07, leftInset: 27.6, rightInset: 28.5 },
    { y: 0.14, leftInset: 24.4, rightInset: 25.1 },
    { y: 0.22, leftInset: 22.0, rightInset: 22.8 },
    { y: 0.31, leftInset: 20.6, rightInset: 21.2 },
    { y: 0.43, leftInset: 19.6, rightInset: 20.3 },
    { y: 0.56, leftInset: 19.0, rightInset: 19.8 },
    { y: 0.69, leftInset: 18.5, rightInset: 19.2 },
    { y: 0.79, leftInset: 17.9, rightInset: 18.6 },
    { y: 0.88, leftInset: 17.1, rightInset: 17.9 },
    { y: 0.94, leftInset: 16.3, rightInset: 17.2 },
    { y: 1.0, leftInset: 15.6, rightInset: 16.5 },
  ];

  for (let index = 0; index < profile.length - 1; index += 1) {
    const current = profile[index];
    const next = profile[index + 1];
    if (y <= next.y) {
      const span = Math.max(next.y - current.y, 0.0001);
      const t = (y - current.y) / span;
      return {
        leftInset: lerp(current.leftInset, next.leftInset, t),
        rightInset: lerp(current.rightInset, next.rightInset, t),
      };
    }
  }

  const last = profile[profile.length - 1];
  return { leftInset: last.leftInset, rightInset: last.rightInset };
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function getFloorClipPath(zone) {
  const y = clamp(zone.yRatio ?? 0.5, 0, 1);
  const floorCount = Math.max(zone.floorCount ?? 1, 1);
  const normalizedIndex = floorCount <= 1 ? 0 : (zone.index ?? 0) / (floorCount - 1);
  // Make corner complexity vary by height so each floor can have a distinct contour.
  if (y < 0.16) {
    // Crown floors: many corners, stronger chamfers and steps.
    return [
      [8.5, 0],
      [91.5, 0],
      [95.0, 6.5],
      [97.0, 13.5],
      [99.0, 24.0],
      [100, 50.0],
      [99.0, 76.0],
      [97.0, 86.5],
      [95.0, 93.5],
      [91.5, 100],
      [8.5, 100],
      [5.0, 93.5],
      [3.0, 86.5],
      [1.0, 76.0],
      [0, 50.0],
      [1.0, 24.0],
      [3.0, 13.5],
      [5.0, 6.5],
    ];
  }
  if (y < 0.42) {
    // Upper tower: 12-corner form.
    return [
      [6.0, 0],
      [94.0, 0],
      [97.2, 10.0],
      [100, 25.0],
      [100, 75.0],
      [97.2, 90.0],
      [94.0, 100],
      [6.0, 100],
      [2.8, 90.0],
      [0, 75.0],
      [0, 25.0],
      [2.8, 10.0],
    ];
  }
  if (y < 0.8) {
    // Mid tower: mostly regular with subtle variation per floor index.
    const nudge = (Math.sin(normalizedIndex * Math.PI * 6) * 0.7).toFixed(3);
    const side = 2 + Number(nudge);
    return [
      [3.6, 0],
      [96.4, 0],
      [99.4, 14.0],
      [100, 50.0],
      [99.4, 86.0],
      [96.4, 100],
      [3.6, 100],
      [side, 86.0],
      [0, 50.0],
      [side, 14.0],
    ];
  }
  // Lower floors/podium: heavier shoulders and deeper cuts.
  return [
    [2.4, 0],
    [97.6, 0],
    [100, 10.0],
    [100, 22.0],
    [98.8, 34.0],
    [99.2, 66.0],
    [100, 78.0],
    [100, 90.0],
    [97.6, 100],
    [2.4, 100],
    [0, 90.0],
    [0, 78.0],
    [0.8, 66.0],
    [1.2, 34.0],
    [0, 22.0],
    [0, 10.0],
  ];
}

function toPolygonClipPath(points) {
  return `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
}

function getManualFloorClipPath(projectId, floorNumber) {
  const projectShapes = FLOOR_SHAPES[projectId];
  if (!projectShapes) {
    return null;
  }
  const points = projectShapes[floorNumber];
  if (!Array.isArray(points) || points.length < 3) {
    return null;
  }
  return points;
}

function toPointPairs(raw) {
  if (!Array.isArray(raw) || raw.length < 6) {
    return null;
  }

  if (Array.isArray(raw[0])) {
    const pairs = raw
      .filter((point) => Array.isArray(point) && point.length >= 2)
      .map(([x, y]) => [Number(x), Number(y)]);
    return pairs.length >= 3 ? pairs : null;
  }

  const pairs = [];
  for (let index = 0; index < raw.length - 1; index += 2) {
    pairs.push([Number(raw[index]), Number(raw[index + 1])]);
  }
  return pairs.length >= 3 ? pairs : null;
}

function getAbsoluteFloorGeometry(projectId, floorNumber) {
  const projectPolygons = FLOOR_POLYGONS_ABSOLUTE[projectId];
  if (!projectPolygons) {
    return null;
  }

  const rawCoords = projectPolygons.floors?.[floorNumber];
  const points = toPointPairs(rawCoords);
  if (!points) {
    return null;
  }

  const sourceWidth = Number(projectPolygons.sourceWidth);
  const sourceHeight = Number(projectPolygons.sourceHeight);
  if (!sourceWidth || !sourceHeight) {
    return null;
  }

  const normalized = points.map(([x, y]) => [
    clamp((x / sourceWidth) * 100, 0, 100),
    clamp((y / sourceHeight) * 100, 0, 100),
  ]);

  const xs = normalized.map(([x]) => x);
  const ys = normalized.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(maxX - minX, 0.1);
  const height = Math.max(maxY - minY, 0.1);

  const clipPoints = normalized.map(([x, y]) => [
    ((x - minX) / width) * 100,
    ((y - minY) / height) * 100,
  ]);

  return {
    topPct: minY,
    heightPct: height,
    leftInsetPct: minX,
    rightInsetPct: 100 - maxX,
    clipPoints,
  };
}

function renderExperienceElevation(experience) {
  floorElevation.innerHTML = "";
  const caption = document.createElement("p");
  caption.className = "elevation-caption";
  caption.textContent =
    experience.project.objectKind === "land"
      ? "Scroll for full image · indicative elevation"
      : "Scroll for full elevation · hover floors to explore";
  floorElevation.appendChild(caption);

  const tower = document.createElement("div");
  tower.className = "elevation-tower";

  const image = document.createElement("img");
  image.className = "elevation-image";
  image.src = BUILDING_ELEVATION_SRC;
  image.alt = `${experience.project.name} facade elevation`;
  tower.appendChild(image);

  const stack = document.createElement("div");
  stack.className = "elevation-floor-stack";
  const hasAbsolutePolygons = Boolean(FLOOR_POLYGONS_ABSOLUTE[experience.project.id]);
  if (hasAbsolutePolygons) {
    // Absolute floor polygons are defined in full-image coordinates, so
    // the interactive stack must span the whole facade image area.
    stack.style.inset = "0";
  }
  const facadeZones = getFacadeZoneLayout(experience.floors.length);

  experience.floors.forEach((floor, floorIndex) => {
    const facadeZone = facadeZones[floorIndex] || facadeZones[facadeZones.length - 1];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "elevation-floor";
    button.dataset.floorId = floor.id;
    const absoluteGeometry = getAbsoluteFloorGeometry(experience.project.id, floor.number);
    if (absoluteGeometry) {
      button.style.top = `${absoluteGeometry.topPct.toFixed(3)}%`;
      button.style.height = `${absoluteGeometry.heightPct.toFixed(3)}%`;
      button.style.left = `${absoluteGeometry.leftInsetPct.toFixed(3)}%`;
      button.style.right = `${absoluteGeometry.rightInsetPct.toFixed(3)}%`;
    } else {
      button.style.top = `${(facadeZone.top * 100).toFixed(3)}%`;
      button.style.height = `${(facadeZone.height * 100).toFixed(3)}%`;
      button.style.left = `${facadeZone.leftInset.toFixed(3)}%`;
      button.style.right = `${facadeZone.rightInset.toFixed(3)}%`;
    }
    const manualClip = getManualFloorClipPath(experience.project.id, floor.number);
    const clipPoints = absoluteGeometry?.clipPoints || manualClip || getFloorClipPath(facadeZone);
    button.style.setProperty("--floor-clip-path", toPolygonClipPath(clipPoints));
    button.innerHTML = `
      <strong>${floor.number}</strong>
      <span>${floor.label}</span>
    `;
    button.addEventListener("mouseenter", () => {
      hoveredFloorId = floor.id;
      syncExperienceFloorState();
    });
    button.addEventListener("mouseleave", () => {
      hoveredFloorId = selectedFloorId;
      syncExperienceFloorState();
    });
    button.addEventListener("click", () => {
      selectedFloorId = floor.id;
      hoveredFloorId = floor.id;
      syncExperienceFloorState();
    });
    stack.appendChild(button);
  });

  tower.appendChild(stack);
  attachFloorTraceTool(tower, image, experience);
  floorElevation.appendChild(tower);
  syncExperienceFloorState();
}

function attachFloorTraceTool(tower, image, experience) {
  const project = experience.project;
  if (project.objectKind === "land") {
    return;
  }

  floorTraceState.floorNumber = clampFloorNumber(floorTraceState.floorNumber, experience.floors.length);
  floorTraceState.pointsByFloor = floorTraceState.pointsByFloor || {};
  floorTraceState.closedByFloor = floorTraceState.closedByFloor || {};
  floorTraceState.pointsPct = [...(floorTraceState.pointsByFloor[floorTraceState.floorNumber] || [])];
  floorTraceState.isClosed = Boolean(floorTraceState.closedByFloor[floorTraceState.floorNumber]);

  const traceWrap = document.createElement("div");
  traceWrap.className = "floor-trace-tool";
  traceWrap.innerHTML = `
    <div class="floor-trace-toolbar">
      <button type="button" class="ghost-button floor-trace-toggle">Trace Floors</button>
      <button type="button" class="ghost-button floor-trace-prev">Prev</button>
      <strong class="floor-trace-floor">Floor ${floorTraceState.floorNumber}</strong>
      <button type="button" class="ghost-button floor-trace-next">Next</button>
      <button type="button" class="ghost-button floor-trace-undo">Undo</button>
      <button type="button" class="ghost-button floor-trace-clear">Clear</button>
      <button type="button" class="floor-trace-copy">Copy Floor Coords</button>
    </div>
    <p class="floor-trace-help">Enable trace, click points clockwise on the facade, then copy coords.</p>
  `;
  floorElevation.appendChild(traceWrap);

  const overlay = document.createElement("svg");
  overlay.className = "floor-trace-overlay";
  overlay.setAttribute("viewBox", "0 0 100 100");
  overlay.setAttribute("preserveAspectRatio", "none");
  tower.appendChild(overlay);
  const previewCanvas = document.createElement("canvas");
  previewCanvas.className = "floor-trace-preview-canvas";
  tower.appendChild(previewCanvas);

  const toggleButton = traceWrap.querySelector(".floor-trace-toggle");
  const prevButton = traceWrap.querySelector(".floor-trace-prev");
  const nextButton = traceWrap.querySelector(".floor-trace-next");
  const undoButton = traceWrap.querySelector(".floor-trace-undo");
  const clearButton = traceWrap.querySelector(".floor-trace-clear");
  const copyButton = traceWrap.querySelector(".floor-trace-copy");
  const floorLabel = traceWrap.querySelector(".floor-trace-floor");

  const setFloor = (floorNumber) => {
    saveCurrentFloorPoints();
    floorTraceState.floorNumber = clampFloorNumber(floorNumber, experience.floors.length);
    floorTraceState.pointsPct = [...(floorTraceState.pointsByFloor[floorTraceState.floorNumber] || [])];
    floorTraceState.isClosed = Boolean(floorTraceState.closedByFloor[floorTraceState.floorNumber]);
    floorTraceState.cursorPct = null;
    floorLabel.textContent = `Floor ${floorTraceState.floorNumber}`;
    renderTraceOverlay();
  };

  const saveCurrentFloorPoints = () => {
    floorTraceState.pointsByFloor[floorTraceState.floorNumber] = [...floorTraceState.pointsPct];
    floorTraceState.closedByFloor[floorTraceState.floorNumber] = floorTraceState.isClosed;
  };

  const renderTraceOverlay = () => {
    const drawPreviewCanvas = (imageRect, towerRect) => {
      const dpr = window.devicePixelRatio || 1;
      const canvasWidth = Math.max(Math.round(imageRect.width), 1);
      const canvasHeight = Math.max(Math.round(imageRect.height), 1);
      previewCanvas.width = Math.max(Math.round(canvasWidth * dpr), 1);
      previewCanvas.height = Math.max(Math.round(canvasHeight * dpr), 1);
      previewCanvas.style.left = `${imageRect.left - towerRect.left}px`;
      previewCanvas.style.top = `${imageRect.top - towerRect.top}px`;
      previewCanvas.style.width = `${canvasWidth}px`;
      previewCanvas.style.height = `${canvasHeight}px`;

      const context = previewCanvas.getContext("2d");
      if (!context) {
        return;
      }
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      context.scale(dpr, dpr);

      if (!floorTraceState.enabled) {
        return;
      }
      const pointsPx = floorTraceState.pointsPct.map(([x, y]) => [
        (x / 100) * canvasWidth,
        (y / 100) * canvasHeight,
      ]);

      if (pointsPx.length >= 2) {
        context.beginPath();
        context.moveTo(pointsPx[0][0], pointsPx[0][1]);
        for (let index = 1; index < pointsPx.length; index += 1) {
          context.lineTo(pointsPx[index][0], pointsPx[index][1]);
        }
        context.strokeStyle = "#ffd89c";
        context.lineWidth = 1;
        context.setLineDash([]);
        context.stroke();
      }

      if (floorTraceState.isClosed && pointsPx.length >= 3) {
        context.beginPath();
        context.moveTo(pointsPx[0][0], pointsPx[0][1]);
        for (let index = 1; index < pointsPx.length; index += 1) {
          context.lineTo(pointsPx[index][0], pointsPx[index][1]);
        }
        context.closePath();
        context.fillStyle = "rgba(240,200,132,0.22)";
        context.fill();
        context.strokeStyle = "rgba(255,242,220,0.96)";
        context.lineWidth = 0.8;
        context.stroke();
      }

      pointsPx.forEach(([x, y], index) => {
        context.beginPath();
        context.arc(x, y, index === 0 ? 3 : 2.1, 0, Math.PI * 2);
        context.fillStyle = index === 0 ? "#8ee7ff" : "#ffe0ab";
        context.fill();
        context.lineWidth = 0.8;
        context.strokeStyle = "rgba(22, 12, 2, 0.9)";
        context.stroke();
      });

      if (!floorTraceState.cursorPct) {
        return;
      }

      const cursorX = (floorTraceState.cursorPct[0] / 100) * canvasWidth;
      const cursorY = (floorTraceState.cursorPct[1] / 100) * canvasHeight;

      if (!floorTraceState.isClosed && pointsPx.length >= 1) {
        const last = pointsPx[pointsPx.length - 1];
        context.beginPath();
        context.moveTo(last[0], last[1]);
        context.lineTo(cursorX, cursorY);
        context.strokeStyle = "#8ee7ff";
        context.lineWidth = 1.1;
        context.setLineDash([5, 3]);
        context.stroke();
        context.setLineDash([]);
      }

      context.beginPath();
      context.arc(cursorX, cursorY, 2.2, 0, Math.PI * 2);
      context.fillStyle = "#8ee7ff";
      context.fill();
      context.lineWidth = 0.8;
      context.strokeStyle = "rgba(4, 20, 28, 0.95)";
      context.stroke();
    };

    const syncOverlayBounds = () => {
      const towerRect = tower.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();
      const left = imageRect.left - towerRect.left;
      const top = imageRect.top - towerRect.top;
      overlay.style.left = `${left}px`;
      overlay.style.top = `${top}px`;
      overlay.style.width = `${imageRect.width}px`;
      overlay.style.height = `${imageRect.height}px`;
      drawPreviewCanvas(imageRect, towerRect);
    };
    syncOverlayBounds();

    overlay.innerHTML = "";
    if (!floorTraceState.enabled) {
      return;
    }

    if (floorTraceState.cursorPct) {
      const cursorOnly = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      cursorOnly.setAttribute("cx", String(floorTraceState.cursorPct[0]));
      cursorOnly.setAttribute("cy", String(floorTraceState.cursorPct[1]));
      cursorOnly.setAttribute("r", "0.42");
      cursorOnly.setAttribute("fill", "#8ee7ff");
      cursorOnly.setAttribute("stroke", "rgba(4, 20, 28, 0.95)");
      cursorOnly.setAttribute("stroke-width", "0.14");
      overlay.appendChild(cursorOnly);
    }

    if (!floorTraceState.pointsPct.length) {
      return;
    }

    if (floorTraceState.pointsPct.length >= 2) {
      const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      polyline.setAttribute(
        "points",
        floorTraceState.pointsPct.map(([x, y]) => `${x},${y}`).join(" ")
      );
      polyline.setAttribute("fill", "none");
      polyline.setAttribute("stroke", "#ffd89c");
      polyline.setAttribute("stroke-width", "0.7");
      overlay.appendChild(polyline);
    }

    if (floorTraceState.pointsPct.length >= 3 && floorTraceState.isClosed) {
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      polygon.setAttribute(
        "points",
        floorTraceState.pointsPct.map(([x, y]) => `${x},${y}`).join(" ")
      );
      polygon.setAttribute("fill", "rgba(240,200,132,0.22)");
      polygon.setAttribute("stroke", "rgba(255,242,220,0.96)");
      polygon.setAttribute("stroke-width", "0.5");
      overlay.appendChild(polygon);

      // Closed edge after clicking back on the first point.
      const first = floorTraceState.pointsPct[0];
      const last = floorTraceState.pointsPct[floorTraceState.pointsPct.length - 1];
      const closingEdge = document.createElementNS("http://www.w3.org/2000/svg", "line");
      closingEdge.setAttribute("x1", String(last[0]));
      closingEdge.setAttribute("y1", String(last[1]));
      closingEdge.setAttribute("x2", String(first[0]));
      closingEdge.setAttribute("y2", String(first[1]));
      closingEdge.setAttribute("stroke", "rgba(255, 222, 169, 0.95)");
      closingEdge.setAttribute("stroke-width", "0.55");
      closingEdge.setAttribute("stroke-dasharray", "1.2 1");
      overlay.appendChild(closingEdge);
    }

    // Live preview edge from the last fixed point to cursor while tracing.
    if (!floorTraceState.isClosed && floorTraceState.cursorPct && floorTraceState.pointsPct.length >= 1) {
      const last = floorTraceState.pointsPct[floorTraceState.pointsPct.length - 1];
      const preview = document.createElementNS("http://www.w3.org/2000/svg", "line");
      preview.setAttribute("x1", String(last[0]));
      preview.setAttribute("y1", String(last[1]));
      preview.setAttribute("x2", String(floorTraceState.cursorPct[0]));
      preview.setAttribute("y2", String(floorTraceState.cursorPct[1]));
      preview.setAttribute("stroke", "#8ee7ff");
      preview.setAttribute("stroke-width", "0.55");
      preview.setAttribute("stroke-dasharray", "1.2 0.8");
      preview.setAttribute("opacity", "1");
      overlay.appendChild(preview);
      const cursor = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      cursor.setAttribute("cx", String(floorTraceState.cursorPct[0]));
      cursor.setAttribute("cy", String(floorTraceState.cursorPct[1]));
      cursor.setAttribute("r", "0.42");
      cursor.setAttribute("fill", "#8ee7ff");
      cursor.setAttribute("stroke", "rgba(4, 20, 28, 0.95)");
      cursor.setAttribute("stroke-width", "0.14");
      overlay.appendChild(cursor);
    }

    floorTraceState.pointsPct.forEach(([x, y], index) => {
      const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      point.setAttribute("cx", String(x));
      point.setAttribute("cy", String(y));
      point.setAttribute("r", index === 0 ? "1.05" : "0.78");
      point.setAttribute("fill", index === 0 ? "#8ee7ff" : "#ffe0ab");
      point.setAttribute("stroke", "rgba(22, 12, 2, 0.9)");
      point.setAttribute("stroke-width", "0.2");
      overlay.appendChild(point);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", String(x + 0.8));
      label.setAttribute("y", String(y - 0.8));
      label.setAttribute("fill", "#fff0d2");
      label.setAttribute("font-size", "2.2");
      label.setAttribute("font-weight", "700");
      label.textContent = String(index + 1);
      overlay.appendChild(label);
    });
  };

  const toggleTrace = () => {
    floorTraceState.enabled = !floorTraceState.enabled;
    floorTraceState.cursorPct = null;
    tower.classList.toggle("is-tracing", floorTraceState.enabled);
    stack.style.pointerEvents = floorTraceState.enabled ? "none" : "auto";
    toggleButton.textContent = floorTraceState.enabled ? "Tracing On" : "Trace Floors";
    renderTraceOverlay();
  };

  toggleButton.addEventListener("click", toggleTrace);
  prevButton.addEventListener("click", () => setFloor(floorTraceState.floorNumber - 1));
  nextButton.addEventListener("click", () => setFloor(floorTraceState.floorNumber + 1));
  undoButton.addEventListener("click", () => {
    floorTraceState.pointsPct.pop();
    floorTraceState.isClosed = false;
    renderTraceOverlay();
  });
  clearButton.addEventListener("click", () => {
    floorTraceState.pointsPct = [];
    floorTraceState.isClosed = false;
    renderTraceOverlay();
  });
  copyButton.addEventListener("click", async () => {
    saveCurrentFloorPoints();
    const coords = toAbsoluteFloorCoords(
      image,
      floorTraceState.pointsByFloor[floorTraceState.floorNumber] || [],
      floorTraceState.closedByFloor[floorTraceState.floorNumber]
    );
    const payload = {
      projectId: project.id,
      floor: floorTraceState.floorNumber,
      sourceWidth: image.naturalWidth || 0,
      sourceHeight: image.naturalHeight || 0,
      coords,
    };
    const text = JSON.stringify(payload, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      statusText.textContent = `Copied floor ${floorTraceState.floorNumber} coords to clipboard.`;
    } catch (_error) {
      console.log(text);
      statusText.textContent = "Clipboard blocked. Coordinates logged in console.";
    }
  });

  const updateCursorFromEvent = (event) => {
    if (!floorTraceState.enabled || floorTraceState.isClosed) {
      return;
    }
    const rect = image.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }
    const xPct = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    const yPct = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
    floorTraceState.cursorPct = [Number(xPct.toFixed(3)), Number(yPct.toFixed(3))];
    renderTraceOverlay();
  };

  const shouldCloseTraceCycle = (xPct, yPct, rect) => {
    if (floorTraceState.pointsPct.length < 3) {
      return false;
    }
    const first = floorTraceState.pointsPct[0];
    const dxPx = ((xPct - first[0]) / 100) * rect.width;
    const dyPx = ((yPct - first[1]) / 100) * rect.height;
    return Math.hypot(dxPx, dyPx) <= 16;
  };

  const addPointFromEvent = (event) => {
    if (!floorTraceState.enabled) {
      return;
    }
    event.preventDefault();
    const rect = image.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const xPct = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    const yPct = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
    if (shouldCloseTraceCycle(xPct, yPct, rect)) {
      floorTraceState.isClosed = true;
      floorTraceState.cursorPct = floorTraceState.pointsPct[0];
      statusText.textContent = `Tracing floor ${floorTraceState.floorNumber}: polygon closed with ${floorTraceState.pointsPct.length} points.`;
      saveCurrentFloorPoints();
      renderTraceOverlay();
      return;
    }

    if (floorTraceState.isClosed) {
      return;
    }

    floorTraceState.pointsPct.push([Number(xPct.toFixed(3)), Number(yPct.toFixed(3))]);
    floorTraceState.cursorPct = [Number(xPct.toFixed(3)), Number(yPct.toFixed(3))];
    statusText.textContent = `Tracing floor ${floorTraceState.floorNumber}: ${floorTraceState.pointsPct.length} point${floorTraceState.pointsPct.length === 1 ? "" : "s"}. Click the first point to close.`;
    renderTraceOverlay();
  };

  image.addEventListener("pointerdown", addPointFromEvent);
  tower.addEventListener("pointerdown", addPointFromEvent, true);

  image.addEventListener("pointermove", updateCursorFromEvent);
  tower.addEventListener("pointermove", updateCursorFromEvent, true);

  image.addEventListener("mouseleave", () => {
    floorTraceState.cursorPct = null;
    renderTraceOverlay();
  });

  setFloor(floorTraceState.floorNumber);
}

function clampFloorNumber(value, maxFloor) {
  return Math.min(Math.max(Number(value) || 1, 1), Math.max(maxFloor, 1));
}

function toAbsoluteFloorCoords(image, pointsPct, closeCycle = false) {
  const width = image.naturalWidth || 1;
  const height = image.naturalHeight || 1;
  const exportPoints =
    closeCycle && pointsPct.length >= 3 ? [...pointsPct, pointsPct[0]] : pointsPct;
  return exportPoints.flatMap(([xPct, yPct]) => [
    Number(((xPct / 100) * width).toFixed(0)),
    Number(((yPct / 100) * height).toFixed(0)),
  ]);
}

function syncExperienceFloorState() {
  const activeFloorId = hoveredFloorId || selectedFloorId;
  Array.from(floorElevation.querySelectorAll(".elevation-floor")).forEach((element) => {
    element.classList.toggle("is-active", element.dataset.floorId === activeFloorId);
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

  updateGlbVisibility();
  statusText.textContent = activeProject.modelSrc
    ? `${activeProject.name} is now in cinematic presentation view.`
    : `${activeProject.name} is now in focused site view.`;
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
  setGeoJsonSource("projects-close-objects", createCloseObjectCollection(visibleProjects));
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
      properties: { id: `${project.id}-point`, projectId: project.id },
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
        properties: { id: `${activeProject.id}-active-point`, projectId: activeProject.id },
        geometry: {
          type: "Point",
          coordinates: activeProject.center,
        },
      },
    ],
  };
}

function createCloseObjectCollection(projectItems) {
  return {
    type: "FeatureCollection",
    features: projectItems
      .filter((project) => project.objectKind === "land" || project.objectKind === "massing")
      .map((project) => ({
        type: "Feature",
        properties: {
          id: `${project.id}-close-object`,
          projectId: project.id,
          objectKind: project.objectKind,
          objectColor: project.objectColor,
          heightMeters: project.floorCount * project.floorHeight + project.roofHeight,
        },
        geometry: {
          type: "Polygon",
          coordinates: [project.footprint],
        },
      })),
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
  if (!project.modelSrc || !mapReady || !map || map.getZoom() < getModelRevealZoom(project)) {
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
