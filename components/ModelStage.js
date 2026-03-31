"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import InteriorExplorer3D from "@/components/InteriorExplorer3D";
import { ProjectFloorElevationBlock } from "@/components/ProjectFloorElevationBlock";
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

function Model3DIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9m9-13.5-9 5.25m0 0 9 5.25M12 12.75 3 7.5m9 5.25v9l-9 5.25M9 18l-6-3.375v-9"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StandardModelStageGltf({
  asset,
  project,
  caption,
  statusLabel = null,
  hideCaption = false,
  hideAssetMeta = false,
  fullProjectHref = null
}) {
  const stageRef = useRef(null);
  const stageShellRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const status = useGltfOrbitViewer(asset, stageShellRef, "exterior", {
    autoRotate: true
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === stageRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <article className="model-card">
      <div className="section-head">
        <div>
          <p className="section-label">Virtual Experience</p>
          <h3>{asset.label}</h3>
        </div>
        {statusLabel || fullProjectHref ? (
          <div className="model-card-head-end">
            {fullProjectHref ? (
              <Link
                href={fullProjectHref}
                className="primary-link-button model-card-full-project-link"
              >
                View Full Project
              </Link>
            ) : null}
            {statusLabel ? (
              <span className="status-pill subtle">{statusLabel}</span>
            ) : null}
          </div>
        ) : null}
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
        <div ref={stageShellRef} className="three-model-shell" />

        {status === "error" && asset.posterSrc ? (
          <img className="model-fallback" src={asset.posterSrc} alt={asset.label} />
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

function StandardModelStage({
  asset,
  project,
  caption,
  statusLabel = null,
  hideCaption = false,
  hideAssetMeta = false,
  fullProjectHref = null,
  inline2DProject = null,
  showInline2DExperience = false,
  onToggleInline2DExperience = () => {}
}) {
  const stageRef = useRef(null);

  if (inline2DProject && showInline2DExperience) {
    return (
      <article className="model-card">
        <div className="section-head">
          <div>
            <p className="section-label">Virtual Experience</p>
            <h3>{asset.label}</h3>
          </div>
          {statusLabel || fullProjectHref ? (
            <div className="model-card-head-end">
              {fullProjectHref ? (
                <Link
                  href={fullProjectHref}
                  className="primary-link-button model-card-full-project-link"
                >
                  View Full Project
                </Link>
              ) : null}
              {statusLabel ? (
                <span className="status-pill subtle">{statusLabel}</span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div ref={stageRef} className="model-stage">
          <div className="viewer-toolbar">
            <button
              type="button"
              className="viewer-toolbar-button"
              onClick={() => onToggleInline2DExperience(false)}
              aria-label="Show 3D model"
              title="Show 3D model"
            >
              <Model3DIcon />
            </button>
          </div>
          <div className="three-model-shell project-floor-elevation-shell">
            <ProjectFloorElevationBlock project={inline2DProject} embedded />
          </div>
        </div>

        <p className="viewer-controls-note">
          2D elevation: use the floor controls beside the tower. Click a floor to open plans.
        </p>
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

  return (
    <StandardModelStageGltf
      asset={asset}
      project={project}
      caption={caption}
      statusLabel={statusLabel}
      hideCaption={hideCaption}
      hideAssetMeta={hideAssetMeta}
      fullProjectHref={fullProjectHref}
    />
  );
}

export default function ModelStage(props) {
  const showInline2D =
    props.inline2DProject != null && props.showInline2DExperience;

  /* Inline 2D elevation must win over interior-navigation (e.g. Tirana integrated-building). */
  if (showInline2D) {
    return <StandardModelStage {...props} />;
  }

  if (props.viewerMode === "interior-navigation") {
    return (
      <InteriorExplorer3D
        asset={props.asset}
        project={props.project}
        caption={props.caption}
        statusLabel={props.statusLabel}
        hideCaption={props.hideCaption}
        hideAssetMeta={props.hideAssetMeta}
        fullProjectHref={props.fullProjectHref}
      />
    );
  }

  return <StandardModelStage {...props} />;
}
