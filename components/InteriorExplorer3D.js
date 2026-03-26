"use client";

import { useEffect, useRef, useState } from "react";
import { useGltfOrbitViewer } from "@/components/useGltfOrbitViewer";

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

export default function InteriorExplorer3D({
  asset,
  project,
  caption,
  statusLabel = "Interior Navigation"
}) {
  const stageContainerRef = useRef(null);
  const stageShellRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const status = useGltfOrbitViewer(asset, stageShellRef, "interior", {
    autoRotate: false
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === stageContainerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <article className="model-card interior-model-card">
      <div className="section-head">
        <div>
          <p className="section-label">Virtual Experience</p>
          <h3>{asset.label}</h3>
        </div>
        <span className="status-pill subtle">{statusLabel}</span>
      </div>

      <div
        ref={stageContainerRef}
        className={`model-stage interior-model-stage${isFullscreen ? " is-fullscreen" : ""}`}
      >
        <div className="viewer-toolbar">
          <button
            type="button"
            className="viewer-toolbar-button"
            onClick={() => toggleFullscreen(stageContainerRef.current, isFullscreen)}
            aria-label={isFullscreen ? "Exit fullscreen view" : "Expand viewer"}
            title={isFullscreen ? "Exit fullscreen view" : "Expand viewer"}
          >
            <FullscreenIcon isFullscreen={isFullscreen} />
          </button>
        </div>
        <div ref={stageShellRef} className="three-model-shell" />

        {status !== "ready" ? (
          <div className="model-overlay">
            <p className="section-label">
              {status === "error" ? "Preview unavailable" : "Loading interior explorer"}
            </p>
            <p>
              {status === "error"
                ? `The interior explorer could not render. The raw asset remains available at ${asset.src}.`
                : `Preparing ${asset.fileName} for a closer interior walkthrough.`}
            </p>
          </div>
        ) : null}
      </div>

      <p className="interior-viewer-note">Drag to look around. Scroll to move deeper. Right-drag to pan.</p>
      <p className="model-caption">{caption ?? project.virtualExperience}</p>
      <p className="model-meta">
        Current asset: <code>{asset.fileName}</code>
      </p>
    </article>
  );
}
