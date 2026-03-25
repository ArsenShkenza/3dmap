"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ModelStage from "@/components/ModelStage";
import ProjectExplorer3D from "@/components/ProjectExplorer3D";
import { supportsFloorExplorer } from "@/lib/floor-explorer";

export default function FullProjectExperience({
  project,
  asset,
  apartmentAssets = [],
  initialAssetKey = "building"
}) {
  const hasFloorExplorer = supportsFloorExplorer(project, asset);
  const separateFilesFlow = project.fullProjectFlow?.type === "separate-files";
  const integratedBuildingFlow = project.fullProjectFlow?.type === "integrated-building";
  const unitAssetMap = useMemo(
    () => new Map(apartmentAssets.map((entry) => [entry.id, entry.asset])),
    [apartmentAssets]
  );
  const availableAssetKeys = useMemo(
    () => new Set(["building", ...(project.fullProjectFlow?.unitAssets?.map((unit) => unit.id) ?? [])]),
    [project.fullProjectFlow?.unitAssets]
  );
  const preferredAssetKey =
    separateFilesFlow && initialAssetKey && availableAssetKeys.has(initialAssetKey)
      ? initialAssetKey
      : "building";
  const [activeAssetKey, setActiveAssetKey] = useState(preferredAssetKey);

  useEffect(() => {
    setActiveAssetKey(preferredAssetKey);
  }, [preferredAssetKey]);

  const selectedUnit = useMemo(
    () =>
      project.fullProjectFlow?.unitAssets?.find((entry) => entry.id === activeAssetKey) ?? null,
    [activeAssetKey, project.fullProjectFlow?.unitAssets]
  );
  const selectedAsset =
    activeAssetKey === "building" ? asset : unitAssetMap.get(activeAssetKey) ?? asset;
  const selectedCaption =
    activeAssetKey === "building"
      ? project.fullProjectFlow?.overviewCopy ??
        "Review the whole building first, then switch into separate apartment files."
      : selectedUnit?.copy;
  const selectedViewerMode = selectedAsset?.viewerMode;
  const selectedViewerConfig = selectedAsset?.viewerConfig;
  const selectedStatusLabel =
    selectedAsset?.viewerLabel ??
    (activeAssetKey === "building" ? "AR Ready" : "Interior Navigation");
  const handleAssetSelection = (nextAssetKey) => {
    setActiveAssetKey(nextAssetKey);

    if (typeof window !== "undefined") {
      const nextParams = new URLSearchParams(window.location.search);
      if (nextAssetKey === "building") {
        nextParams.delete("asset");
      } else {
        nextParams.set("asset", nextAssetKey);
      }

      const nextQuery = nextParams.toString();
      const nextUrl = nextQuery
        ? `${window.location.pathname}?${nextQuery}`
        : window.location.pathname;

      window.history.replaceState(null, "", nextUrl);
    }
  };

  return (
    <main className="project-page-shell">
      <section className="project-page-hero">
        <div className="project-hero-copy">
          <p className="eyebrow">Full Project Room</p>
          <h1>{project.name}</h1>
          <p className="lead project-lead">{project.stageSummary}</p>
        </div>
        <div className="project-hero-actions">
          <Link href="/" className="ghost-link-button">
            Back To Market View
          </Link>
          <span className="status-pill">{project.stage}</span>
        </div>
      </section>

      <section className="project-page-grid">
        <div className="project-main-column">
          {hasFloorExplorer ? (
            <ProjectExplorer3D asset={asset} project={project} />
          ) : (
            <div className="project-detail-card project-preview-card">
              <div className="section-head">
                <div>
                  <p className="section-label">Project Preview</p>
                  <h3>Exterior review</h3>
                </div>
              </div>
              {separateFilesFlow ? (
                <div className="asset-switch-stack">
                  <div className="asset-switch-row" role="tablist" aria-label="Building and interior files">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeAssetKey === "building"}
                      className={`asset-switch-button${
                        activeAssetKey === "building" ? " active" : ""
                      }`}
                      onClick={() => handleAssetSelection("building")}
                    >
                      Whole Building
                    </button>
                    {project.fullProjectFlow?.unitAssets?.map((unit) => (
                      <button
                        key={unit.id}
                        type="button"
                        role="tab"
                        aria-selected={activeAssetKey === unit.id}
                        className={`asset-switch-button${
                          activeAssetKey === unit.id ? " active" : ""
                        }`}
                        onClick={() => handleAssetSelection(unit.id)}
                      >
                        {unit.label}
                      </button>
                    ))}
                  </div>

                  <ModelStage
                    asset={selectedAsset}
                    project={project}
                    caption={selectedCaption}
                    viewerMode={selectedViewerMode}
                    viewerConfig={selectedViewerConfig}
                    statusLabel={selectedStatusLabel}
                  />
                </div>
              ) : integratedBuildingFlow ? (
                <>
                  <ModelStage
                    asset={asset}
                    project={project}
                    viewerMode={project.fullProjectFlow?.viewerMode}
                    viewerConfig={project.fullProjectFlow?.viewerConfig}
                    statusLabel={project.fullProjectFlow?.viewerLabel ?? "Interior Navigation"}
                    caption={
                      project.fullProjectFlow?.viewerCopy ??
                      project.fullProjectFlow?.overviewCopy ??
                      "Use the integrated building file for a single exterior-plus-interior project review."
                    }
                  />
                  <p className="detail-copy compact">
                    This project now uses one authored GLB that carries both the exterior identity and
                    the interior atmosphere in the same review object. The map remains exterior-first;
                    the detailed project room is where the integrated building model is explored.
                  </p>
                </>
              ) : (
                <>
                  <ModelStage asset={asset} project={project} />
                  <p className="detail-copy compact">
                    This project currently opens with an exterior-only model review.
                    Floor-by-floor exploration is reserved for a structured building
                    GLB with authored floor groups.
                  </p>
                </>
              )}
            </div>
          )}

          <article className="project-detail-card project-memo-card">
            <div className="section-head">
              <div>
                <p className="section-label">Investment Memo</p>
                <h3>Main project narrative</h3>
              </div>
            </div>
            <div className="memo-grid">
              <article className="memo-block">
                <p className="memo-block-label">Investment Case</p>
                <p className="detail-copy compact">{project.memo}</p>
              </article>
              <article className="memo-block">
                <p className="memo-block-label">Why This Project</p>
                <p className="detail-copy compact">{project.thesis}</p>
              </article>
              <article className="memo-block">
                <p className="memo-block-label">Pitch Direction</p>
                <p className="detail-copy compact">{project.narrative}</p>
              </article>
            </div>
          </article>
        </div>

        <aside className="project-side-column">
          <article className="project-detail-card">
            <div className="section-head">
              <div>
                <p className="section-label">Capital Snapshot</p>
                <h3>Headline terms</h3>
              </div>
            </div>
            <div className="detail-stats project-stats">
              <article>
                <span className="stat-label">Target ROI</span>
                <strong>{project.roi}</strong>
              </article>
              <article>
                <span className="stat-label">Funding Ask</span>
                <strong>{project.ticket}</strong>
              </article>
              <article>
                <span className="stat-label">Program</span>
                <strong>{project.program}</strong>
              </article>
              <article>
                <span className="stat-label">Access</span>
                <strong>{project.access}</strong>
              </article>
            </div>
          </article>

          <article className="project-detail-card">
            <div className="section-head">
              <div>
                <p className="section-label">Diligence</p>
                <h3>What the room should answer</h3>
              </div>
            </div>
            <div className="project-info-list">
              <div>
                <span className="stat-label">Sponsor</span>
                <strong>{project.sponsor}</strong>
              </div>
              <div>
                <span className="stat-label">Land / Asset</span>
                <strong>{project.landSize}</strong>
              </div>
              <div>
                <span className="stat-label">Diligence Pack</span>
                <strong>{project.diligence}</strong>
              </div>
            </div>
          </article>

          <article className="project-detail-card">
            <div className="section-head">
              <div>
                <p className="section-label">Project Timeline</p>
                <h3>Execution path</h3>
              </div>
            </div>
            <div className="project-timeline-list">
              {project.timeline.map((step) => (
                <div key={step} className="project-timeline-item">
                  <span className="timeline-dot" />
                  <strong>{step}</strong>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}
