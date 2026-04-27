"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ModelStage from "@/components/ModelStage";
import ProjectExplorer3D from "@/components/ProjectExplorer3D";
import { supportsFloorExplorer } from "@/lib/floor-explorer";
import { cn } from "@/lib/cn";
import {
  primaryLinkButton,
  sectionLabel,
  serifHeading,
  statLabel,
} from "@/lib/uiClasses";

const pageShellClass =
  "min-h-dvh px-7 py-7 [background:radial-gradient(circle_at_top_left,rgba(214,180,123,0.14),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(77,135,173,0.16),transparent_26%),linear-gradient(135deg,#04070c_0%,#08111b_42%,#0a1825_100%)] max-[1240px]:px-6 max-[820px]:pt-[max(16px,env(safe-area-inset-top,0px))] max-[820px]:pr-[max(16px,env(safe-area-inset-right,0px))] max-[820px]:pb-[max(16px,env(safe-area-inset-bottom,0px))] max-[820px]:pl-[max(16px,env(safe-area-inset-left,0px))]";
const heroShellClass =
  "mx-auto mb-6 grid max-w-[1480px] grid-cols-1 gap-[18px] rounded-pro-xl border border-pro-line px-7 py-[26px] shadow-pro-panel [background:radial-gradient(circle_at_top_right,rgba(214,180,123,0.16),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02)),rgba(8,14,21,0.84)] max-[1240px]:grid-cols-1 max-[820px]:px-4 max-[820px]:py-[18px]";
const projectCardClass =
  "grid content-start gap-4 overflow-hidden rounded-pro-lg border border-white/8 p-5 shadow-pro-panel [background:linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02)),rgba(255,255,255,0.02)]";
const sectionHeadClass =
  "flex items-start justify-between gap-3 max-[820px]:flex-col max-[820px]:items-start";
const statCardClass =
  "rounded-[18px] border border-white/8 p-[14px] [background:linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02)),rgba(255,255,255,0.02)]";
const assetSwitchButtonClass =
  "rounded-full border border-white/12 bg-white/[0.03] px-[14px] py-[10px] text-pro-text-soft transition duration-200 ease-out hover:-translate-y-px hover:border-[rgba(241,211,161,0.24)] hover:text-pro-text";
const assetSwitchButtonActiveClass =
  "border-[rgba(241,211,161,0.36)] text-pro-gold-bright [background:linear-gradient(180deg,rgba(214,180,123,0.12),rgba(214,180,123,0.05)),rgba(255,255,255,0.04)]";

function ProjectRenderGallery({ images = [] }) {
  if (!images.length) {
    return null;
  }

  return (
    <article className={cn(projectCardClass, "project-detail-card")}>
      <div className={sectionHeadClass}>
        <div className="min-w-0">
          <p className={sectionLabel}>Project Renders</p>
          <h3 className={cn(serifHeading, "text-[1.05rem]")}>
            Visual reference set
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 max-[820px]:grid-cols-1">
        {images.map((image) => (
          <figure
            key={image.src}
            className="m-0 overflow-hidden rounded-[18px] border border-white/8 bg-white/3"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="block aspect-4/5 w-full object-cover"
              loading="lazy"
            />
            {image.caption ? (
              <figcaption className="px-4 py-3 text-[0.82rem] leading-[1.45] text-pro-text-soft">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </article>
  );
}

function ProjectExperienceDescription({ project }) {
  if (!project.memo && !project.thesis) {
    return null;
  }

  return (
    <div className="project-experience-description">
      <p className="experience-description-label">
        About this project
      </p>
      {project.memo ? <p className="detail-copy">{project.memo}</p> : null}
      {project.thesis ? (
        <p className="experience-description-thesis">{project.thesis}</p>
      ) : null}
    </div>
  );
}

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
  const [showInline2DView, setShowInline2DView] = useState(false);

  useEffect(() => {
    setActiveAssetKey(preferredAssetKey);
  }, [preferredAssetKey]);

  useEffect(() => {
    setShowInline2DView(false);
  }, [activeAssetKey]);

  const selectedUnit = useMemo(
    () =>
      project.fullProjectFlow?.unitAssets?.find((entry) => entry.id === activeAssetKey) ?? null,
    [activeAssetKey, project.fullProjectFlow?.unitAssets]
  );
  const selectedAsset =
    activeAssetKey === "building" ? asset : unitAssetMap.get(activeAssetKey) ?? asset;
  const selectedCaption =
    activeAssetKey === "building" ? null : selectedUnit?.copy;
  const selectedViewerMode = selectedAsset?.viewerMode;
  const selectedViewerConfig = selectedAsset?.viewerConfig;
  const selectedStatusLabel =
    selectedAsset?.viewerLabel ??
    (activeAssetKey === "building" ? "AR Ready" : "Interior Navigation");
  const show2DViewButton = ["tirana-signature-residences", "prishtina-prime-offices"].includes(
    project.id
  );
  const inline2DExperienceProject =
    show2DViewButton && (!separateFilesFlow || activeAssetKey === "building") ? project : null;
  const modelStage2DProps =
    inline2DExperienceProject !== null
      ? {
          inline2DProject: inline2DExperienceProject,
          showInline2DExperience: showInline2DView,
          onToggleInline2DExperience: setShowInline2DView
        }
      : {};

  useEffect(() => {
    if (!inline2DExperienceProject) {
      setShowInline2DView(false);
    }
  }, [inline2DExperienceProject]);
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
    <main className={cn(pageShellClass, "project-page-shell max-[820px]:px-[8px] max-[820px]:py-[10px]")}>
      <section
        className={cn(
          heroShellClass,
          "project-page-hero max-[820px]:mb-4 max-[820px]:gap-3 max-[820px]:rounded-[28px] max-[820px]:px-[20px] max-[820px]:py-[18px]",
        )}
      >
        <div className="project-hero-copy max-w-2xl">
          <Link
            href="/"
            className="project-back-eyebrow-link text-[0.72rem] font-bold uppercase tracking-[0.16em]"
          >
            {`< Back to market view`}
          </Link>
          <h1
            className={cn(
              serifHeading,
              "text-[clamp(1.45rem,2.4vw,2.15rem)] leading-[1.1] tracking-[0.015em] wrap-break-word whitespace-normal max-[820px]:text-[clamp(1.8rem,8vw,2.2rem)] max-[820px]:leading-[1.04]",
            )}
          >
            {project.name}
          </h1>
          <p className="project-lead text-pro-text-soft leading-[1.58] max-[820px]:text-[0.99rem]">
            {project.stageSummary}
          </p>
        </div>
      </section>

      <section className="project-page-grid max-[820px]:gap-4">
        <div className="project-main-column">
          {hasFloorExplorer ? (
            <>
              <ProjectExplorer3D asset={asset} project={project} />
              <ProjectExperienceDescription project={project} />
            </>
          ) : (
            <div
              className={cn(
                projectCardClass,
                "project-detail-card project-preview-card gap-[18px] max-[820px]:rounded-[22px] max-[820px]:p-[14px]",
              )}
            >
              <div className="section-head min-w-0 w-full">
                <div className="min-w-0">
                  <p className={sectionLabel}>Project Preview</p>
                  <h3 className={cn(serifHeading, "text-[1.05rem]")}>
                    Exterior review
                  </h3>
                </div>
                {show2DViewButton ? (
                  <button
                    type="button"
                    className={cn(
                      primaryLinkButton,
                      "project-preview-2d-button shrink-0 border-[rgba(205,178,128,0.42)] bg-[rgba(119,103,71,0.18)] px-[14px] py-[8px] text-[0.76rem] min-h-[34px] text-pro-text max-[820px]:px-[14px] max-[820px]:py-[8px] max-[820px]:text-[0.76rem] max-[820px]:tracking-[0.08em]",
                      showInline2DView && "is-active shadow-[0_0_0_1px_rgba(241,211,161,0.35)]",
                    )}
                    aria-pressed={showInline2DView}
                    disabled={!inline2DExperienceProject}
                    title={
                      !inline2DExperienceProject
                        ? "Select Whole Building to use the 2D elevation in this panel."
                        : undefined
                    }
                    onClick={() => setShowInline2DView((open) => !open)}
                  >
                    {showInline2DView ? "3D VIEW" : "2D VIEW"}
                  </button>
                ) : null}
              </div>
              {separateFilesFlow ? (
                <div className="grid gap-4">
                  <div
                    className="flex flex-wrap gap-[10px]"
                    role="tablist"
                    aria-label="Building and interior files"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeAssetKey === "building"}
                      className={cn(
                        assetSwitchButtonClass,
                        activeAssetKey === "building" &&
                          assetSwitchButtonActiveClass,
                      )}
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
                        className={cn(
                          assetSwitchButtonClass,
                          activeAssetKey === unit.id &&
                            assetSwitchButtonActiveClass,
                        )}
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
                    hideCaption={activeAssetKey === "building"}
                    hideAssetMeta
                    {...modelStage2DProps}
                  />
                  <ProjectExperienceDescription project={project} />
                  <ProjectRenderGallery images={project.galleryImages} />
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
                    hideAssetMeta
                    {...modelStage2DProps}
                  />
                  <ProjectExperienceDescription project={project} />
                  <ProjectRenderGallery images={project.galleryImages} />
                </>
              ) : (
                <>
                  <ModelStage
                    asset={asset}
                    project={project}
                    hideCaption
                    hideAssetMeta
                    {...modelStage2DProps}
                  />
                  <ProjectExperienceDescription project={project} />
                  <ProjectRenderGallery images={project.galleryImages} />
                </>
              )}
            </div>
          )}
        </div>

        <aside className="project-side-column">
          <article className={cn(projectCardClass, "project-detail-card")}>
            <div className={sectionHeadClass}>
              <div className="min-w-0">
                <p className={sectionLabel}>Capital Snapshot</p>
                <h3 className={cn(serifHeading, "text-[1.05rem]")}>
                  Headline terms
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 max-[820px]:grid-cols-1">
              {project.projectFacts?.project ? (
                <article className={statCardClass}>
                  <span className={statLabel}>Project</span>
                  <strong className="mt-2 block text-base">{project.projectFacts.project}</strong>
                </article>
              ) : null}
              {project.projectFacts?.investor ? (
                <article className={statCardClass}>
                  <span className={statLabel}>Investor</span>
                  <strong className="mt-2 block text-base">{project.projectFacts.investor}</strong>
                </article>
              ) : null}
              <article className={statCardClass}>
                <span className={statLabel}>Target ROI</span>
                <strong className="mt-2 block text-base">{project.roi}</strong>
              </article>
              <article className={statCardClass}>
                <span className={statLabel}>Funding Ask</span>
                <strong className="mt-2 block text-base">{project.ticket}</strong>
              </article>
              <article className={statCardClass}>
                <span className={statLabel}>Program</span>
                <strong className="mt-2 block text-base">{project.program}</strong>
              </article>
              <article className={statCardClass}>
                <span className={statLabel}>Access</span>
                <strong className="mt-2 block text-base">{project.access}</strong>
              </article>
              {project.projectFacts?.area ? (
                <article className={statCardClass}>
                  <span className={statLabel}>Area</span>
                  <strong className="mt-2 block text-base">{project.projectFacts.area}</strong>
                </article>
              ) : null}
            </div>
          </article>

          <article className={cn(projectCardClass, "project-detail-card")}>
            <div className={sectionHeadClass}>
              <div className="min-w-0">
                <p className={sectionLabel}>Project Timeline</p>
                <h3 className={cn(serifHeading, "text-[1.05rem]")}>
                  Execution path
                </h3>
              </div>
            </div>
            <div className="grid gap-[14px]">
              {project.timeline.map((step) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-[18px] border border-white/8 bg-white/3 px-[18px] py-4"
                >
                  <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-pro-gold-bright shadow-[0_0_18px_rgba(241,211,161,0.42)]" />
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
