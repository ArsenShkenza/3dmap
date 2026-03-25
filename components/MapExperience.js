"use client";

import { useEffect, useRef, useState } from "react";

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

export default function MapExperience({
  projects,
  selectedProject,
  onSelectProject
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;

    async function setup() {
      const maplibregl = (await import("maplibre-gl")).default;
      if (!containerRef.current || disposed || mapRef.current) {
        return;
      }

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: mapStyle(),
        center: [20.15, 41.72],
        zoom: 7.2,
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
          id: "project-massing",
          type: "fill-extrusion",
          source: "projects",
          paint: {
            "fill-extrusion-color": [
              "case",
              ["==", ["get", "id"], selectedProject.id],
              "#f1d3a1",
              "#4d7a97"
            ],
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 0.58
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

        ["project-markers", "project-marker-glow", "project-massing"].forEach(
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
    setPaintIfLayerExists(map, "project-massing", "fill-extrusion-color", [
      "case",
      ["==", ["get", "id"], selectedProject.id],
      "#f1d3a1",
      "#4d7a97"
    ]);
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

    map.flyTo({
      center: selectedProject.center,
      zoom: selectedProject.zoom,
      pitch: selectedProject.pitch,
      bearing: selectedProject.bearing,
      speed: 0.7,
      curve: 1.15,
      essential: true
    });
  }, [projects, ready, selectedProject]);

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
