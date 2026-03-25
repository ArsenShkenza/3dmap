"use client";

import { useEffect, useRef, useState } from "react";

export default function ModelStage({ asset, project }) {
  const viewerRef = useRef(null);
  const [status, setStatus] = useState("loading");

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

        viewer.poster = asset.posterSrc;
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
  }, [asset.id, asset.posterSrc, asset.src]);

  return (
    <article className="model-card">
      <div className="section-head">
        <div>
          <p className="section-label">Virtual Experience</p>
          <h3>{asset.label}</h3>
        </div>
        <span className="status-pill subtle">AR Ready</span>
      </div>

      <div className="model-stage">
        <model-viewer
          key={asset.id}
          ref={viewerRef}
          poster={asset.posterSrc}
          alt={asset.label}
          camera-controls
          auto-rotate
          ar
          shadow-intensity="1"
          environment-image="neutral"
          exposure="1.05"
          interaction-prompt="auto"
          camera-orbit="-35deg 68deg 130%"
          min-camera-orbit="auto 35deg auto"
          max-camera-orbit="auto 88deg auto"
          className="model-viewer"
        />

        {status === "error" ? (
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

      <p className="model-caption">{project.virtualExperience}</p>
      <p className="model-meta">
        Current asset: <code>{asset.fileName}</code>
      </p>
    </article>
  );
}
