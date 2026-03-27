"use client";

import { useEffect, useRef, useState } from "react";

const MODEL_LAYER_ID = "project-models";
const MAX_EXTERIOR_MAP_ZOOM = 20;
const DISCOVER_OVERVIEW = {
  center: [20.15, 41.72],
  zoom: 7.2,
  pitch: 38,
  bearing: -8
};

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

function createProjectModelGroup(THREE, maplibregl, project, baseScene) {
  const modelScene = baseScene.clone(true);
  modelScene.traverse((node) => {
    if (!node.isMesh) {
      return;
    }

    node.frustumCulled = false;
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
  const targetHeight = Math.max(project.massingHeight ?? 24, 12);
  const { width, depth } = getFootprintDimensions(project);
  const footprintFill = project.mapModelFootprintFill ?? 0.78;
  const targetWidth = Math.max(width * footprintFill, 12);
  const targetDepth = Math.max(depth * footprintFill, 12);
  const heightScale = targetHeight / Math.max(initialSize.y, 0.001);
  const widthScale = targetWidth / Math.max(initialSize.x, 0.001);
  const depthScale = targetDepth / Math.max(initialSize.z, 0.001);
  const footprintScale = Math.min(widthScale, depthScale);
  const maxHeightScale = heightScale * (project.mapModelMaxHeightFactor ?? 1.8);
  const scaleFactor = Math.min(footprintScale, maxHeightScale) * (project.mapModelScale ?? 1);

  modelScene.scale.setScalar(scaleFactor);

  const scaledBox = new THREE.Box3().setFromObject(modelScene);
  const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
  modelScene.position.set(-scaledCenter.x, -scaledBox.min.y, -scaledCenter.z);

  const modelGroup = new THREE.Group();
  modelGroup.add(modelScene);

  return modelGroup;
}

function getModelMatrix(THREE, transform) {
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

  return new THREE.Matrix4()
    .makeTranslation(transform.translateX, transform.translateY, transform.translateZ)
    .scale(new THREE.Vector3(transform.scale, -transform.scale, transform.scale))
    .multiply(rotationX)
    .multiply(rotationY)
    .multiply(rotationZ);
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
  panelVisible = true,
  resultCount,
  panelHoveredProjectId = null
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const modelCacheRef = useRef(new Map());
  const modelLayerRef = useRef(null);
  const modelEntriesRef = useRef([]);
  const threeStateRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const activeMapProject = selectedProject
    ? projects.find((project) => project.id === selectedProject.id) ?? selectedProject
    : null;
  const selectedProjectId = activeMapProject?.id ?? "__none__";
  const hoverMarkerId = panelHoveredProjectId ?? "__none__";
  const activeMapAsset =
    selectedProject && selectedAsset
      ? selectedAsset
      : activeMapProject
        ? assetLibrary.find((asset) => asset.id === activeMapProject.primaryAssetId) ??
          null
        : null;
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
        map.addSource("markers", {
          type: "geojson",
          data: pointCollection(projects)
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
            this.renderer.resetState();
            const viewMatrix = new THREE.Matrix4().fromArray(matrix);
            const modelEntries = modelEntriesRef.current;

            if (!modelEntries.length) {
              return;
            }

            // Render each preloaded model with its own Mercator transform to
            // avoid precision loss from baking country-scale translations into
            // every object matrix at once.
            modelEntries.forEach(({ modelGroup }) => {
              modelGroup.visible = false;
            });

            modelEntries.forEach(({ modelGroup, transform }) => {
              modelGroup.visible = true;
              this.camera.projectionMatrix = viewMatrix.clone().multiply(
                getModelMatrix(THREE, transform)
              );
              this.renderer.render(this.scene, this.camera);
              modelGroup.visible = false;
              this.renderer.resetState();
            });
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

        ["project-markers", "project-marker-glow"].forEach((layerId) => {
          map.on("click", layerId, handleSelect);
          map.on("mouseenter", layerId, handleEnter);
          map.on("mouseleave", layerId, handleLeave);
        });

        setReady(true);
      });
    }

    setup();

    return () => {
      disposed = true;
      setReady(false);
      modelEntriesRef.current = [];
      modelLayerRef.current = null;
      threeStateRef.current = null;
      popupRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [onSelectProject]);

  useEffect(() => {
    if (viewMode === "models") {
      setIsSummaryVisible(true);
      return;
    }

    if (viewMode === "platform") {
      setIsSummaryVisible(false);
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

    map.getSource("markers")?.setData(pointCollection(projects));

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
    hoverMarkerId,
    projects,
    ready,
    selectedProjectId
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
    if (!map || !ready) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      map.resize();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [panelVisible, ready, viewMode]);

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

    async function syncProjectModels() {
      const modelLayer = modelLayerRef.current;
      const threeState = threeStateRef.current;
      if (!ready || !modelLayer || !threeState) {
        return;
      }

      const { GLTFLoader, THREE, map, maplibregl } = threeState;
      const scene = modelLayer.scene;
      const mappedProjects = projects
        .map((project) => ({
          project,
          asset:
            assetLibrary.find((asset) => asset.id === project.primaryAssetId) ?? null
        }))
        .filter(({ asset }) => Boolean(asset?.src));

      modelEntriesRef.current.forEach(({ modelGroup }) => {
        scene.remove(modelGroup);
      });
      modelEntriesRef.current = [];

      if (!mappedProjects.length) {
        map.triggerRepaint();
        return;
      }

      try {
        const modelEntries = await Promise.all(
          mappedProjects.map(async ({ project, asset }) => {
            let cachedModel = modelCacheRef.current.get(asset.src);
            if (!cachedModel) {
              const loader = new GLTFLoader();
              cachedModel = loader.loadAsync(asset.src).then((gltf) => gltf.scene);
              modelCacheRef.current.set(asset.src, cachedModel);
            }

            const baseScene = await cachedModel;
            if (!baseScene) {
              return null;
            }

            return {
              projectId: project.id,
              modelGroup: createProjectModelGroup(THREE, maplibregl, project, baseScene),
              transform: getModelTransform(maplibregl, project)
            };
          })
        );

        if (cancelled) {
          return;
        }

        modelEntries.forEach((entry) => {
          if (!entry?.modelGroup || !entry?.transform) {
            return;
          }

          scene.add(entry.modelGroup);
          entry.modelGroup.visible = false;
        });
        modelEntriesRef.current = modelEntries.filter(
          (entry) => entry?.modelGroup && entry?.transform
        );
        map.triggerRepaint();
      } catch (error) {
        console.error("Failed to place map models", error);
      }
    }

    syncProjectModels();

    return () => {
      cancelled = true;
    };
  }, [assetLibrary, projects, ready]);

  return (
    <div className="map-frame">
      {isSummaryVisible ? (
        <div className="map-summary-card">
          <p className="section-label">Market View</p>
          <h2>
            {viewMode === "discover"
              ? "Search Results Overview"
              : viewMode === "models"
                ? "3D asset library"
                : activeMapProject?.name ?? "No Property Selected"}
          </h2>
          <p>
            {viewMode === "discover"
              ? "The map stays zoomed out while you search. Click a property card or a map marker to focus a specific opportunity."
              : viewMode === "models"
                ? "The map shows every opportunity. In Models, open any GLB—including library exteriors not tied to a single deal."
                : activeMapProject?.stageSummary ??
                  "Select a property from Discover to move the map and open its memo."}
          </p>
          <div className="map-summary-kpis">
            <div>
              <span className="stat-label">
                {viewMode === "discover"
                  ? "Results"
                  : viewMode === "models"
                    ? "GLB files"
                    : "Access"}
              </span>
              <strong>
                {viewMode === "discover"
                  ? resultCount
                  : viewMode === "models"
                    ? resultCount
                    : activeMapProject?.access ?? "None"}
              </strong>
            </div>
            <div>
              <span className="stat-label">
                {viewMode === "discover"
                  ? "Buildings"
                  : viewMode === "models"
                    ? "Map deals"
                    : "Stage"}
              </span>
              <strong>
                {viewMode === "discover"
                  ? buildingResultCount
                  : viewMode === "models"
                    ? projects.length
                    : activeMapProject?.program ?? "--"}
              </strong>
            </div>
            <div>
              <span className="stat-label">
                {viewMode === "discover" ? "Land" : viewMode === "models" ? "Land" : "Return"}
              </span>
              <strong>
                {viewMode === "discover"
                  ? landResultCount
                  : viewMode === "models"
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
