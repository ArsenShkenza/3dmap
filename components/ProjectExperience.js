"use client";

import Link from "next/link";
import { markSplashDismissedForSession } from "@/components/SplashGate";
import { ProjectFloorElevationBlock } from "@/components/ProjectFloorElevationBlock";

export default function ProjectExperience({ project }) {
  return (
    <section className="experience-page">
      <div className="experience-backdrop" />

      <div className="experience-shell">
        <header className="experience-header">
          <Link
            className="ghost-button experience-back-link"
            href={`/?project=${project.id}`}
            onClick={markSplashDismissedForSession}
          >
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

            <div className="experience-stats">
              <article className="detail-card experience-stats-card">
                <div className="experience-stats-grid">
                  <div className="experience-stat">
                    <p className="status-label">Access</p>
                    <strong>{project.access}</strong>
                  </div>
                  <div className="experience-stat">
                    <p className="status-label">Category</p>
                    <strong>{project.categoryLabel}</strong>
                  </div>
                  <div className="experience-stat">
                    <p className="status-label">ROI</p>
                    <strong>{project.roi}</strong>
                  </div>
                  <div className="experience-stat">
                    <p className="status-label">Stage</p>
                    <strong>{project.stage}</strong>
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
