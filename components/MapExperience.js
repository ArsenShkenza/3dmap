"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { setupPackedGltfLoader } from "@/lib/setupPackedGltfLoader";

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
  map.stop();

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

function getProjectModelSpecs(THREE, project, baseScene) {
  baseScene.scale.setScalar(1);
  baseScene.position.set(0, 0, 0);

  const initialBox = new THREE.Box3().setFromObject(baseScene);
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

  baseScene.scale.setScalar(scaleFactor);

  const scaledBox = new THREE.Box3().setFromObject(baseScene);
  const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
  const position = new THREE.Vector3(-scaledCenter.x, -scaledBox.min.y, -scaledCenter.z);

  return { scaleFactor, position };
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
  viewMode,
  focusRequest,
  panelVisible = true,
  panelHoveredProjectId = null
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const modelCacheRef = useRef(new Map());
  const modelLayerRef = useRef(null);
  const modelEntriesRef = useRef([]);
  const threeStateRef = useRef(null);
  const showModelsRef = useRef(false);
  const onSelectProjectRef = useRef(onSelectProject);
  onSelectProjectRef.current = onSelectProject;
  const [ready, setReady] = useState(false);
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

  /** Stable while project set + view are unchanged — avoids effects re-firing on deferred `projects` reference churn. */
  const mapBrowseSignature =
    viewMode === "discover" || viewMode === "browse"
      ? `${viewMode}:${projects.map((p) => p.id).join("\u001f")}`
      : viewMode;

  const markersGeoJson = useMemo(() => pointCollection(projects), [mapBrowseSignature]);

  // Keep a ref in sync with the prop so the MapLibre render() callback can read it without stale closure
  showModelsRef.current = viewMode === "discover" || viewMode === "browse";

  useEffect(() => {
    let disposed = false;

    async function setup() {
      if (!containerRef.current || disposed || mapRef.current) {
        return;
      }

      const threeModulesPromise = import("@/lib/threeMapGltfImports.js");

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
        GLTFLoader: null,
        THREE: null,
        map,
        maplibregl
      };

      map.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "bottom-right"
      );

      map.on("load", async () => {
        let THREE;
        let GLTFLoader;
        try {
          ({ THREE, GLTFLoader } = await threeModulesPromise);
        } catch (error) {
          console.error("Failed to load Three.js for map", error);
          return;
        }
        if (disposed || !mapRef.current) {
          return;
        }

        threeStateRef.current = {
          GLTFLoader,
          THREE,
          map,
          maplibregl
        };

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
            // Guard against drawing to an incomplete framebuffer (zero-size canvas).
            // Without this, MapLibre calls render() before the canvas is sized,
            // flooding the console with GL_INVALID_FRAMEBUFFER_OPERATION warnings.
            const canvas = map.getCanvas();
            if (!canvas || canvas.width === 0 || canvas.height === 0) {
              return;
            }

            const fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if (fbStatus !== gl.FRAMEBUFFER_COMPLETE) {
              return;
            }

            this.renderer.resetState();
            const modelEntries = modelEntriesRef.current;
            const showModels = showModelsRef.current;

            if (!modelEntries.length || !showModels) {
              return;
            }

            const viewMatrix = new THREE.Matrix4().fromArray(matrix);

            modelEntries.forEach(({ baseScene }) => {
              baseScene.visible = false;
            });

            modelEntries.forEach(({ baseScene, scaleFactor, position, transform }) => {
              baseScene.scale.setScalar(scaleFactor);
              baseScene.position.copy(position);
              baseScene.visible = true;

              this.camera.projectionMatrix = viewMatrix.clone().multiply(
                getModelMatrix(THREE, transform)
              );
              this.renderer.render(this.scene, this.camera);
              baseScene.visible = false;
              this.renderer.resetState();
            });
            // Static models — no triggerRepaint() here. MapLibre redraws on camera change.
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
            onSelectProjectRef.current(id);
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
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) {
      return;
    }

    map.getSource("markers")?.setData(markersGeoJson);

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
  }, [hoverMarkerId, markersGeoJson, ready, selectedProjectId]);

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
  }, [mapBrowseSignature, ready, viewMode]);

  // When switching back to discover/browse, trigger a single repaint so models reappear.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (viewMode === "discover" || viewMode === "browse") {
      map.triggerRepaint();
    } else {
      map.stop();
    }
  }, [viewMode, ready]);

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

    map.stop();
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

    const mapShowsProjectModels =
      viewMode === "discover" || viewMode === "browse";

    async function syncProjectModels() {
      const modelLayer = modelLayerRef.current;
      const threeState = threeStateRef.current;
      if (!ready || !modelLayer || !threeState) {
        return;
      }

      const { GLTFLoader, THREE, map, maplibregl } = threeState;
      const scene = modelLayer.scene;

      const detachModelEntries = () => {
        modelEntriesRef.current.forEach(({ baseScene }) => {
          if (baseScene?.parent === scene) {
            scene.remove(baseScene);
          }
        });
        modelEntriesRef.current = [];
      };

      if (!mapShowsProjectModels) {
        detachModelEntries();
        map.triggerRepaint();
        return;
      }

      const mappedProjects = projects
        .map((project) => ({
          project,
          asset:
            assetLibrary.find((asset) => asset.id === project.primaryAssetId) ?? null
        }))
        .filter(({ asset }) => Boolean(asset?.src));

      if (!mappedProjects.length) {
        detachModelEntries();
        map.triggerRepaint();
        return;
      }

      detachModelEntries();

      try {
        const sharedLoader = new GLTFLoader();
        await setupPackedGltfLoader(sharedLoader, modelLayer.renderer);

        const loadedScenes = await Promise.all(
          mappedProjects.map(async ({ project, asset }) => {
            let cachedModel = modelCacheRef.current.get(asset.src);
            if (!cachedModel) {
              cachedModel = sharedLoader.loadAsync(asset.src).then((gltf) => {
                const baseScene = gltf.scene;
                // Pre-process materials and properties ONCE per asset
                baseScene.traverse((node) => {
                  if (!node.isMesh) return;
                  node.frustumCulled = false;
                  node.castShadow = true;
                  node.receiveShadow = true;
                  if (node.material) {
                    if (Array.isArray(node.material)) {
                      node.material.forEach((m) => {
                        m.side = THREE.DoubleSide;
                        m.needsUpdate = true;
                      });
                    } else {
                      node.material.side = THREE.DoubleSide;
                      node.material.needsUpdate = true;
                    }
                  }
                });
                return baseScene;
              });
              modelCacheRef.current.set(asset.src, cachedModel);
            }

            const baseScene = await cachedModel;
            return { project, baseScene };
          })
        );

        if (cancelled) {
          return;
        }

        const modelEntries = [];
        for (const { project, baseScene } of loadedScenes) {
          if (!baseScene) continue;

          const { scaleFactor, position } = getProjectModelSpecs(THREE, project, baseScene);

          modelEntries.push({
            projectId: project.id,
            baseScene,
            scaleFactor,
            position,
            transform: getModelTransform(maplibregl, project)
          });
        }

        modelEntries.forEach((entry) => {
          if (entry.baseScene.parent !== scene) {
            scene.add(entry.baseScene);
            entry.baseScene.visible = false;
          }
        });
        modelEntriesRef.current = modelEntries;
        map.triggerRepaint();
      } catch (error) {
        console.error("Failed to place map models", error);
      }
    }

    void syncProjectModels();

    return () => {
      cancelled = true;
    };
  }, [assetLibrary, mapBrowseSignature, ready, viewMode]);

  return (
    <div className="map-underlay-stack">
      <div className="map-backdrop">
        <div className="map-frame">
          <div ref={containerRef} className="map-canvas" />
        </div>
      </div>
    </div>
  );
}
