const projectList = document.getElementById("project-list");
const projectCount = document.getElementById("project-count");
const projectDetail = document.getElementById("project-detail");
const emptyState = document.getElementById("empty-state");
const focusButton = document.getElementById("focus-building");
const resetButton = document.getElementById("reset-view");
const statusText = document.getElementById("status-text");
const projectTitle = document.getElementById("project-title");
const projectMeta = document.getElementById("project-meta");

const DEBUG = true;
const CAN_FETCH_LOCAL_ASSET = window.location.protocol !== "file:";

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
    pitchFocus: 60,
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
    modelSrc: "./assets/louisiana_state_house.glb",
  },
  {
    id: "vista-garden",
    name: "Vista Garden Tirana",
    district: "Komuna e Parisit",
    summary: "10 floors with a wider residential podium footprint.",
    center: [19.80592, 41.31887],
    bearing: 12,
    zoomOverview: 15.9,
    zoomFocus: 17.8,
    pitchOverview: 48,
    pitchFocus: 60,
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
    modelSrc: "./assets/le_millefiori.glb",
  },
  {
    id: "lakeview-point",
    name: "Lakeview Point",
    district: "Artificial Lake Edge",
    summary: "12 floors aimed at premium units with stronger skyline presence.",
    center: [19.82098, 41.31267],
    bearing: -38,
    zoomOverview: 15.75,
    zoomFocus: 17,
    pitchOverview: 50,
    pitchFocus: 60,
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
    modelSrc: "./assets/singer_building.glb",
  },
  {
    id: "duck-showcase",
    name: "Duck Showcase",
    district: "Prototype Asset Demo",
    summary: "Non-building test model to validate diverse GLB import behavior.",
    center: [19.81335, 41.32332],
    bearing: -12,
    zoomOverview: 15.95,
    zoomFocus: 17.9,
    pitchOverview: 48,
    pitchFocus: 60,
    footprint: [
      [19.8132, 41.3232],
      [19.81349, 41.32319],
      [19.81351, 41.32343],
      [19.81324, 41.32344],
      [19.8132, 41.3232],
    ],
    floorCount: 9,
    floorHeight: 3.1,
    roofHeight: 2.2,
    modelSrc: "./assets/duck.glb",
  },
  {
    id: "avocado-studio",
    name: "Avocado Studio",
    district: "Prototype Asset Demo",
    summary: "Organic mesh sample used to test scaling and scene lighting.",
    center: [19.80958, 41.32054],
    bearing: 18,
    zoomOverview: 16.05,
    zoomFocus: 18.05,
    pitchOverview: 49,
    pitchFocus: 60,
    footprint: [
      [19.80943, 41.32045],
      [19.80971, 41.32044],
      [19.80974, 41.32064],
      [19.80946, 41.32065],
      [19.80943, 41.32045],
    ],
    floorCount: 11,
    floorHeight: 3.2,
    roofHeight: 2.4,
    modelSrc: "./assets/avocado.glb",
  },
  {
    id: "boombox-hub",
    name: "BoomBox Hub",
    district: "Prototype Asset Demo",
    summary: "Hard-surface sample asset for materials and edge definition checks.",
    center: [19.81713, 41.31686],
    bearing: -30,
    zoomOverview: 15.9,
    zoomFocus: 17.85,
    pitchOverview: 48,
    pitchFocus: 60,
    footprint: [
      [19.81698, 41.31677],
      [19.81726, 41.31677],
      [19.81729, 41.31696],
      [19.81701, 41.31698],
      [19.81698, 41.31677],
    ],
    floorCount: 10,
    floorHeight: 3.1,
    roofHeight: 2.3,
    modelSrc: "./assets/boombox.glb",
  },
  {
    id: "lantern-reserve",
    name: "Lantern Reserve",
    district: "Prototype Asset Demo",
    summary: "Complex metallic/glass sample used as a stress test for the scene.",
    center: [19.82291, 41.31945],
    bearing: 8,
    zoomOverview: 15.9,
    zoomFocus: 17.75,
    pitchOverview: 48,
    pitchFocus: 60,
    footprint: [
      [19.82275, 41.31935],
      [19.82303, 41.31935],
      [19.82306, 41.31956],
      [19.82278, 41.31958],
      [19.82275, 41.31935],
    ],
    floorCount: 12,
    floorHeight: 3.2,
    roofHeight: 2.5,
    modelSrc: "./assets/lantern.glb",
  },
];

let map;
let mapReady = false;
let activeProject = null;
let glbState = null;
let glbInitPromise = null;

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

  debugLog("runtime", {
    protocol: window.location.protocol,
    canFetchLocalAsset: CAN_FETCH_LOCAL_ASSET,
  });

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
      layers: [{ id: "carto-light", type: "raster", source: "carto-light" }],
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

    map.addSource("projects-overview", {
      type: "geojson",
      data: createProjectsOverviewCollection(),
    });
    map.addLayer({
      id: "projects-overview-fill",
      type: "fill-extrusion",
      source: "projects-overview",
      paint: {
        "fill-extrusion-color": "#d8a35c",
        "fill-extrusion-height": ["get", "heightMeters"],
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": 0.68,
      },
    });

    map.addSource("project-parcel", {
      type: "geojson",
      data: emptyFeatureCollection(),
    });
    map.addLayer({
      id: "project-parcel-fill",
      type: "fill",
      source: "project-parcel",
      paint: {
        "fill-color": "#d88a2d",
        "fill-opacity": 0.25,
      },
    });
    map.addLayer({
      id: "project-parcel-line",
      type: "line",
      source: "project-parcel",
      paint: {
        "line-color": "#8e4f05",
        "line-width": 3,
      },
    });

    if (!CAN_FETCH_LOCAL_ASSET) {
      debugLog("glb init skipped (file protocol)");
      statusText.textContent =
        "Open this app through http://localhost (example: python3 -m http.server 8000) to load the GLB model.";
      return;
    }

    statusText.textContent =
      "All projects are visible on the map. Select a card to load its GLB model.";
  });

  focusButton.addEventListener("click", () => focusProject(true));
  resetButton.addEventListener("click", resetProjectView);
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

function selectProject(projectId) {
  const project = projects.find((item) => item.id === projectId);
  if (!project || !mapReady) {
    return;
  }

  activeProject = project;
  updateProjectCards();
  setGeoJsonSource("project-parcel", createProjectParcel(project));
  if (CAN_FETCH_LOCAL_ASSET) {
    setActiveGlbModel(project.modelSrc).catch((error) => {
      console.error(error);
      debugLog("glb switch failed", String(error));
    });
  }
  updateGlbVisibility();

  emptyState.hidden = true;
  projectDetail.hidden = false;
  projectTitle.textContent = project.name;
  projectMeta.textContent = `${project.floorCount} floors on ${project.district}`;

  map.fitBounds(projectBounds(project), {
    padding: { top: 80, right: 80, bottom: 80, left: 420 },
    duration: 900,
    pitch: project.pitchOverview,
    bearing: project.bearing,
    essential: true,
    maxZoom: project.zoomOverview,
  });

  statusText.textContent = "Project selected. Moving to parcel, then focusing.";

  map.once("moveend", () => {
    if (!activeProject || activeProject.id !== project.id) {
      return;
    }
    focusProject(true);
  });
}

function focusProject(withAnimation) {
  if (!mapReady || !activeProject) {
    return;
  }

  map.easeTo({
    center: activeProject.center,
    zoom: activeProject.zoomFocus + 0.15,
    pitch: 76,
    bearing: activeProject.bearing + 18,
    offset: [220, 120],
    duration: withAnimation ? 1200 : 0,
    essential: true,
  });

  if (CAN_FETCH_LOCAL_ASSET) {
    updateGlbVisibility();
    statusText.textContent = "Project focused. GLB is now the building on map.";
  } else {
    statusText.textContent =
      "GLB blocked on file://. Run local server: python3 -m http.server 8000";
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
    offset: [99, 0],
    duration: 900,
    essential: true,
  });
  statusText.textContent = "Overview restored.";
}

function updateProjectCards() {
  Array.from(projectList.children).forEach((card) => {
    card.classList.toggle("active", card.dataset.projectId === activeProject?.id);
  });
}

function setGeoJsonSource(sourceId, data) {
  const source = map.getSource(sourceId);
  if (source) {
    source.setData(data);
  }
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

function createProjectsOverviewCollection() {
  return {
    type: "FeatureCollection",
    features: projects.map((project) => ({
      type: "Feature",
      properties: {
        id: `${project.id}-overview`,
        heightMeters: project.floorCount * project.floorHeight + project.roofHeight,
      },
      geometry: {
        type: "Polygon",
        coordinates: [project.footprint],
      },
    })),
  };
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
  glbState.visible = Boolean(activeProject);
  debugLog("glb visibility", glbState.visible);
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

    glbState = {
      THREE_NS,
      visible: false,
      ready: false,
      scene: null,
      camera: null,
      renderer: null,
      loader: null,
      model: null,
      modelHeight: 1,
      currentSrc: "",
      modelCache: new Map(),
    };

    const customLayer = {
      id: "project-glb-model",
      type: "custom",
      renderingMode: "3d",
      onAdd() {
        const { THREE_NS: THREE } = glbState;
        glbState.camera = new THREE.Camera();
        glbState.scene = new THREE.Scene();

        const ambient = new THREE.AmbientLight(0xffffff, 1.35);
        glbState.scene.add(ambient);

        const hemi = new THREE.HemisphereLight(0xfff3db, 0xdde7ff, 0.85);
        glbState.scene.add(hemi);

        const lightA = new THREE.DirectionalLight(0xffffff, 1.45);
        lightA.position.set(110, 150, 110);
        glbState.scene.add(lightA);
        const lightB = new THREE.DirectionalLight(0xfff7ec, 1.0);
        lightB.position.set(-95, 120, -80);
        glbState.scene.add(lightB);

        glbState.renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: map.painter.context.gl,
          antialias: true,
        });
        glbState.renderer.autoClear = false;
        glbState.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        glbState.renderer.toneMappingExposure = 1.35;

        glbState.loader = new GLTFLoader();
      },
      render(_gl, matrix) {
        if (!glbState || !glbState.ready || !glbState.visible || !activeProject) {
          return;
        }

        const { THREE_NS: THREE } = glbState;
        const mercator = maplibregl.MercatorCoordinate.fromLngLat(activeProject.center, 0);
        const desiredHeightMeters =
          activeProject.floorCount * activeProject.floorHeight + activeProject.roofHeight;
        const modelScaleMeters = desiredHeightMeters / glbState.modelHeight;
        const scale = mercator.meterInMercatorCoordinateUnits() * modelScaleMeters;

        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4()
          .makeTranslation(mercator.x, mercator.y, mercator.z)
          .scale(new THREE.Vector3(scale, -scale, scale));

        glbState.camera.projectionMatrix = m.multiply(l);
        glbState.renderer.resetState();
        glbState.renderer.render(glbState.scene, glbState.camera);
        map.triggerRepaint();
      },
    };

    map.addLayer(customLayer);
  })();

  return glbInitPromise;
}

async function setActiveGlbModel(src) {
  if (!src) {
    return;
  }

  await initGlbLayer();
  if (!glbState || !glbState.scene || !glbState.loader) {
    return;
  }

  if (glbState.currentSrc === src && glbState.model) {
    return;
  }

  const { THREE_NS: THREE } = glbState;
  let template = glbState.modelCache.get(src);
  if (!template) {
    const gltf = await glbState.loader.loadAsync(src);
    template = gltf.scene;
    glbState.modelCache.set(src, template);
    debugLog("glb loaded", { src });
  }

  if (glbState.model) {
    glbState.scene.remove(glbState.model);
  }

  const instance = template.clone(true);
  instance.rotation.x = Math.PI / 2;
  glbState.scene.add(instance);
  glbState.model = instance;
  glbState.currentSrc = src;

  const box = new THREE.Box3().setFromObject(instance);
  const size = box.getSize(new THREE.Vector3());
  glbState.modelHeight = Math.max(size.y, 1);
  glbState.ready = true;
  debugLog("glb active", { src, modelHeight: glbState.modelHeight });
}
