"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import AssetVault from "@/components/AssetVault";
import MapExperience from "@/components/MapExperience";
import ModelStage from "@/components/ModelStage";

function matchesQuery(project, query) {
  if (!query) {
    return true;
  }

  const haystack = [
    project.name,
    project.city,
    project.district,
    project.categoryLabel,
    project.access,
    project.stage,
    project.memo,
    project.thesis,
    ...project.searchTerms
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export default function ExperienceShell({
  assetLibrary,
  categories,
  projects,
  prompts,
  initialProjectId
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(
    initialProjectId ?? projects[0]?.id ?? null
  );
  const [selectedAssetId, setSelectedAssetId] = useState(
    projects[0]?.primaryAssetId ?? assetLibrary[0]?.id ?? null
  );
  const deferredQuery = useDeferredValue(query);
  const mappedAssetCount = assetLibrary.filter(
    (asset) => asset.assignedProjectId
  ).length;

  const filteredProjects = projects.filter((project) => {
    const categoryMatch =
      activeCategory === "all" || project.categoryId === activeCategory;
    return categoryMatch && matchesQuery(project, deferredQuery);
  });

  useEffect(() => {
    if (!filteredProjects.length) {
      return;
    }

    const selectedStillVisible = filteredProjects.some(
      (project) => project.id === selectedId
    );

    if (!selectedStillVisible) {
      setSelectedId(filteredProjects[0].id);
    }
  }, [filteredProjects, selectedId]);

  const selectedProject =
    filteredProjects.find((project) => project.id === selectedId) ??
    projects.find((project) => project.id === selectedId) ??
    projects[0];
  const selectedAsset =
    assetLibrary.find((asset) => asset.id === selectedAssetId) ??
    assetLibrary.find((asset) => asset.id === selectedProject.primaryAssetId) ??
    assetLibrary[0];

  useEffect(() => {
    setSelectedAssetId(selectedProject.primaryAssetId);
  }, [selectedProject.primaryAssetId]);

  const openProjectInNewTab = (projectId) => {
    if (!projectId || typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    url.pathname = `/experience/${projectId}`;
    url.search = "";
    url.hash = "";
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  const handlePrompt = (value) => {
    startTransition(() => {
      setQuery(value);
      setActiveCategory("all");
    });
  };

  const handleSelectAsset = (asset) => {
    setSelectedAssetId(asset.id);
    if (asset.assignedProjectId) {
      setActiveCategory("all");
      setQuery("");
      setSelectedId(asset.assignedProjectId);
    }
  };

  return (
    <main className="page-shell">
      <section className="panel-shell">
        <div className="panel-top">
          <div className="brand-block">
            <p className="eyebrow">Invitation-Only Investment Intelligence</p>
            <div className="brand-row">
              <div>
                <h1>PRO X</h1>
                <p className="lead">
                  A cinematic capital-raising surface for premium real estate
                  opportunities, built to feel closer to private banking than a
                  local property portal.
                </p>
              </div>
              <div className="brand-badge">
                <span>{mappedAssetCount} mapped opportunities</span>
                <strong>{assetLibrary.length} imported 3D assets</strong>
              </div>
            </div>
          </div>

          <div className="control-card">
            <div className="control-section">
              <div>
                <p className="section-label">AI Omni-Search</p>
                <h2>Start with a natural-language investor ask.</h2>
              </div>
              <label className="search-input">
                <span className="sr-only">Search deals</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Find permit-ready resort land on the south coast"
                />
              </label>
              <div className="prompt-row">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    className="chip-button"
                    type="button"
                    onClick={() => handlePrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-section">
              <div className="section-head">
                <div>
                  <p className="section-label">Explore</p>
                  <h2>Curated access modes.</h2>
                </div>
                <span className="count-pill">{filteredProjects.length} live</span>
              </div>
              <div className="category-row">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={`category-chip${
                      activeCategory === category.id ? " active" : ""
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <section className="detail-card">
            <div className="detail-hero">
              <div>
                <p className="section-label">Investment Memo</p>
                <h2>{selectedProject.name}</h2>
              </div>
              <span className="status-pill">{selectedProject.stage}</span>
            </div>

            <div className="detail-subsection">
              <div className="section-head">
                <div>
                  <p className="section-label">Curated Access</p>
                  <h3>Switch the active opportunity.</h3>
                </div>
                <span className="count-pill">{filteredProjects.length} live</span>
              </div>

              <div className="switcher-list">
                {filteredProjects.length ? (
                  filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className={`switcher-card${
                        project.id === selectedProject.id ? " active" : ""
                      }`}
                      onClick={() => setSelectedId(project.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedId(project.id);
                        }
                      }}
                    >
                      <div className="switcher-card-head">
                        <div>
                          <p className="deal-city">
                            {project.city} / {project.district}
                          </p>
                          <strong>{project.name}</strong>
                        </div>
                        {project.access === "Open" ? (
                          <button
                            type="button"
                            className="access-pill access-pill-button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              openProjectInNewTab(project.id);
                            }}
                            aria-label={`Open ${project.name} in new tab`}
                          >
                            {project.access}
                          </button>
                        ) : (
                          <span className="access-pill">{project.access}</span>
                        )}
                      </div>
                      <p className="deal-copy">{project.stageSummary}</p>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p className="section-label">No exact match</p>
                    <p>
                      Try a broader investor ask or switch back to All Access to
                      reopen the core pitch deck.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <p className="detail-copy">{selectedProject.memo}</p>

            <div className="detail-stats">
              <article>
                <span className="stat-label">Target ROI</span>
                <strong>{selectedProject.roi}</strong>
              </article>
              <article>
                <span className="stat-label">Funding Ask</span>
                <strong>{selectedProject.ticket}</strong>
              </article>
              <article>
                <span className="stat-label">Program</span>
                <strong>{selectedProject.program}</strong>
              </article>
              <article>
                <span className="stat-label">Access</span>
                {selectedProject.access === "Open" ? (
                  <button
                    type="button"
                    className="access-pill access-pill-button"
                    onClick={() => openProjectInNewTab(selectedProject.id)}
                    aria-label={`Open ${selectedProject.name} in new tab`}
                  >
                    {selectedProject.access}
                  </button>
                ) : (
                  <strong>{selectedProject.access}</strong>
                )}
              </article>
            </div>

            <div className="experience-grid">
              <ModelStage asset={selectedAsset} project={selectedProject} />

              <article className="advantage-card">
                <div className="section-head">
                  <div>
                    <p className="section-label">Unfair Advantage</p>
                    <h3>Why this collaboration is compelling.</h3>
                  </div>
                </div>
                <div className="advantage-list">
                  <div>
                    <strong>Xplan Studio</strong>
                    <p>
                      Supplies the future-state vision, design language, and 3D
                      material that makes the investment story believable.
                    </p>
                  </div>
                  <div>
                    <strong>PRO Real Estate</strong>
                    <p>
                      Supplies the market access, investor network, and
                      financing narrative that closes the commercial side.
                    </p>
                  </div>
                  <div>
                    <strong>Better Tech</strong>
                    <p>
                      Turns static documents and renders into a Silicon
                      Valley-style product surface for high-ticket conversations.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <AssetVault
              assets={assetLibrary}
              selectedAssetId={selectedAsset.id}
              onSelectAsset={handleSelectAsset}
            />

            <div className="detail-columns">
              <div className="insight-card">
                <p className="section-label">Why It Matters</p>
                <p>{selectedProject.thesis}</p>
              </div>
              <div className="insight-card">
                <p className="section-label">Pitch Angle</p>
                <p>{selectedProject.narrative}</p>
              </div>
            </div>

            <div className="timeline-card">
              <div className="section-head">
                <div>
                  <p className="section-label">Project Timeline</p>
                  <h3>Signal momentum, not just metadata.</h3>
                </div>
              </div>
              <ol className="timeline-list">
                {selectedProject.timeline.map((step, index) => (
                  <li key={step}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{step}</strong>
                  </li>
                ))}
              </ol>
            </div>

            <div className="vault-card">
              <div>
                <p className="section-label">VIP Data Room</p>
                <h3>Prepared for the next conversation.</h3>
              </div>
              <div className="vault-grid">
                <span>{selectedProject.diligence}</span>
                <span>{selectedProject.landSize}</span>
                <span>{selectedProject.sponsor}</span>
                <span>AR / walkthrough-ready framing</span>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="map-shell">
        <MapExperience
          projects={filteredProjects.length ? filteredProjects : projects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedId}
        />
      </section>
    </main>
  );
}
