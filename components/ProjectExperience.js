"use client";

import Link from "next/link";
import { markSplashDismissedForSession } from "@/components/SplashGate";
import { ProjectFloorElevationBlock } from "@/components/ProjectFloorElevationBlock";
import { cn } from "@/lib/cn";
import {
  detailCard,
  ghostLinkButton,
  sectionLabel,
  serifHeading,
} from "@/lib/uiClasses";

export default function ProjectExperience({ project }) {
  return (
    <section className="experience-page">
      <div className="experience-backdrop" />

      <div className="experience-shell w-(--experience-content-width) max-w-full rounded-[32px] border border-white/8 px-6 py-6 shadow-[0_30px_90px_rgba(0,0,0,0.34)] [background:linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02)),rgba(7,14,22,0.88)] max-[820px]:m-[12px_auto_16px] max-[820px]:w-full max-[820px]:rounded-[22px] max-[820px]:p-4">
        <header className="flex items-center justify-between gap-4">
          <Link
            className={cn(ghostLinkButton, "px-[14px] py-[10px] no-underline")}
            href={`/?project=${project.id}`}
            onClick={markSplashDismissedForSession}
          >
            Back To Map
          </Link>
          <p className="m-0 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-[rgba(227,207,176,0.72)]">
            Project Experience
          </p>
        </header>

        <section className="mt-6">
          <div className="max-w-[820px]">
            <h1 className={cn(serifHeading, "text-[clamp(2.4rem,4.2vw,3.7rem)] leading-[0.94] tracking-[0.02em] whitespace-nowrap max-[820px]:whitespace-normal")}>
              {project.name}
            </h1>
            <p className="m-[14px_0_22px] text-pro-text-soft leading-[1.55]">
              {project.city} • {project.district}
            </p>
            <p className="text-pro-text-soft leading-[1.55]">
              {project.stageSummary}
            </p>

            <div className="mt-[18px]">
              <article className={cn(detailCard, "rounded-[18px] px-[14px] py-3 shadow-[0_18px_40px_rgba(0,0,0,0.18)] [background:linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015)),rgba(7,12,19,0.55)]")}>
                <div className="grid grid-cols-4 gap-[10px] max-[980px]:grid-cols-2 max-[820px]:grid-cols-1">
                  <div className="min-w-0">
                    <p className="m-0 mb-[6px] text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-[rgba(227,207,176,0.72)]">
                      Access
                    </p>
                    <strong className="block text-[0.92rem] font-semibold leading-[1.2] text-[rgba(247,240,228,0.92)]">
                      {project.access}
                    </strong>
                  </div>
                  <div className="min-w-0">
                    <p className="m-0 mb-[6px] text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-[rgba(227,207,176,0.72)]">
                      Category
                    </p>
                    <strong className="block text-[0.92rem] font-semibold leading-[1.2] text-[rgba(247,240,228,0.92)]">
                      {project.categoryLabel}
                    </strong>
                  </div>
                  <div className="min-w-0">
                    <p className="m-0 mb-[6px] text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-[rgba(227,207,176,0.72)]">
                      ROI
                    </p>
                    <strong className="block text-[0.92rem] font-semibold leading-[1.2] text-[rgba(247,240,228,0.92)]">
                      {project.roi}
                    </strong>
                  </div>
                  <div className="min-w-0">
                    <p className="m-0 mb-[6px] text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-[rgba(227,207,176,0.72)]">
                      Stage
                    </p>
                    <strong className="block text-[0.92rem] font-semibold leading-[1.2] text-[rgba(247,240,228,0.92)]">
                      {project.stage}
                    </strong>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>

      <ProjectFloorElevationBlock project={project} embedded={false} />
    </section>
  );
}
