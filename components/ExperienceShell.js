"use client";

import Link from "next/link";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import MapExperience from "@/components/MapExperience";
import ModelStage from "@/components/ModelStage";

const BUILDING_KEYWORDS = [
  "building",
  "ndertese",
  "ndertesa",
  "ndertesat",
  "ndertesaat"
];
const LAND_KEYWORDS = ["land", "toke", "toka"];

function tokenizeQuery(query) {
  return query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function getSearchIntent(query) {
  const tokens = tokenizeQuery(query);
  const reservedTokens = new Set([...BUILDING_KEYWORDS, ...LAND_KEYWORDS]);
  const hasBuildingKeyword = tokens.some((token) =>
    BUILDING_KEYWORDS.includes(token)
  );
  const hasLandKeyword = tokens.some((token) => LAND_KEYWORDS.includes(token));

  return {
    type:
      hasBuildingKeyword === hasLandKeyword
        ? "all"
        : hasBuildingKeyword
          ? "building"
          : "land",
    textQuery: tokens
      .filter((token) => !reservedTokens.has(token))
      .join(" ")
  };
}

function matchesIntent(project, searchIntent) {
  if (searchIntent.type === "all") {
    return true;
  }

  return searchIntent.type === "land"
    ? project.propertyType === "land"
    : project.propertyType === "building";
}

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
  projects
}) {
  const panelViews = [
    { id: "discover", label: "Discover" },
    { id: "opportunity", label: "Opportunity" },
    { id: "platform", label: "Platform" }
  ];
  const [activeView, setActiveView] = useState("discover");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [mapFocusRequest, setMapFocusRequest] = useState(0);
  const deferredQuery = useDeferredValue(query);
  const searchIntent = useMemo(
    () => getSearchIntent(deferredQuery),
    [deferredQuery]
  );

  const filteredProjects = projects.filter((project) => {
    return (
      matchesIntent(project, searchIntent) &&
      matchesQuery(project, searchIntent.textQuery)
    );
  });

  const selectedProject =
    projects.find((project) => project.id === selectedId) ?? null;
  const selectedAsset =
    selectedProject
      ? assetLibrary.find((asset) => asset.id === selectedProject.primaryAssetId) ??
        null
      : null;
  const hasSearchQuery = query.trim().length > 0;

  const handleSearchChange = (value) => {
    setQuery(value);
    setSelectedId(null);
    if (activeView !== "discover") {
      setActiveView("discover");
    }
  };

  const handleSelectProject = useCallback(
    (projectId, nextView = "opportunity") => {
      setSelectedId(projectId);
      setActiveView(nextView);
      setMapFocusRequest((currentValue) => currentValue + 1);
    },
    []
  );

  const discoverContent = (
    <section className="detail-card">
      <div className="detail-hero">
        <div>
          <p className="section-label">Discover</p>
          <h2>Navigate the curated capital stack.</h2>
        </div>
      </div>

      <div className="view-stack">
        <div className="view-section">
          <label className="search-input">
            <span className="sr-only">Search deals</span>
            <input
              value={query}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search by city, land, building, toke, or ndertese"
            />
          </label>
        </div>

        {hasSearchQuery ? (
          <div className="view-section view-section-divided">
            <div className="section-head">
              <div>
                <p className="section-label">Results</p>
                <h3>Select a property to open the memo.</h3>
              </div>
              <span className="count-pill">
                {filteredProjects.length} result
                {filteredProjects.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="switcher-list">
              {filteredProjects.length ? (
                filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    className={`switcher-card${
                      project.id === selectedId ? " active" : ""
                    }`}
                    onClick={() => handleSelectProject(project.id)}
                  >
                    <div className="switcher-card-head">
                      <div>
                        <p className="deal-city">
                          {project.city} / {project.district}
                        </p>
                        <strong>{project.name}</strong>
                      </div>
                      <span className="access-pill">{project.access}</span>
                    </div>
                    <p className="deal-copy">{project.stageSummary}</p>
                  </button>
                ))
              ) : (
                <div className="empty-state">
                  <p className="section-label">No exact match</p>
                  <p>
                    Try a broader search term or remove the property-type keyword
                    to reopen the full deck.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );

  const opportunityContent = (
    <section className="detail-card">
      {selectedProject ? (
        <>
          <div className="detail-hero">
            <div>
              <p className="section-label">Opportunity</p>
              <h2>{selectedProject.name}</h2>
            </div>
            <span className="status-pill">{selectedProject.stage}</span>
          </div>

          <div className="view-stack">
            <div className="view-section">
              <p className="detail-copy compact">{selectedProject.memo}</p>
            </div>

            <div className="detail-stats tight">
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
                <strong>{selectedProject.access}</strong>
              </article>
            </div>

            <ModelStage asset={selectedAsset} project={selectedProject} />

            <div className="view-section view-section-divided">
              <div className="section-head">
                <div>
                  <p className="section-label">Project Access</p>
                  <h3>Open the full project room for deeper exploration.</h3>
                </div>
              </div>
              <p className="detail-copy compact">
                Keep the opportunity surface focused on the exterior story and headline
                investment case, then move into a dedicated project space for floors,
                program depth, and richer building review.
              </p>
              <div className="cta-row">
                <Link
                  href={`/project/${selectedProject.id}`}
                  className="primary-link-button"
                >
                  View Full Project
                </Link>
                <p className="cta-note">
                  Inside the full project room you can inspect the floor explorer and
                  the expanded diligence narrative.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p className="section-label">Opportunity</p>
          <p>Select a property from Discover to open the memo.</p>
        </div>
      )}
    </section>
  );

  const platformContent = (
    <section className="detail-card">
      <div className="detail-hero">
        <div>
          <p className="section-label">Platform</p>
          <h2>How PRO X wins the room.</h2>
        </div>
      </div>

      <div className="platform-copy">
        <p className="lead platform-lead">
          A cinematic capital-raising surface for premium real estate
          opportunities, built to feel closer to private banking than a local
          property portal.
        </p>
        <p className="detail-copy compact">
          The concept stays intentionally narrow: a curated set of flagship
          opportunities, a map-led market view, and a presentation surface that
          turns static development narratives into investor-facing product
          moments.
        </p>
      </div>

      <article className="advantage-card platform-card">
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
              Supplies the market access, investor network, and financing
              narrative that closes the commercial side.
            </p>
          </div>
          <div>
            <strong>Better Tech</strong>
            <p>
              Turns static documents and renders into a Silicon Valley-style
              product surface for high-ticket conversations.
            </p>
          </div>
        </div>
      </article>
    </section>
  );

  return (
    <main className="page-shell">
      <section className="panel-shell">
        <div className="panel-top">
          <div className="brand-block">
            <p className="eyebrow">Invitation-Only Investment Intelligence</p>
            <div className="brand-row">
              <div>
                <h1>PRO X</h1>
              </div>
            </div>
            <div className="panel-nav" role="tablist" aria-label="PRO X sections">
              {panelViews.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  role="tab"
                  aria-selected={activeView === view.id}
                  className={`panel-nav-button${
                    activeView === view.id ? " active" : ""
                  }`}
                  onClick={() => setActiveView(view.id)}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="content-grid">
          {activeView === "discover"
            ? discoverContent
            : activeView === "platform"
              ? platformContent
              : opportunityContent}
        </div>
      </section>

      <section className="map-shell">
        <MapExperience
          projects={filteredProjects.length ? filteredProjects : projects}
          selectedProject={selectedProject}
          selectedAsset={selectedAsset}
          onSelectProject={handleSelectProject}
          viewMode={activeView}
          focusRequest={mapFocusRequest}
          resultCount={filteredProjects.length}
        />
      </section>
    </main>
  );
}
