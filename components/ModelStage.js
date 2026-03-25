"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_VIEWER_CONFIG = {
  autoRotate: true,
  cameraOrbit: "-35deg 68deg 130%",
  minCameraOrbit: "auto 35deg auto",
  maxCameraOrbit: "auto 88deg auto",
  interactionPrompt: "auto",
  minFieldOfView: null,
  maxFieldOfView: null
};

const INTERIOR_NAVIGATION_CONFIG = {
  autoRotate: false,
  cameraOrbit: "-18deg 78deg 42%",
  minCameraOrbit: "auto 0deg 4%",
  maxCameraOrbit: "auto 89deg 240%",
  interactionPrompt: "auto",
  minFieldOfView: "12deg",
  maxFieldOfView: "56deg"
};

function getViewerConfig(viewerMode, viewerConfig) {
  const baseConfig =
    viewerMode === "interior-navigation"
      ? INTERIOR_NAVIGATION_CONFIG
      : DEFAULT_VIEWER_CONFIG;

  return {
    ...baseConfig,
    ...viewerConfig
  };
}

export default function ModelStage({
  asset,
  project,
  caption,
  viewerMode = "default",
  viewerConfig,
  statusLabel = "AR Ready"
}) {
  const viewerRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const resolvedViewerConfig = useMemo(
    () => getViewerConfig(viewerMode, viewerConfig),
    [viewerConfig, viewerMode]
  );

  useEffect(() => {
    setStatus("loading");
    let cancelled = false;
    let cleanup = () => {};

    async function attachViewer() {
      try {
        await import("@google/model-viewer/dist/model-viewer-module.min.js");
        await customElements.whenDefined("model-viewer");

        if (cancelled) {
          return;
        }

        const viewer = viewerRef.current;
        if (!viewer) {
          return;
        }

        const handleLoad = () => {
          if (!cancelled) {
            setStatus("ready");
          }
        };
        const handleError = () => {
          if (!cancelled) {
            setStatus("error");
          }
        };

        viewer.addEventListener("load", handleLoad);
        viewer.addEventListener("error", handleError);

        cleanup = () => {
          viewer.removeEventListener("load", handleLoad);
          viewer.removeEventListener("error", handleError);
        };

        if (asset.posterSrc) {
          viewer.poster = asset.posterSrc;
        } else {
          viewer.removeAttribute("poster");
        }

        viewer.setAttribute("camera-orbit", resolvedViewerConfig.cameraOrbit);
        viewer.setAttribute("min-camera-orbit", resolvedViewerConfig.minCameraOrbit);
        viewer.setAttribute("max-camera-orbit", resolvedViewerConfig.maxCameraOrbit);
        viewer.setAttribute("interaction-prompt", resolvedViewerConfig.interactionPrompt);

        if (resolvedViewerConfig.minFieldOfView) {
          viewer.setAttribute("min-field-of-view", resolvedViewerConfig.minFieldOfView);
        } else {
          viewer.removeAttribute("min-field-of-view");
        }

        if (resolvedViewerConfig.maxFieldOfView) {
          viewer.setAttribute("max-field-of-view", resolvedViewerConfig.maxFieldOfView);
        } else {
          viewer.removeAttribute("max-field-of-view");
        }

        if (resolvedViewerConfig.autoRotate) {
          viewer.setAttribute("auto-rotate", "");
        } else {
          viewer.removeAttribute("auto-rotate");
        }

        viewer.src = asset.src;
        if (typeof viewer.load === "function") {
          viewer.load();
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    attachViewer();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [asset.id, asset.posterSrc, asset.src, resolvedViewerConfig]);

  return (
    <article className="model-card">
      <div className="section-head">
        <div>
          <p className="section-label">Virtual Experience</p>
          <h3>{asset.label}</h3>
        </div>
        <span className="status-pill subtle">{statusLabel}</span>
      </div>

      <div className="model-stage">
        <model-viewer
          key={asset.id}
          ref={viewerRef}
          poster={asset.posterSrc}
          alt={asset.label}
          camera-controls
          ar
          shadow-intensity="1"
          environment-image="neutral"
          exposure="1.05"
          className="model-viewer"
        />

        {status === "error" && asset.posterSrc ? (
          <img
            className="model-fallback"
            src={asset.posterSrc}
            alt={asset.label}
          />
        ) : null}

        {status !== "ready" ? (
          <div className="model-overlay">
            <p className="section-label">
              {status === "error" ? "Preview unavailable" : "Loading 3D preview"}
            </p>
            <p>
              {status === "error"
                ? `The model did not render in the viewer. The raw asset is still connected at ${asset.src}.`
                : `Rendering ${asset.fileName} so the concept pitch shows the imported object, not only the parcel.`}
            </p>
          </div>
        ) : null}
      </div>

      <p className="model-caption">{caption ?? project.virtualExperience}</p>
      <p className="model-meta">
        Current asset: <code>{asset.fileName}</code>
      </p>
    </article>
  );
}
