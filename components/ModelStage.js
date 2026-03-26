"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import InteriorExplorer3D from "@/components/InteriorExplorer3D";

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

async function toggleFullscreen(container, isFullscreen) {
  if (typeof document === "undefined") {
    return;
  }

  if (isFullscreen) {
    await document.exitFullscreen?.();
    return;
  }

  await container?.requestFullscreen?.();
}

function FullscreenIcon({ isFullscreen }) {
  return isFullscreen ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 4H5v4M15 4h4v4M9 20H5v-4M15 20h4v-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 3H4v5M15 3h5v5M9 21H4v-5M15 21h5v-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StandardModelStage({
  asset,
  project,
  caption,
  viewerMode = "default",
  viewerConfig,
  statusLabel = null,
  hideCaption = false,
  hideAssetMeta = false
}) {
  const viewerRef = useRef(null);
  const stageRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const resolvedViewerConfig = useMemo(
    () => getViewerConfig(viewerMode, viewerConfig),
    [viewerConfig, viewerMode]
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === stageRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

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
        {statusLabel ? <span className="status-pill subtle">{statusLabel}</span> : null}
      </div>

      <div ref={stageRef} className={`model-stage${isFullscreen ? " is-fullscreen" : ""}`}>
        <div className="viewer-toolbar">
          <button
            type="button"
            className="viewer-toolbar-button"
            onClick={() => toggleFullscreen(stageRef.current, isFullscreen)}
            aria-label={isFullscreen ? "Exit fullscreen view" : "Expand viewer"}
            title={isFullscreen ? "Exit fullscreen view" : "Expand viewer"}
          >
            <FullscreenIcon isFullscreen={isFullscreen} />
          </button>
        </div>
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

      <p className="viewer-controls-note">Drag to rotate. Scroll to zoom. Use Expand View for closer review.</p>
      {!hideCaption ? (
        <p className="model-caption">{caption ?? project.virtualExperience}</p>
      ) : null}
      {!hideAssetMeta ? (
        <p className="model-meta">
          Current asset: <code>{asset.fileName}</code>
        </p>
      ) : null}
    </article>
  );
}

export default function ModelStage(props) {
  if (props.viewerMode === "interior-navigation") {
    return (
      <InteriorExplorer3D
        asset={props.asset}
        project={props.project}
        caption={props.caption}
        statusLabel={props.statusLabel}
      />
    );
  }

  return <StandardModelStage {...props} />;
}
