"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGltfOrbitViewer } from "@/components/useGltfOrbitViewer";
import { cn } from "@/lib/cn";
import {
  primaryLinkButton,
  sectionLabel,
  serifHeading,
} from "@/lib/uiClasses";

const modelCardClass =
  "model-card grid gap-[18px] rounded-[20px] border border-white/8 p-[18px] [background:linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02)),rgba(255,255,255,0.02)] max-[820px]:rounded-[20px] max-[820px]:px-[14px] max-[820px]:py-[14px]";
const stageClass =
  "model-stage interior-model-stage relative mt-4 min-h-[420px] overflow-hidden rounded-[22px] border border-white/8 [background:linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02)),#08121d] max-[820px]:mt-3 max-[820px]:min-h-[190px] max-[820px]:rounded-[20px]";
const toolbarButtonClass =
  "inline-flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[rgba(241,211,161,0.24)] bg-[rgba(8,14,21,0.72)] text-pro-text backdrop-blur-[12px] transition duration-200 ease-out hover:-translate-y-px hover:border-[rgba(241,211,161,0.34)] hover:text-pro-gold-bright max-[820px]:h-11 max-[820px]:w-11";
const statusPillClass =
  "inline-flex items-center justify-center rounded-full border border-white/8 bg-[rgba(255,255,255,0.06)] px-[14px] py-[8px] text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[rgba(224,225,229,0.9)]";

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
  statusLabel = "Interior Navigation",
  hideCaption = false,
  hideAssetMeta = false,
  fullProjectHref = null
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
    <article className={modelCardClass}>
      <div className="grid gap-[10px]">
        <div className="flex items-center justify-between gap-3">
          <p className={sectionLabel}>Virtual Experience</p>
          <span className={statusPillClass}>{statusLabel}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={cn(serifHeading, "text-[1.05rem] leading-[1.16] max-[820px]:text-[1.08rem]")}>
              {asset.label}
            </h3>
          </div>
          {fullProjectHref ? (
            <div className="flex shrink-0 items-start">
              <Link
                href={fullProjectHref}
                className={cn(
                  primaryLinkButton,
                  "px-3 py-[7px] text-[0.62rem] tracking-[0.07em] whitespace-nowrap max-[480px]:w-full max-[480px]:justify-center",
                )}
              >
                View Full Project
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <div
        ref={stageContainerRef}
        className={cn(
          stageClass,
          isFullscreen && "is-fullscreen min-h-dvh rounded-none border-0",
        )}
      >
        <div className="absolute top-[14px] right-[14px] z-2 flex gap-[10px] max-[820px]:top-[10px] max-[820px]:right-[10px]">
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => toggleFullscreen(stageContainerRef.current, isFullscreen)}
            aria-label={isFullscreen ? "Exit fullscreen view" : "Expand viewer"}
            title={isFullscreen ? "Exit fullscreen view" : "Expand viewer"}
          >
            <span className="block h-[18px] w-[18px]">
              <FullscreenIcon isFullscreen={isFullscreen} />
            </span>
          </button>
        </div>
        <div ref={stageShellRef} className="three-model-shell" />

        {status !== "ready" ? (
          <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/8 bg-[rgba(8,14,21,0.78)] px-4 py-[14px] backdrop-blur-[14px]">
            <p className={sectionLabel}>
              {status === "error" ? "Preview unavailable" : "Loading interior explorer"}
            </p>
            <p className="mt-2 text-pro-text-soft leading-[1.55]">
              {status === "error"
                ? `The interior explorer could not render. The raw asset remains available at ${asset.src}.`
                : `Preparing ${asset.fileName} for a closer interior walkthrough.`}
            </p>
          </div>
        ) : null}
      </div>

      <p className="m-0 text-[0.82rem] tracking-[0.03em] text-pro-gold-bright">
        Drag to look around. Scroll to move deeper. Right-drag to pan.
      </p>
      {!hideCaption ? (
        <p className="mt-[14px] text-pro-text-soft leading-[1.55]">
          {caption ?? project.virtualExperience}
        </p>
      ) : null}
      {!hideAssetMeta ? (
        <p className="mt-[10px] text-[0.84rem] text-pro-text-faint">
          Current asset: <code className="font-mono text-pro-gold-bright">{asset.fileName}</code>
        </p>
      ) : null}
    </article>
  );
}
