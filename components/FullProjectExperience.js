"use client";

import Link from "next/link";
import ModelStage from "@/components/ModelStage";
import ProjectExplorer3D from "@/components/ProjectExplorer3D";
import { supportsFloorExplorer } from "@/lib/floor-explorer";

export default function FullProjectExperience({ project, asset }) {
  const hasFloorExplorer = supportsFloorExplorer(project, asset);

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
            <div className="project-detail-card">
              <div className="section-head">
                <div>
                  <p className="section-label">Project Preview</p>
                  <h3>Exterior review</h3>
                </div>
              </div>
              <ModelStage asset={asset} project={project} />
              <p className="detail-copy compact">
                This project currently opens with an exterior-only model review.
                Floor-by-floor exploration can be added once a structured building
                asset is available.
              </p>
            </div>
          )}

          <article className="project-detail-card">
            <div className="section-head">
              <div>
                <p className="section-label">Investment Memo</p>
                <h3>Main project narrative</h3>
              </div>
            </div>
            <div className="project-copy-stack">
              <p className="detail-copy compact">{project.memo}</p>
              <p className="detail-copy compact">{project.thesis}</p>
              <p className="detail-copy compact">{project.narrative}</p>
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
