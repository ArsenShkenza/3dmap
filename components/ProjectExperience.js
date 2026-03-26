"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FLOOR_POLYGONS_ABSOLUTE } from "@/lib/floor-polygons";

function getTracedFloorCount(projectId) {
  const floors = FLOOR_POLYGONS_ABSOLUTE?.[projectId]?.floors;
  if (!floors) {
    return 0;
  }

  return Object.values(floors).filter(
    (coords) => Array.isArray(coords) && coords.length >= 6
  ).length;
}

function buildFloors(project) {
  const tracedFloorCount = getTracedFloorCount(project.id);
  const floorCount = Math.max(
    Number(project.floorCount) || 0,
    tracedFloorCount,
    project.objectKind === "land" ? 6 : 4
  );
  return Array.from({ length: floorCount }, (_, index) => {
    const floorNumber = floorCount - index;
    return {
      id: `${project.id}-floor-${floorNumber}`,
      index,
      number: floorNumber,
      label: project.objectKind === "land" ? `Indicative Level ${floorNumber}` : `Floor ${floorNumber}`
    };
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getFacadeSliceSilhouette(yRatio) {
  const y = clamp(yRatio, 0, 1);
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
    { y: 1.0, leftInset: 15.6, rightInset: 16.5 }
  ];

  for (let index = 0; index < profile.length - 1; index += 1) {
    const current = profile[index];
    const next = profile[index + 1];
    if (y <= next.y) {
      const span = Math.max(next.y - current.y, 0.0001);
      const t = (y - current.y) / span;
      return {
        leftInset: lerp(current.leftInset, next.leftInset, t),
        rightInset: lerp(current.rightInset, next.rightInset, t)
      };
    }
  }

  const last = profile[profile.length - 1];
  return { leftInset: last.leftInset, rightInset: last.rightInset };
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
    height: podiumWeight * unit
  });
  cursor = zones[0].top;

  for (let floorIndex = 0; floorIndex < typicalFloorCount; floorIndex += 1) {
    const zoneHeight = unit;
    zones.push({
      top: cursor - zoneHeight,
      height: zoneHeight
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
        rightInset: silhouette.rightInset
      };
    });
}

function toPolygonClipPath(points) {
  return `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
}

function getFloorClipPath(zone) {
  const y = clamp(zone.yRatio ?? 0.5, 0, 1);
  const floorCount = Math.max(zone.floorCount ?? 1, 1);
  const normalizedIndex = floorCount <= 1 ? 0 : (zone.index ?? 0) / (floorCount - 1);

  if (y < 0.16) {
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
      [5.0, 6.5]
    ];
  }
  if (y < 0.42) {
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
      [2.8, 10.0]
    ];
  }
  if (y < 0.8) {
    const nudge = Math.sin(normalizedIndex * Math.PI * 6) * 0.7;
    const side = 2 + nudge;
    return [
      [3.6, 0],
      [96.4, 0],
      [99.4, 14.0],
      [100, 50.0],
      [99.4, 86.0],
      [96.4, 100],
      [3.6, 100],
      [Number(side.toFixed(3)), 86.0],
      [0, 50.0],
      [Number(side.toFixed(3)), 14.0]
    ];
  }

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
    [0, 10.0]
  ];
}

function toAbsoluteFloorCoords(image, pointsPct, closeCycle = false) {
  const width = image?.naturalWidth || 1;
  const height = image?.naturalHeight || 1;
  const exportPoints = closeCycle && pointsPct.length >= 3 ? [...pointsPct, pointsPct[0]] : pointsPct;
  return exportPoints.flatMap(([xPct, yPct]) => [
    Number(((xPct / 100) * width).toFixed(0)),
    Number(((yPct / 100) * height).toFixed(0))
  ]);
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
  const projectPolygons = FLOOR_POLYGONS_ABSOLUTE?.[projectId];
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
    clamp((y / sourceHeight) * 100, 0, 100)
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
    ((y - minY) / height) * 100
  ]);

  return {
    topPct: minY,
    heightPct: height,
    leftInsetPct: minX,
    rightInsetPct: 100 - maxX,
    clipPoints
  };
}

function getSavedTracePointsPct(projectId, traceIndex) {
  const projectPolygons = FLOOR_POLYGONS_ABSOLUTE?.[projectId];
  if (!projectPolygons) {
    return null;
  }

  const sourceWidth = Number(projectPolygons.sourceWidth);
  const sourceHeight = Number(projectPolygons.sourceHeight);
  if (!sourceWidth || !sourceHeight) {
    return null;
  }

  const rawCoords = projectPolygons.floors?.[traceIndex];
  const points = toPointPairs(rawCoords);
  if (!points) {
    return null;
  }

  const pointsPct = points.map(([x, y]) => [
    clamp((x / sourceWidth) * 100, 0, 100),
    clamp((y / sourceHeight) * 100, 0, 100)
  ]);

  // Many exports include the first point again at the end.
  const isClosed =
    pointsPct.length >= 3 &&
    Math.abs(pointsPct[0][0] - pointsPct[pointsPct.length - 1][0]) < 0.001 &&
    Math.abs(pointsPct[0][1] - pointsPct[pointsPct.length - 1][1]) < 0.001;

  const openPoints = isClosed ? pointsPct.slice(0, -1) : pointsPct;

  return { pointsPct: openPoints, isClosed: true };
}

const FLOOR_PANEL_APARTMENTS = [
  "APARTAMENTI - 3+1",
  "APARTAMENTI - 3+1",
  "APARTAMENTI - 2+1",
  "APARTAMENTI - 2+1",
  "APARTAMENTI - 2+1",
  "APARTAMENTI - 2+1",
  "APARTAMENTI - 3+1",
  "APARTAMENTI - 2+1"
];

export default function ProjectExperience({ project }) {
  const floors = useMemo(() => buildFloors(project), [project]);
  const facadeZones = useMemo(() => getFacadeZoneLayout(floors.length), [floors.length]);
  const [traceEnabled, setTraceEnabled] = useState(false);
  const [traceFloorIndex, setTraceFloorIndex] = useState(0);
  const [hoveredFloorNumber, setHoveredFloorNumber] = useState(null);
  const [focusedFloorNumber, setFocusedFloorNumber] = useState(null);
  const [floorPanelNumber, setFloorPanelNumber] = useState(null);
  const [tracePointsByFloor, setTracePointsByFloor] = useState({});
  const [traceClosedByFloor, setTraceClosedByFloor] = useState({});
  const [traceCursorPct, setTraceCursorPct] = useState(null);
  const [traceStatus, setTraceStatus] = useState("");

  const towerRef = useRef(null);
  const imageRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const controlsOuterRef = useRef(null);
  const controlsWrapperRef = useRef(null);

  const tracePointsPct = tracePointsByFloor[traceFloorIndex] || [];
  const traceIsClosed = Boolean(traceClosedByFloor[traceFloorIndex]);

  const isTracing = traceEnabled && !traceIsClosed;
  const activeFloorNumber = hoveredFloorNumber ?? focusedFloorNumber;
  const traceFloorNumber = traceFloorIndex + 1;
  const traceFloor = floors.find((floor) => floor.number === traceFloorNumber) ?? floors[floors.length - 1];
  const hasAbsolutePolygons = Boolean(FLOOR_POLYGONS_ABSOLUTE?.[project.id]);
  const savedTraceIndexes = useMemo(() =>
    Object.keys(FLOOR_POLYGONS_ABSOLUTE?.[project.id]?.floors || {})
      .map(Number)
      .filter(Number.isFinite),
    [project.id]
  );

  const maxFloorNumber = floors.length ? Math.max(...floors.map((floor) => floor.number)) : 0;
  const minFloorNumber = floors.length ? Math.min(...floors.map((floor) => floor.number)) : 0;
  const panelFloorDisplayNumber =
    floorPanelNumber ?? focusedFloorNumber ?? hoveredFloorNumber ?? 33;

  const syncTraceCanvas = () => {
    const image = imageRef.current;
    const tower = towerRef.current;
    const canvas = previewCanvasRef.current;
    if (!image || !tower || !canvas) {
      return;
    }

    const imageRect = image.getBoundingClientRect();
    const towerRect = tower.getBoundingClientRect();
    if (!imageRect.width || !imageRect.height) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = Math.max(Math.round(imageRect.width), 1);
    const canvasHeight = Math.max(Math.round(imageRect.height), 1);

    canvas.width = Math.max(Math.round(canvasWidth * dpr), 1);
    canvas.height = Math.max(Math.round(canvasHeight * dpr), 1);
    canvas.style.left = `${imageRect.left - towerRect.left}px`;
    canvas.style.top = `${imageRect.top - towerRect.top}px`;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.scale(dpr, dpr);

    if (!traceEnabled) {
      return;
    }

    const pointsPx = tracePointsPct.map(([x, y]) => [
      (x / 100) * canvasWidth,
      (y / 100) * canvasHeight
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

    if (traceIsClosed && pointsPx.length >= 3) {
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

    if (!traceCursorPct) {
      return;
    }

    const cursorX = (traceCursorPct[0] / 100) * canvasWidth;
    const cursorY = (traceCursorPct[1] / 100) * canvasHeight;

    if (!traceIsClosed && pointsPx.length >= 1) {
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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => syncTraceCanvas();
    window.addEventListener("resize", handleResize);
    syncTraceCanvas();
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    syncTraceCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traceEnabled, traceFloorIndex, traceCursorPct, traceIsClosed, tracePointsPct.length]);

  useEffect(() => {
    const outer = controlsOuterRef.current;
    const wrapper = controlsWrapperRef.current;
    if (!outer || !wrapper) {
      return;
    }

    const page = outer.closest(".experience-page");
    if (!page) {
      return;
    }

    const reposition = () => {
      const outerRect = outer.getBoundingClientRect();
      const wrapperH = wrapper.offsetHeight;
      const pageH = page.clientHeight;
      const targetTop = pageH / 2 - outerRect.top - wrapperH / 2;
      const maxTop = outerRect.height - wrapperH;
      wrapper.style.top = `${Math.min(Math.max(targetTop, 0), Math.max(maxTop, 0))}px`;
    };

    const ro = new ResizeObserver(reposition);
    ro.observe(outer);

    page.addEventListener("scroll", reposition, { passive: true });
    window.addEventListener("resize", reposition, { passive: true });
    reposition();

    return () => {
      ro.disconnect();
      page.removeEventListener("scroll", reposition);
      window.removeEventListener("resize", reposition);
    };
  }, []);

  useEffect(() => {
    if (!traceEnabled) {
      return;
    }

    if ((tracePointsByFloor[traceFloorIndex] || []).length) {
      return;
    }

    const saved = getSavedTracePointsPct(project.id, traceFloorIndex);
    if (!saved) {
      return;
    }

    setTracePointsByFloor((prev) => ({ ...prev, [traceFloorIndex]: saved.pointsPct }));
    setTraceClosedByFloor((prev) => ({ ...prev, [traceFloorIndex]: saved.isClosed }));
    setTraceCursorPct(saved.pointsPct[0] ?? null);
    setTraceStatus(`Loaded saved polygon for trace ${traceFloorIndex}.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traceEnabled, traceFloorIndex, project.id]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        setFloorPanelNumber(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const caption =
    project.objectKind === "land"
      ? "Scroll for full image · indicative elevation"
      : "Scroll for full elevation · hover floors to explore";

  const getPctFromEvent = (event) => {
    const image = imageRef.current;
    if (!image) {
      return null;
    }
    const rect = image.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return null;
    }
    const xPct = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    const yPct = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
    return [Number(xPct.toFixed(3)), Number(yPct.toFixed(3))];
  };

  const shouldCloseTraceCycle = (pointPct, rect) => {
    if (!pointPct || tracePointsPct.length < 3) {
      return false;
    }
    const [xPct, yPct] = pointPct;
    const first = tracePointsPct[0];
    const dxPx = ((xPct - first[0]) / 100) * rect.width;
    const dyPx = ((yPct - first[1]) / 100) * rect.height;
    return Math.hypot(dxPx, dyPx) <= 16;
  };

  return (
    <section className="experience-page">
      <div className="experience-backdrop" />

      <div className="experience-shell">
        <header className="experience-header">
          <Link className="ghost-button experience-back-link" href={`/?project=${project.id}`}>
            Back To Map
          </Link>
          <p className="status-label">Project Experience</p>
        </header>

        <section className="experience-hero">
          <div className="experience-copy">
            <h1>{project.name}</h1>
            <p className="intro">
              {project.city} • {project.district}
            </p>
            <p className="selection-meta">{project.summary}</p>

            <div className="detail-grid experience-stats">
              <article className="detail-card">
                <p className="status-label">Access</p>
                <strong>{project.access}</strong>
              </article>
              <article className="detail-card">
                <p className="status-label">Category</p>
                <strong>{project.categoryLabel}</strong>
              </article>
              <article className="detail-card">
                <p className="status-label">ROI</p>
                <strong>{project.roi}</strong>
              </article>
              <article className="detail-card">
                <p className="status-label">Stage</p>
                <strong>{project.stage}</strong>
              </article>
            </div>
          </div>
        </section>
      </div>

      <div className="experience-elevation-below">
        <div className="visual-frame experience-elevation-frame">
          <p className="status-label">Front Elevation</p>
          <div className="floor-elevation">
            <p className="elevation-caption">{caption}</p>
            <div className="controls-outer" ref={controlsOuterRef} aria-live="polite">
              <div className="controls-wrapper" ref={controlsWrapperRef}>
                <div className="controls-title">Numri i katit</div>
                <div className="controls-dots">
                  <button
                    type="button"
                    className="controls-dot"
                    aria-label="Up one floor"
                    disabled={!maxFloorNumber}
                    onClick={() => {
                      if (!maxFloorNumber) {
                        return;
                      }
                      const next = clamp(
                        (focusedFloorNumber ?? maxFloorNumber) + 1,
                        minFloorNumber,
                        maxFloorNumber
                      );
                      setFocusedFloorNumber(next);
                    }}
                  />
                </div>
                <br />
                <div className="current-holder">
                  <div className="current-floor-number" data-floor={activeFloorNumber ?? ""}>
                    {activeFloorNumber ?? "—"}
                  </div>
                  <div className="current-invisible" data-show={activeFloorNumber ?? ""} />
                </div>
                <div className="controls-dots">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <button
                      key={step}
                      type="button"
                      className="controls-dot"
                      aria-label={`Down ${step} floor${step === 1 ? "" : "s"}`}
                      disabled={!maxFloorNumber}
                      onClick={() => {
                        if (!maxFloorNumber) {
                          return;
                        }
                        const next = clamp(
                          (focusedFloorNumber ?? maxFloorNumber) - step,
                          minFloorNumber,
                          maxFloorNumber
                        );
                        setFocusedFloorNumber(next);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div
              ref={towerRef}
              className={`elevation-tower${traceEnabled ? " is-tracing" : ""}`}
              onPointerMove={(event) => {
                if (!isTracing) {
                  return;
                }
                const next = getPctFromEvent(event);
                if (!next) {
                  return;
                }
                setTraceCursorPct(next);
              }}
              onPointerLeave={() => setTraceCursorPct(null)}
              onPointerDown={(event) => {
                if (!traceEnabled) {
                  return;
                }
                event.preventDefault();

                const image = imageRef.current;
                if (!image) {
                  return;
                }
                const rect = image.getBoundingClientRect();
                if (!rect.width || !rect.height) {
                  return;
                }

                const next = getPctFromEvent(event);
                if (!next) {
                  return;
                }

                if (shouldCloseTraceCycle(next, rect)) {
                  setTraceClosedByFloor((prev) => ({ ...prev, [traceFloorIndex]: true }));
                  setTraceCursorPct(tracePointsPct[0]);
                  setTraceStatus(
                    `Tracing trace ${traceFloorIndex}: polygon closed with ${tracePointsPct.length} points.`
                  );
                  return;
                }

                if (traceIsClosed) {
                  return;
                }

                setTracePointsByFloor((prev) => ({
                  ...prev,
                  [traceFloorIndex]: [...(prev[traceFloorIndex] || []), next]
                }));
                setTraceCursorPct(next);
                setTraceStatus(
                  `Tracing trace ${traceFloorIndex}: ${(tracePointsPct.length + 1)} point${tracePointsPct.length ? "s" : ""}. Click the first point to close.`
                );
              }}
            >
              <img
                className="elevation-image"
                src="/assets/building5.jpg"
                alt={`${project.name} facade elevation`}
                ref={imageRef}
                draggable={false}
                onLoad={() => {
                  syncTraceCanvas();
                }}
              />
              <canvas ref={previewCanvasRef} className="floor-trace-preview-canvas" />
              {traceEnabled && savedTraceIndexes.length > 0 && (() => {
                const src = FLOOR_POLYGONS_ABSOLUTE[project.id];
                return (
                  <svg
                    viewBox={`0 0 ${src?.sourceWidth ?? 100} ${src?.sourceHeight ?? 100}`}
                    preserveAspectRatio="none"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                      zIndex: 5
                    }}
                  >
                    {savedTraceIndexes.map((traceIdx) => {
                      const pairs = toPointPairs(src?.floors?.[traceIdx]);
                      if (!pairs) {
                        return null;
                      }
                      const isTarget = traceIdx === traceFloorIndex;
                      return (
                        <polygon
                          key={traceIdx}
                          points={pairs.map(([x, y]) => `${x},${y}`).join(" ")}
                          fill={isTarget ? "rgba(32, 242, 5, 0.91)" : "rgba(41, 250, 4, 0.32)"}
                          stroke={isTarget ? "rgba(54, 237, 8, 0.85)" : "rgba(95, 221, 11, 0.86)"}
                          strokeWidth={isTarget ? "4" : "2"}
                        />
                      );
                    })}
                  </svg>
                );
              })()}
              <div
                className="elevation-floor-stack"
                style={{
                  ...(hasAbsolutePolygons ? { inset: 0 } : null),
                  pointerEvents: traceEnabled ? "none" : "auto"
                }}
              >
                {floors.map((floor, index) => {
                  const zone = facadeZones[index] ?? facadeZones[facadeZones.length - 1];
                  const absoluteGeometry = getAbsoluteFloorGeometry(project.id, floor.number - 1);
                  const clipPoints = absoluteGeometry?.clipPoints || getFloorClipPath(zone);

                  return (
                    <button
                      key={floor.id}
                      type="button"
                      className={`elevation-floor${floor.number === activeFloorNumber ? " is-active" : ""}`}
                      style={{
                        top: absoluteGeometry
                          ? `${absoluteGeometry.topPct.toFixed(3)}%`
                          : `${(zone.top * 100).toFixed(3)}%`,
                        height: absoluteGeometry
                          ? `${absoluteGeometry.heightPct.toFixed(3)}%`
                          : `${(zone.height * 100).toFixed(3)}%`,
                        left: absoluteGeometry
                          ? `${absoluteGeometry.leftInsetPct.toFixed(3)}%`
                          : `${zone.leftInset.toFixed(3)}%`,
                        right: absoluteGeometry
                          ? `${absoluteGeometry.rightInsetPct.toFixed(3)}%`
                          : `${zone.rightInset.toFixed(3)}%`,
                        ["--floor-clip-path"]: toPolygonClipPath(clipPoints)
                      }}
                      aria-label={`Floor ${floor.number}`}
                      onMouseEnter={() => {
                        setHoveredFloorNumber(floor.number);
                        setFocusedFloorNumber(floor.number);
                      }}
                      onMouseLeave={() => setHoveredFloorNumber(null)}
                      onFocus={() => {
                        setHoveredFloorNumber(floor.number);
                        setFocusedFloorNumber(floor.number);
                      }}
                      onBlur={() => setHoveredFloorNumber(null)}
                      onClick={() => {
                        setFocusedFloorNumber(floor.number);
                        setFloorPanelNumber(floor.number);
                      }}
                    >
                      <strong>{floor.number}</strong>
                      <span>{floor.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="floor-trace-tool">
              <div className="floor-trace-toolbar">
                <button
                  type="button"
                  className="ghost-button floor-trace-toggle"
                  onClick={() => {
                    setTraceEnabled((prev) => !prev);
                    setTraceCursorPct(null);
                    setTraceStatus("");
                  }}
                >
                  {traceEnabled ? "Tracing On" : "Trace Floors"}
                </button>

                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => {
                    const saved = getSavedTracePointsPct(project.id, traceFloorIndex);
                    if (!saved) {
                      setTraceStatus(`No saved polygon found for trace ${traceFloorIndex}.`);
                      return;
                    }
                    setTracePointsByFloor((prev) => ({ ...prev, [traceFloorIndex]: saved.pointsPct }));
                    setTraceClosedByFloor((prev) => ({ ...prev, [traceFloorIndex]: saved.isClosed }));
                    setTraceCursorPct(saved.pointsPct[0] ?? null);
                    setTraceStatus(`Loaded saved polygon for trace ${traceFloorIndex}.`);
                  }}
                >
                  Load Saved
                </button>

                <button
                  type="button"
                  className="ghost-button floor-trace-prev"
                  onClick={() => {
                    const next = clamp(traceFloorIndex - 1, 0, Math.max(floors.length - 1, 0));
                    setTraceFloorIndex(next);
                    setTraceCursorPct(null);
                    setTraceStatus("");
                  }}
                >
                  Prev
                </button>

                <strong className="floor-trace-floor">
                  Trace {traceFloorIndex}
                  {traceFloor ? ` · Floor ${traceFloor.number}` : ""}
                </strong>

                <button
                  type="button"
                  className="ghost-button floor-trace-next"
                  onClick={() => {
                    const next = clamp(traceFloorIndex + 1, 0, Math.max(floors.length - 1, 0));
                    setTraceFloorIndex(next);
                    setTraceCursorPct(null);
                    setTraceStatus("");
                  }}
                >
                  Next
                </button>

                <button
                  type="button"
                  className="ghost-button floor-trace-undo"
                  onClick={() => {
                    setTracePointsByFloor((prev) => {
                      const points = [...(prev[traceFloorIndex] || [])];
                      points.pop();
                      return { ...prev, [traceFloorIndex]: points };
                    });
                    setTraceClosedByFloor((prev) => ({ ...prev, [traceFloorIndex]: false }));
                    setTraceStatus("");
                  }}
                >
                  Undo
                </button>

                <button
                  type="button"
                  className="ghost-button floor-trace-clear"
                  onClick={() => {
                    setTracePointsByFloor((prev) => ({ ...prev, [traceFloorIndex]: [] }));
                    setTraceClosedByFloor((prev) => ({ ...prev, [traceFloorIndex]: false }));
                    setTraceCursorPct(null);
                    setTraceStatus("");
                  }}
                >
                  Clear
                </button>

                <button
                  type="button"
                  className="floor-trace-copy"
                  onClick={async () => {
                    const image = imageRef.current;
                    if (!image) {
                      return;
                    }

                    const payload = {
                      projectId: project.id,
                      floor: traceFloorIndex,
                      floorNumber: traceFloor?.number ?? null,
                      sourceWidth: image.naturalWidth || 0,
                      sourceHeight: image.naturalHeight || 0,
                      coords: toAbsoluteFloorCoords(
                        image,
                        tracePointsByFloor[traceFloorIndex] || [],
                        Boolean(traceClosedByFloor[traceFloorIndex])
                      )
                    };

                    const text = JSON.stringify(payload, null, 2);
                    try {
                      await navigator.clipboard.writeText(text);
                      setTraceStatus(`Copied trace ${traceFloorIndex} coords to clipboard.`);
                    } catch (_error) {
                      console.log(text);
                      setTraceStatus("Clipboard blocked. Coordinates logged in console.");
                    }
                  }}
                >
                  Copy Floor Coords
                </button>
              </div>

              <p className="floor-trace-help">
                Enable trace, click points clockwise on the facade, then copy coords.
              </p>
              {traceStatus ? <p className="floor-trace-help">{traceStatus}</p> : null}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`floor-panel${floorPanelNumber !== null ? " is-open" : ""}`}
        aria-hidden={floorPanelNumber === null}
      >
        <button
          type="button"
          className="floor-panel-backdrop"
          aria-label="Close floor plan"
          tabIndex={floorPanelNumber !== null ? 0 : -1}
          onClick={() => setFloorPanelNumber(null)}
        />
        <div
          className="floor-panel-sheet"
          role="dialog"
          aria-modal="true"
          aria-label={
            floorPanelNumber !== null
              ? `Floor ${panelFloorDisplayNumber} plan`
              : "Floor plan"
          }
        >
          <button
            type="button"
            className="floor-panel-close"
            aria-label="Close floor plan"
            tabIndex={floorPanelNumber !== null ? 0 : -1}
            onClick={() => setFloorPanelNumber(null)}
          >
            &#8249;
          </button>

          <div className="floor-panel-shell">
            <aside className="floor-panel-rail" aria-hidden="true">
              <div className="floor-panel-controls">
                <div className="floor-panel-controls-title">Numri i katit</div>
                <div className="floor-panel-controls-value">
                  {panelFloorDisplayNumber}
                </div>
                <div className="floor-panel-controls-dots">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <span key={step} className="floor-panel-controls-dot" />
                  ))}
                </div>
              </div>
            </aside>

            <div className="floor-panel-main">
              <div className="floor-panel-head">
                <div className="floor-panel-floor-label">
                  KATI {panelFloorDisplayNumber}
                </div>
                <div className="floor-panel-zone-pill">ZONA E BANIMIT</div>
              </div>

              <div className="floor-panel-body">
                <div className="floor-panel-plan-wrap">
                  <img
                    key={panelFloorDisplayNumber}
                    className="floor-panel-plan"
                    src="/assets/plan-33.jpg"
                    alt={`Floor ${panelFloorDisplayNumber} plan`}
                  />
                </div>

                <aside className="floor-panel-list">
                  <div className="floor-panel-list-title">
                    Apartamentet n&euml; kat:
                  </div>
                  <div className="floor-panel-list-items">
                    {FLOOR_PANEL_APARTMENTS.map((apartment, index) => (
                      <div key={`${apartment}-${index}`} className="floor-panel-list-item">
                        {apartment}
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

