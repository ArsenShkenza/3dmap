"use client";

import { useEffect, useRef, useState } from "react";

const MODEL_LAYER_ID = "selected-project-model";
const MAX_EXTERIOR_MAP_ZOOM = 20;

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

function getSelectedMassingOpacity(hasModel) {
  return hasModel ? 0.22 : 0.58;
}

function getSelectedMassingHeight(project, hasModel) {
  if (!hasModel) {
    return ["get", "height"];
  }

  return project.mapModelBaseHeight ?? 1.4;
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

function getModelTransform(maplibregl, project) {
  const [lng, lat] = getFootprintCentroid(project);
  const coordinate = maplibregl.MercatorCoordinate.fromLngLat({ lng, lat }, 0);

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

export default function MapExperience({
  projects,
  selectedProject,
  selectedAsset,
  onSelectProject
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
              ["==", ["get", "id"], selectedProject.id],
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
          filter: ["!=", ["get", "id"], selectedProject.id],
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
          filter: ["==", ["get", "id"], selectedProject.id],
          paint: {
            "fill-extrusion-color": "#f1d3a1",
            "fill-extrusion-height": getSelectedMassingHeight(
              selectedProject,
              Boolean(selectedAsset?.src)
            ),
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": getSelectedMassingOpacity(
              Boolean(selectedAsset?.src)
            )
          }
        });

        map.addLayer({
          id: "project-footprints-outline",
          type: "line",
          source: "projects",
          paint: {
            "line-color": [
              "case",
              ["==", ["get", "id"], selectedProject.id],
              "#f3d39c",
              "#7ab9db"
            ],
            "line-width": [
              "case",
              ["==", ["get", "id"], selectedProject.id],
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
              ["==", ["get", "id"], selectedProject.id],
              18,
              12
            ],
            "circle-color": [
              "case",
              ["==", ["get", "id"], selectedProject.id],
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
              ["==", ["get", "id"], selectedProject.id],
              8,
              5
            ],
            "circle-color": [
              "case",
              ["==", ["get", "id"], selectedProject.id],
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
    const map = mapRef.current;
    if (!map || !ready) {
      return;
    }

    map.getSource("projects")?.setData(polygonCollection(projects));
    map.getSource("markers")?.setData(pointCollection(projects));

    setPaintIfLayerExists(map, "project-footprints", "fill-color", [
      "case",
      ["==", ["get", "id"], selectedProject.id],
      "#d6b47b",
      "#27455a"
    ]);
    setPaintIfLayerExists(map, "project-footprints-outline", "line-color", [
      "case",
      ["==", ["get", "id"], selectedProject.id],
      "#f3d39c",
      "#7ab9db"
    ]);
    setPaintIfLayerExists(map, "project-footprints-outline", "line-width", [
      "case",
      ["==", ["get", "id"], selectedProject.id],
      3,
      1.25
    ]);
    setFilterIfLayerExists(map, "project-massing-base", [
      "!=",
      ["get", "id"],
      selectedProject.id
    ]);
    setFilterIfLayerExists(map, "project-massing-selected", [
      "==",
      ["get", "id"],
      selectedProject.id
    ]);
    setPaintIfLayerExists(
      map,
      "project-massing-selected",
      "fill-extrusion-height",
      getSelectedMassingHeight(selectedProject, Boolean(selectedAsset?.src))
    );
    setPaintIfLayerExists(
      map,
      "project-massing-selected",
      "fill-extrusion-opacity",
      getSelectedMassingOpacity(Boolean(selectedAsset?.src))
    );
    setPaintIfLayerExists(map, "project-marker-glow", "circle-radius", [
      "case",
      ["==", ["get", "id"], selectedProject.id],
      18,
      12
    ]);
    setPaintIfLayerExists(map, "project-marker-glow", "circle-color", [
      "case",
      ["==", ["get", "id"], selectedProject.id],
      "#f3d39c",
      "#67b2df"
    ]);
    setPaintIfLayerExists(map, "project-markers", "circle-radius", [
      "case",
      ["==", ["get", "id"], selectedProject.id],
      8,
      5
    ]);
    setPaintIfLayerExists(map, "project-markers", "circle-color", [
      "case",
      ["==", ["get", "id"], selectedProject.id],
      "#fff1cf",
      "#8dd3ff"
    ]);

    const focusView = getFocusView(selectedProject, Boolean(selectedAsset?.src));

    map.flyTo({
      center: focusView.center,
      zoom: focusView.zoom,
      pitch: focusView.pitch,
      bearing: focusView.bearing,
      speed: 0.7,
      curve: 1.15,
      essential: true
    });
  }, [projects, ready, selectedAsset?.src, selectedProject]);

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

      if (!selectedAsset?.src) {
        map.triggerRepaint();
        return;
      }

      try {
        let cachedModel = modelCacheRef.current.get(selectedAsset.src);
        if (!cachedModel) {
          const loader = new GLTFLoader();
          cachedModel = loader.loadAsync(selectedAsset.src).then((gltf) => gltf.scene);
          modelCacheRef.current.set(selectedAsset.src, cachedModel);
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

          if (node.material) {
            node.material.needsUpdate = true;
          }
        });

        const initialBox = new THREE.Box3().setFromObject(modelScene);
        const initialSize = initialBox.getSize(new THREE.Vector3());
        const targetHeight = Math.max(selectedProject.massingHeight ?? 24, 12);
        const { width, depth } = getFootprintDimensions(selectedProject);
        const footprintFill = selectedProject.mapModelFootprintFill ?? 0.78;
        const targetWidth = Math.max(width * footprintFill, 12);
        const targetDepth = Math.max(depth * footprintFill, 12);
        const heightScale = targetHeight / Math.max(initialSize.y, 0.001);
        const widthScale = targetWidth / Math.max(initialSize.x, 0.001);
        const depthScale = targetDepth / Math.max(initialSize.z, 0.001);
        const footprintScale = Math.min(widthScale, depthScale);
        const maxHeightScale =
          heightScale * (selectedProject.mapModelMaxHeightFactor ?? 1.8);
        const scaleFactor =
          Math.min(footprintScale, maxHeightScale) *
          (selectedProject.mapModelScale ?? 1);

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
        modelTransformRef.current = getModelTransform(maplibregl, selectedProject);
        map.triggerRepaint();
      } catch (error) {
        console.error("Failed to place 3D model on map", error);
      }
    }

    syncSelectedModel();

    return () => {
      cancelled = true;
    };
  }, [ready, selectedAsset?.src, selectedProject]);

  return (
    <div className="map-frame">
      <div className="map-summary-card">
        <p className="section-label">Market View</p>
        <h2>{selectedProject.name}</h2>
        <p>{selectedProject.stageSummary}</p>
        <div className="map-summary-kpis">
          <div>
            <span className="stat-label">Access</span>
            <strong>{selectedProject.access}</strong>
          </div>
          <div>
            <span className="stat-label">Stage</span>
            <strong>{selectedProject.stage}</strong>
          </div>
          <div>
            <span className="stat-label">Return</span>
            <strong>{selectedProject.roi}</strong>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="map-canvas" />
    </div>
  );
}
