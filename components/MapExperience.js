"use client";

import { useEffect, useRef, useState } from "react";

const MODEL_LAYER_ID = "selected-project-model";
const MAX_EXTERIOR_MAP_ZOOM = 20;
const MANUAL_MODEL_ZOOM_THRESHOLD = 15.2;
const DISCOVER_OVERVIEW = {
  center: [20.15, 41.72],
  zoom: 7.2,
  pitch: 38,
  bearing: -8
};

function polygonCollection(projects) {
  return {
    type: "FeatureCollection",
    features: projects.map((project) => ({
      type: "Feature",
      properties: {
        id: project.id,
        name: project.name,
        accent: project.mapAccent,
        category: project.categoryLabel,
        height: project.massingHeight ?? 24
      },
      geometry: {
        type: "Polygon",
        coordinates: [project.footprint]
      }
    }))
  };
}

function pointCollection(projects) {
  return {
    type: "FeatureCollection",
    features: projects.map((project) => ({
      type: "Feature",
      properties: {
        id: project.id,
        name: project.name,
        category: project.categoryLabel
      },
      geometry: {
        type: "Point",
        coordinates: project.center
      }
    }))
  };
}

function mapStyle() {
  return {
    version: 8,
    sources: {
      "carto-dark": {
        type: "raster",
        tiles: ["https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    },
    layers: [
      {
        id: "carto-dark",
        type: "raster",
        source: "carto-dark"
      }
    ]
  };
}

function setPaintIfLayerExists(map, layerId, property, value) {
  if (!map.getLayer(layerId)) {
    return;
  }

  map.setPaintProperty(layerId, property, value);
}

function setFilterIfLayerExists(map, layerId, filter) {
  if (!map.getLayer(layerId)) {
    return;
  }

  map.setFilter(layerId, filter);
}

/** MapLibre paint: selected > panel hover > default */
function paintBySelection(selectedId, hoverId, selectedValue, hoverValue, defaultValue) {
  return [
    "case",
    ["==", ["get", "id"], selectedId],
    selectedValue,
    ["==", ["get", "id"], hoverId],
    hoverValue,
    defaultValue
  ];
}

function getSelectedMassingOpacity(hasModel) {
  return hasModel ? 0.22 : 0.58;
}

function getSelectedMassingHeight(project, hasModel) {
  if (!hasModel) {
    return ["get", "height"];
  }

  return project.mapModelBaseHeight ?? 0.01;
}

function getFootprintCentroid(project) {
  const footprint = project.footprint ?? [];
  if (!footprint.length) {
    return project.center;
  }

  const ring =
    footprint.length > 1 &&
    footprint[0][0] === footprint[footprint.length - 1][0] &&
    footprint[0][1] === footprint[footprint.length - 1][1]
      ? footprint.slice(0, -1)
      : footprint;

  const total = ring.reduce(
    (accumulator, [lng, lat]) => {
      accumulator.lng += lng;
      accumulator.lat += lat;
      return accumulator;
    },
    { lng: 0, lat: 0 }
  );

  return [total.lng / ring.length, total.lat / ring.length];
}

function getFocusView(project, hasModel) {
  return {
    center: hasModel ? getFootprintCentroid(project) : project.center,
    zoom: hasModel
      ? Math.min(
          project.mapModelZoom ?? Math.max(project.zoom + 2.1, 17.4),
          MAX_EXTERIOR_MAP_ZOOM
        )
      : Math.min(project.zoom, MAX_EXTERIOR_MAP_ZOOM),
    pitch: hasModel ? Math.max(project.pitch, 70) : project.pitch,
    bearing: project.bearing
  };
}

function focusOverview(map, maplibregl, projects) {
  if (!projects.length) {
    map.easeTo({
      ...DISCOVER_OVERVIEW,
      duration: 900,
      essential: true
    });
    return;
  }

  const bounds = new maplibregl.LngLatBounds();

  projects.forEach((project) => {
    bounds.extend(project.center);
    (project.footprint ?? []).forEach((coordinate) => bounds.extend(coordinate));
  });

  const camera = map.cameraForBounds(bounds, {
    padding: { top: 132, right: 132, bottom: 120, left: 132 },
    maxZoom: 8.8
  });

  map.easeTo({
    center: camera.center,
    zoom: camera.zoom,
    pitch: DISCOVER_OVERVIEW.pitch,
    bearing: DISCOVER_OVERVIEW.bearing,
    duration: 900,
    essential: true
  });
}

function getModelTransform(maplibregl, project) {
  const [lng, lat] = getFootprintCentroid(project);
  const coordinate = maplibregl.MercatorCoordinate.fromLngLat(
    { lng, lat },
    project.mapModelElevation ?? 0
  );

  return {
    translateX: coordinate.x,
    translateY: coordinate.y,
    translateZ: coordinate.z,
    rotateX: Math.PI / 2,
    rotateY: 0,
    rotateZ: ((project.mapModelRotation ?? 0) * Math.PI) / 180,
    scale: coordinate.meterInMercatorCoordinateUnits()
  };
}

function getFootprintDimensions(project) {
  const footprint = project.footprint ?? [];
  if (!footprint.length) {
    return { width: 0, depth: 0 };
  }

  const [centerLng, centerLat] = project.center;
  const latFactor = 111320;
  const lngFactor = Math.cos((centerLat * Math.PI) / 180) * 111320;

  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  footprint.forEach(([lng, lat]) => {
    const x = (lng - centerLng) * lngFactor;
    const z = (lat - centerLat) * latFactor;

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minZ = Math.min(minZ, z);
    maxZ = Math.max(maxZ, z);
  });

  return {
    width: Math.max(maxX - minX, 0),
    depth: Math.max(maxZ - minZ, 0)
  };
}

function getClosestProject(projects, center) {
  if (!projects.length || !center) {
    return null;
  }

  return projects.reduce((closestProject, project) => {
    if (!closestProject) {
      return project;
    }

    const [centerLng, centerLat] = center;
    const [projectLng, projectLat] = project.center;
    const [closestLng, closestLat] = closestProject.center;
    const projectDistance =
      (projectLng - centerLng) ** 2 + (projectLat - centerLat) ** 2;
    const closestDistance =
      (closestLng - centerLng) ** 2 + (closestLat - centerLat) ** 2;

    return projectDistance < closestDistance ? project : closestProject;
  }, null);
}

export default function MapExperience({
  assetLibrary,
  projects,
  selectedProject,
  selectedAsset,
  onSelectProject,
  searchQuery,
  viewMode,
  focusRequest,
  resultCount,
  panelHoveredProjectId = null
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const modelCacheRef = useRef(new Map());
  const modelLayerRef = useRef(null);
  const modelGroupRef = useRef(null);
  const modelTransformRef = useRef(null);
  const threeStateRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(DISCOVER_OVERVIEW.zoom);
  const [currentCenter, setCurrentCenter] = useState(DISCOVER_OVERVIEW.center);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const inferredMapProject =
    currentZoom >= MANUAL_MODEL_ZOOM_THRESHOLD
      ? getClosestProject(projects, currentCenter)
      : null;
  const activeMapProject = selectedProject
    ? projects.find((project) => project.id === selectedProject.id) ?? selectedProject
    : inferredMapProject;
  const selectedProjectId = activeMapProject?.id ?? "__none__";
  const hoverMarkerId = panelHoveredProjectId ?? "__none__";
  const activeMapAsset =
    selectedProject && selectedAsset
      ? selectedAsset
      : activeMapProject
        ? assetLibrary.find((asset) => asset.id === activeMapProject.primaryAssetId) ??
          null
        : null;
  const isMapLedDeck = viewMode === "discover" || viewMode === "browse";
  const showSelectedModel =
    Boolean(activeMapAsset?.src) &&
    Boolean(activeMapProject) &&
    (!isMapLedDeck || currentZoom >= MANUAL_MODEL_ZOOM_THRESHOLD);
  const landResultCount = projects.filter(
    (project) => project.propertyType === "land"
  ).length;
  const buildingResultCount = projects.length - landResultCount;

  useEffect(() => {
    let disposed = false;

    async function setup() {
      const maplibregl = (await import("maplibre-gl")).default;
      const THREE = await import("three");
      const { GLTFLoader } = await import(
        "three/examples/jsm/loaders/GLTFLoader.js"
      );
      if (!containerRef.current || disposed || mapRef.current) {
        return;
      }

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: mapStyle(),
        center: [20.15, 41.72],
        zoom: 7.2,
        maxZoom: MAX_EXTERIOR_MAP_ZOOM,
        pitch: 46,
        bearing: -8,
        antialias: true
      });

      mapRef.current = map;
      popupRef.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 18
      });
      threeStateRef.current = {
        GLTFLoader,
        THREE,
        map,
        maplibregl
      };

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }));

      map.on("load", () => {
        const syncViewportState = () => {
          setCurrentZoom(map.getZoom());
          const mapCenter = map.getCenter();
          setCurrentCenter([mapCenter.lng, mapCenter.lat]);
        };

        map.addSource("projects", {
          type: "geojson",
          data: polygonCollection(projects)
        });

        map.addSource("markers", {
          type: "geojson",
          data: pointCollection(projects)
        });

        map.addLayer({
          id: "project-footprints",
          type: "fill",
          source: "projects",
          paint: {
            "fill-color": [
              "case",
              ["==", ["get", "id"], selectedProjectId],
              "#d6b47b",
              "#27455a"
            ],
            "fill-opacity": 0.44
          }
        });

        map.addLayer({
          id: "project-massing-base",
          type: "fill-extrusion",
          source: "projects",
          filter: ["!=", ["get", "id"], selectedProjectId],
          paint: {
            "fill-extrusion-color": "#4d7a97",
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 0.42
          }
        });

        map.addLayer({
          id: "project-massing-selected",
          type: "fill-extrusion",
          source: "projects",
          filter: ["==", ["get", "id"], selectedProjectId],
          paint: {
            "fill-extrusion-color": "#f1d3a1",
            "fill-extrusion-height": getSelectedMassingHeight(
              activeMapProject ?? projects[0],
              showSelectedModel
            ),
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": getSelectedMassingOpacity(showSelectedModel)
          }
        });

        map.addLayer({
          id: "project-footprints-outline",
          type: "line",
          source: "projects",
          paint: {
            "line-color": [
              "case",
              ["==", ["get", "id"], selectedProjectId],
              "#f3d39c",
              "#7ab9db"
            ],
            "line-width": [
              "case",
              ["==", ["get", "id"], selectedProjectId],
              3,
              1.25
            ],
            "line-opacity": 0.95
          }
        });

        map.addLayer({
          id: "project-marker-glow",
          type: "circle",
          source: "markers",
          paint: {
            "circle-radius": [
              "case",
              ["==", ["get", "id"], selectedProjectId],
              18,
              12
            ],
            "circle-color": [
              "case",
              ["==", ["get", "id"], selectedProjectId],
              "#f3d39c",
              "#67b2df"
            ],
            "circle-blur": 0.7,
            "circle-opacity": 0.48
          }
        });

        const customLayer = {
          id: MODEL_LAYER_ID,
          type: "custom",
          renderingMode: "3d",
          onAdd(mapInstance, gl) {
            this.camera = new THREE.Camera();
            this.scene = new THREE.Scene();

            const ambientLight = new THREE.AmbientLight(0xffffff, 1.7);
            const keyLight = new THREE.DirectionalLight(0xf6e3bf, 1.8);
            keyLight.position.set(120, -90, 180);
            const fillLight = new THREE.DirectionalLight(0x7ab9db, 0.85);
            fillLight.position.set(-140, 80, 120);

            this.scene.add(ambientLight, keyLight, fillLight);

            this.renderer = new THREE.WebGLRenderer({
              antialias: true,
              canvas: map.getCanvas(),
              context: gl
            });
            this.renderer.autoClear = false;

            if ("outputColorSpace" in this.renderer) {
              this.renderer.outputColorSpace = THREE.SRGBColorSpace;
            }

            modelLayerRef.current = this;
          },
          render(gl, matrix) {
            const transform = modelTransformRef.current;

            this.renderer.resetState();

            if (!transform || !modelGroupRef.current) {
              return;
            }

            const rotationX = new THREE.Matrix4().makeRotationAxis(
              new THREE.Vector3(1, 0, 0),
              transform.rotateX
            );
            const rotationY = new THREE.Matrix4().makeRotationAxis(
              new THREE.Vector3(0, 1, 0),
              transform.rotateY
            );
            const rotationZ = new THREE.Matrix4().makeRotationAxis(
              new THREE.Vector3(0, 0, 1),
              transform.rotateZ
            );

            const viewMatrix = new THREE.Matrix4().fromArray(matrix);
            const modelMatrix = new THREE.Matrix4()
              .makeTranslation(
                transform.translateX,
                transform.translateY,
                transform.translateZ
              )
              .scale(
                new THREE.Vector3(
                  transform.scale,
                  -transform.scale,
                  transform.scale
                )
              )
              .multiply(rotationX)
              .multiply(rotationY)
              .multiply(rotationZ);

            this.camera.projectionMatrix = viewMatrix.multiply(modelMatrix);
            this.renderer.render(this.scene, this.camera);
            map.triggerRepaint();
          }
        };

        map.addLayer(customLayer, "project-marker-glow");

        map.addLayer({
          id: "project-markers",
          type: "circle",
          source: "markers",
          paint: {
            "circle-radius": [
              "case",
              ["==", ["get", "id"], selectedProjectId],
              8,
              5
            ],
            "circle-color": [
              "case",
              ["==", ["get", "id"], selectedProjectId],
              "#fff1cf",
              "#8dd3ff"
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#081018",
            "circle-opacity": 0.95
          }
        });

        const handleSelect = (event) => {
          const id = event.features?.[0]?.properties?.id;
          if (id) {
            onSelectProject(id);
          }
        };

        const handleEnter = (event) => {
          map.getCanvas().style.cursor = "pointer";
          const feature = event.features?.[0];
          if (!feature || !popupRef.current) {
            return;
          }

          popupRef.current
            .setLngLat(event.lngLat)
            .setHTML(
              `<div class="map-popup"><strong>${feature.properties.name}</strong><span>${feature.properties.category}</span></div>`
            )
            .addTo(map);
        };

        const handleLeave = () => {
          map.getCanvas().style.cursor = "";
          popupRef.current?.remove();
        };

        [
          "project-markers",
          "project-marker-glow",
          "project-massing-base",
          "project-massing-selected"
        ].forEach(
          (layerId) => {
            map.on("click", layerId, handleSelect);
            map.on("mouseenter", layerId, handleEnter);
            map.on("mouseleave", layerId, handleLeave);
          }
        );

        map.on("moveend", syncViewportState);
        map.on("zoomend", syncViewportState);
        syncViewportState();
        setReady(true);
      });
    }

    setup();

    return () => {
      disposed = true;
      setReady(false);
      modelGroupRef.current = null;
      modelTransformRef.current = null;
      modelLayerRef.current = null;
      threeStateRef.current = null;
      popupRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [onSelectProject]);

  useEffect(() => {
    if (viewMode === "platform") {
      setIsSummaryVisible(true);
      return;
    }

    if (viewMode === "browse") {
      setIsSummaryVisible(false);
      return;
    }

    if (!searchQuery.trim()) {
      setIsSummaryVisible(false);
      return;
    }

    setIsSummaryVisible(false);
    const timeoutId = window.setTimeout(() => {
      setIsSummaryVisible(true);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery, viewMode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) {
      return;
    }

    map.getSource("projects")?.setData(polygonCollection(projects));
    map.getSource("markers")?.setData(pointCollection(projects));

    setPaintIfLayerExists(map, "project-footprints", "fill-color", [
      "case",
      ["==", ["get", "id"], selectedProjectId],
      "#d6b47b",
      "#27455a"
    ]);
    setPaintIfLayerExists(map, "project-footprints-outline", "line-color", [
      "case",
      ["==", ["get", "id"], selectedProjectId],
      "#f3d39c",
      "#7ab9db"
    ]);
    setPaintIfLayerExists(map, "project-footprints-outline", "line-width", [
      "case",
      ["==", ["get", "id"], selectedProjectId],
      3,
      1.25
    ]);
    setFilterIfLayerExists(map, "project-massing-base", [
      "!=",
      ["get", "id"],
      selectedProjectId
    ]);
    setFilterIfLayerExists(map, "project-massing-selected", [
      "==",
      ["get", "id"],
      selectedProjectId
    ]);
    if (activeMapProject) {
      setPaintIfLayerExists(
        map,
        "project-massing-selected",
        "fill-extrusion-height",
        getSelectedMassingHeight(activeMapProject, showSelectedModel)
      );
    }
    setPaintIfLayerExists(
      map,
      "project-massing-selected",
      "fill-extrusion-opacity",
      getSelectedMassingOpacity(showSelectedModel)
    );
    setPaintIfLayerExists(
      map,
      "project-marker-glow",
      "circle-radius",
      paintBySelection(selectedProjectId, hoverMarkerId, 18, 16, 12)
    );
    setPaintIfLayerExists(
      map,
      "project-marker-glow",
      "circle-color",
      paintBySelection(selectedProjectId, hoverMarkerId, "#f3d39c", "#e8c45c", "#67b2df")
    );
    setPaintIfLayerExists(
      map,
      "project-markers",
      "circle-radius",
      paintBySelection(selectedProjectId, hoverMarkerId, 8, 7, 5)
    );
    setPaintIfLayerExists(
      map,
      "project-markers",
      "circle-color",
      paintBySelection(
        selectedProjectId,
        hoverMarkerId,
        "#fff1cf",
        "#ffe14a",
        "#8dd3ff"
      )
    );
  }, [
    activeMapProject,
    hoverMarkerId,
    projects,
    ready,
    selectedProjectId,
    showSelectedModel
  ]);

  useEffect(() => {
    const map = mapRef.current;
    const threeState = threeStateRef.current;
    if (!map || !ready || !threeState) {
      return;
    }

    if (viewMode !== "discover" && viewMode !== "browse") {
      return;
    }

    focusOverview(map, threeState.maplibregl, projects);
  }, [projects, ready, viewMode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !activeMapProject || !focusRequest) {
      return;
    }

    const shouldZoomForModel = Boolean(activeMapAsset?.src);
    const focusView = getFocusView(activeMapProject, shouldZoomForModel);

    map.flyTo({
      center: focusView.center,
      zoom: focusView.zoom,
      pitch: focusView.pitch,
      bearing: focusView.bearing,
      speed: 0.7,
      curve: 1.15,
      essential: true
    });
  }, [activeMapAsset?.src, activeMapProject, focusRequest, ready]);

  useEffect(() => {
    let cancelled = false;

    async function syncSelectedModel() {
      const modelLayer = modelLayerRef.current;
      const threeState = threeStateRef.current;
      if (!ready || !modelLayer || !threeState) {
        return;
      }

      const { GLTFLoader, THREE, map, maplibregl } = threeState;
      const scene = modelLayer.scene;

      if (modelGroupRef.current) {
        scene.remove(modelGroupRef.current);
        modelGroupRef.current = null;
      }
      modelTransformRef.current = null;

      if (!showSelectedModel || !activeMapAsset?.src || !activeMapProject) {
        map.triggerRepaint();
        return;
      }

      try {
        let cachedModel = modelCacheRef.current.get(activeMapAsset.src);
        if (!cachedModel) {
          const loader = new GLTFLoader();
          cachedModel = loader.loadAsync(activeMapAsset.src).then((gltf) => gltf.scene);
          modelCacheRef.current.set(activeMapAsset.src, cachedModel);
        }

        const baseScene = await cachedModel;
        if (cancelled || !baseScene) {
          return;
        }

        const modelScene = baseScene.clone(true);
        modelScene.traverse((node) => {
          if (!node.isMesh) {
            return;
          }

          node.castShadow = true;
          node.receiveShadow = true;

          if (Array.isArray(node.material)) {
            node.material = node.material.map((material) => {
              const clonedMaterial = material.clone();
              clonedMaterial.side = THREE.DoubleSide;
              clonedMaterial.needsUpdate = true;
              return clonedMaterial;
            });
            return;
          }

          if (node.material) {
            node.material = node.material.clone();
            node.material.side = THREE.DoubleSide;
            node.material.needsUpdate = true;
          }
        });

        const initialBox = new THREE.Box3().setFromObject(modelScene);
        const initialSize = initialBox.getSize(new THREE.Vector3());
        const targetHeight = Math.max(activeMapProject.massingHeight ?? 24, 12);
        const { width, depth } = getFootprintDimensions(activeMapProject);
        const footprintFill = activeMapProject.mapModelFootprintFill ?? 0.78;
        const targetWidth = Math.max(width * footprintFill, 12);
        const targetDepth = Math.max(depth * footprintFill, 12);
        const heightScale = targetHeight / Math.max(initialSize.y, 0.001);
        const widthScale = targetWidth / Math.max(initialSize.x, 0.001);
        const depthScale = targetDepth / Math.max(initialSize.z, 0.001);
        const footprintScale = Math.min(widthScale, depthScale);
        const maxHeightScale =
          heightScale * (activeMapProject.mapModelMaxHeightFactor ?? 1.8);
        const scaleFactor =
          Math.min(footprintScale, maxHeightScale) *
          (activeMapProject.mapModelScale ?? 1);

        modelScene.scale.setScalar(scaleFactor);

        const scaledBox = new THREE.Box3().setFromObject(modelScene);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
        modelScene.position.set(
          -scaledCenter.x,
          -scaledBox.min.y,
          -scaledCenter.z
        );

        const modelGroup = new THREE.Group();
        modelGroup.add(modelScene);

        if (cancelled) {
          return;
        }

        scene.add(modelGroup);
        modelGroupRef.current = modelGroup;
        modelTransformRef.current = getModelTransform(maplibregl, activeMapProject);
        map.triggerRepaint();
      } catch (error) {
        console.error("Failed to place 3D model on map", error);
      }
    }

    syncSelectedModel();

    return () => {
      cancelled = true;
    };
  }, [activeMapAsset?.src, activeMapProject, ready, showSelectedModel]);

  return (
    <div className="map-frame">
      {isSummaryVisible ? (
        <div className="map-summary-card">
          <p className="section-label">Market View</p>
          <h2>
            {viewMode === "discover"
              ? "Search Results Overview"
              : activeMapProject?.name ?? "No Property Selected"}
          </h2>
          <p>
            {viewMode === "discover"
              ? "The map stays zoomed out while you search. Click a property card or a map marker to focus a specific opportunity."
              : activeMapProject?.stageSummary ??
                "Select a property from Discover to move the map and open its memo."}
          </p>
          <div className="map-summary-kpis">
            <div>
              <span className="stat-label">
                {viewMode === "discover" ? "Results" : "Access"}
              </span>
              <strong>
                {viewMode === "discover"
                  ? resultCount
                  : activeMapProject?.access ?? "None"}
              </strong>
            </div>
            <div>
              <span className="stat-label">
                {viewMode === "discover" ? "Buildings" : "Stage"}
              </span>
              <strong>
                {viewMode === "discover"
                  ? buildingResultCount
                  : activeMapProject?.program ?? "--"}
              </strong>
            </div>
            <div>
              <span className="stat-label">
                {viewMode === "discover" ? "Land" : "Return"}
              </span>
              <strong>
                {viewMode === "discover"
                  ? landResultCount
                  : activeMapProject?.roi ?? "--"}
              </strong>
            </div>
          </div>
        </div>
      ) : null}

      <div ref={containerRef} className="map-canvas" />
    </div>
  );
}
