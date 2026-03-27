"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState
} from "react";
import AssetVault from "@/components/AssetVault";
import MapExperience from "@/components/MapExperience";
import ModelStage from "@/components/ModelStage";
import {
  assetVaultPreviewProject,
  exploreCategories
} from "@/lib/projects";
import { filterProjectsBySearchQuery } from "@/lib/searchFilter";

const RESULTS_PREVIEW = 4;
const RESULTS_PAGE_SIZE = 5;

function normalizeInitialSelectedId(id, projectList) {
  if (!id || typeof id !== "string") {
    return null;
  }
  return projectList.some((project) => project.id === id) ? id : null;
}

export default function ExperienceShell({
  assetLibrary,
  projects,
  initialQuery = "",
  initialSelectedId = null
}) {
  const panelViews = [
    { id: "discover", label: "Discover" },
    { id: "browse", label: "Browse" },
    { id: "models", label: "Models" },
    { id: "platform", label: "Platform" }
  ];
  const [activeView, setActiveView] = useState("discover");
  const [query, setQuery] = useState(initialQuery);
  const [selectedId, setSelectedId] = useState(() =>
    normalizeInitialSelectedId(initialSelectedId, projects)
  );
  const [mapFocusRequest, setMapFocusRequest] = useState(0);
  const [resultsExpanded, setResultsExpanded] = useState(false);
  const [resultsPage, setResultsPage] = useState(1);
  const [hoveredListProjectId, setHoveredListProjectId] = useState(null);
  const [browseCategoryId, setBrowseCategoryId] = useState("all");
  const [vaultPreviewAssetId, setVaultPreviewAssetId] = useState(null);
  const deferredQuery = useDeferredValue(query);
  const filteredProjects = useMemo(
    () => filterProjectsBySearchQuery(projects, deferredQuery),
    [projects, deferredQuery]
  );

  const browseFilteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (browseCategoryId !== "all" && project.categoryId !== browseCategoryId) {
        return false;
      }
      return true;
    });
  }, [projects, browseCategoryId]);

  const mapProjectList = useMemo(() => {
    if (activeView === "browse") {
      return browseFilteredProjects;
    }
    if (activeView === "discover") {
      return filteredProjects.length ? filteredProjects : projects;
    }
    return projects;
  }, [activeView, browseFilteredProjects, filteredProjects, projects]);

  useEffect(() => {
    if (activeView !== "browse" || !selectedId) {
      return;
    }
    if (!browseFilteredProjects.some((project) => project.id === selectedId)) {
      setSelectedId(null);
    }
  }, [activeView, browseFilteredProjects, selectedId]);

  useEffect(() => {
    if (activeView !== "models") {
      setVaultPreviewAssetId(null);
      return;
    }
    setVaultPreviewAssetId((currentId) => currentId ?? assetLibrary[0]?.id ?? null);
  }, [activeView, assetLibrary]);

  useEffect(() => {
    setResultsExpanded(false);
    setResultsPage(1);
  }, [deferredQuery]);

  const totalResultPages = useMemo(() => {
    const count = filteredProjects.length;
    if (count === 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(count / RESULTS_PAGE_SIZE));
  }, [filteredProjects.length]);

  useEffect(() => {
    if (resultsPage > totalResultPages) {
      setResultsPage(totalResultPages);
    }
  }, [resultsPage, totalResultPages]);

  const visibleProjects = useMemo(() => {
    if (!filteredProjects.length) {
      return [];
    }
    if (!resultsExpanded) {
      if (filteredProjects.length <= RESULTS_PREVIEW) {
        return filteredProjects;
      }
      return filteredProjects.slice(0, RESULTS_PREVIEW);
    }
    const start = (resultsPage - 1) * RESULTS_PAGE_SIZE;
    return filteredProjects.slice(start, start + RESULTS_PAGE_SIZE);
  }, [filteredProjects, resultsExpanded, resultsPage]);

  const hasMoreThanPreview = filteredProjects.length > RESULTS_PREVIEW;

  const selectedProject =
    projects.find((project) => project.id === selectedId) ?? null;
  const selectedAsset =
    selectedProject
      ? assetLibrary.find((asset) => asset.id === selectedProject.primaryAssetId) ??
        null
      : null;
  const vaultPreviewAsset = useMemo(
    () =>
      assetLibrary.find((asset) => asset.id === vaultPreviewAssetId) ?? null,
    [assetLibrary, vaultPreviewAssetId]
  );
  const hasSearchQuery = query.trim().length > 0;

  const handleSearchChange = (value) => {
    setQuery(value);
    setSelectedId(null);
    setHoveredListProjectId(null);
    if (activeView !== "discover") {
      setActiveView("discover");
    }
  };

  const handleSelectProject = useCallback(
    (projectId, nextView = activeView) => {
      setSelectedId(projectId);
      setHoveredListProjectId(null);
      setActiveView(nextView);
      setMapFocusRequest((currentValue) => currentValue + 1);
    },
    [activeView]
  );

  const handleBackToResults = useCallback(() => {
    setSelectedId(null);
    setHoveredListProjectId(null);
  }, []);

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
                <h3>Select a property to review it below.</h3>
              </div>
              <span className="count-pill">
                {filteredProjects.length} result
                {filteredProjects.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="switcher-list">
              {filteredProjects.length ? (
                visibleProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    className={`switcher-card${
                      project.id === selectedId ? " active" : ""
                    }`}
                    onClick={() => handleSelectProject(project.id)}
                    onMouseEnter={() => setHoveredListProjectId(project.id)}
                    onMouseLeave={() => setHoveredListProjectId(null)}
                  >
                    <div className="switcher-card-head">
                      <div>
                        <p className="deal-city">
                          {project.city} / {project.district}
                        </p>
                        <strong>{project.name}</strong>
                      </div>
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

            {filteredProjects.length > 0 &&
            (hasMoreThanPreview || resultsExpanded) ? (
              <div className="results-list-footer">
                {!resultsExpanded && hasMoreThanPreview ? (
                  <div className="see-all-results-row">
                    <button
                      type="button"
                      className="ghost-link-button see-all-results-button"
                      onClick={() => {
                        setResultsExpanded(true);
                        setResultsPage(1);
                      }}
                    >
                      Show all results ({filteredProjects.length})
                    </button>
                  </div>
                ) : null}

                {resultsExpanded && totalResultPages > 1 ? (
                  <div className="results-pagination-bar">
                    <button
                      type="button"
                      className="results-pagination-button"
                      disabled={resultsPage <= 1}
                      onClick={() =>
                        setResultsPage((page) => Math.max(1, page - 1))
                      }
                    >
                      Previous
                    </button>
                    <span className="results-pagination-status">
                      Page {resultsPage} of {totalResultPages}
                    </span>
                    <button
                      type="button"
                      className="results-pagination-button"
                      disabled={resultsPage >= totalResultPages}
                      onClick={() =>
                        setResultsPage((page) =>
                          Math.min(totalResultPages, page + 1)
                        )
                      }
                    >
                      Next
                    </button>
                  </div>
                ) : null}

                {resultsExpanded && hasMoreThanPreview ? (
                  <div className="see-all-results-row">
                    <button
                      type="button"
                      className="ghost-link-button see-all-results-button"
                      onClick={() => {
                        setResultsExpanded(false);
                        setResultsPage(1);
                      }}
                    >
                      Show less
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );

  const opportunityContent = selectedProject ? (
    <section className="detail-card detail-card-opportunity">
      <div className="opportunity-top-bar">
        <button
          type="button"
          className="opportunity-dismiss"
          onClick={handleBackToResults}
          aria-label="Close opportunity"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M18 6L6 18M6 6l12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="detail-hero">
        <div className="opportunity-heading">
          <p className="section-label">Opportunity</p>
          <h2>{selectedProject.name}</h2>
        </div>
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

        <ModelStage
          asset={selectedAsset}
          project={selectedProject}
          hideCaption
          hideAssetMeta
          fullProjectHref={`/project/${selectedProject.id}`}
        />
      </div>
    </section>
  ) : null;

  const browseContent = (
    <section className="detail-card">
      <div className="detail-hero">
        <div>
          <p className="section-label">Browse</p>
          <h2>Explore the deck by mandate.</h2>
        </div>
      </div>

      <div className="view-stack">
        <p className="detail-copy compact browse-deck-caption">
          Filter the curated stack by investment mandate—land and development,
          partnership asks, or turn-key income.
        </p>

        <div className="view-section browse-filter-section">
          <p className="section-label">Category</p>
          <div
            className="category-row"
            role="group"
            aria-label="Investment category"
          >
            {exploreCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`category-chip${
                  browseCategoryId === category.id ? " active" : ""
                }`}
                onClick={() => setBrowseCategoryId(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="browse-inline-count">
            <span className="count-pill">
              {browseFilteredProjects.length} result
              {browseFilteredProjects.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="switcher-list">
            {browseFilteredProjects.length ? (
              browseFilteredProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className={`switcher-card${
                    project.id === selectedId ? " active" : ""
                  }`}
                  onClick={() => handleSelectProject(project.id)}
                  onMouseEnter={() => setHoveredListProjectId(project.id)}
                  onMouseLeave={() => setHoveredListProjectId(null)}
                >
                  <div className="switcher-card-head">
                    <div>
                      <p className="deal-city">
                        {project.city} / {project.district}
                      </p>
                      <strong>{project.name}</strong>
                    </div>
                  </div>
                  <div className="browse-card-meta">
                    <span className="browse-meta-pill">{project.categoryLabel}</span>
                  </div>
                  <p className="deal-copy">{project.stageSummary}</p>
                </button>
              ))
            ) : (
              <div className="empty-state">
                <p className="section-label">No matches</p>
                <p>
                  Widen the category filter to bring opportunities back into view.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const modelsContent = (
    <>
      <section className="detail-card">
        <div className="detail-hero">
          <div>
            <p className="section-label">Models</p>
            <h2>Explore the full 3D library.</h2>
          </div>
        </div>
        <p className="detail-copy compact browse-deck-caption">
          Mapped heroes, integrated towers, interiors, and every exterior in the
          vault—the same files you can open from Discover and Browse on the map.
        </p>
      </section>

      <AssetVault
        assets={assetLibrary}
        selectedAssetId={vaultPreviewAssetId}
        onSelectAsset={(asset) => setVaultPreviewAssetId(asset.id)}
      />

      {vaultPreviewAsset ? (
        <section className="detail-card">
          <ModelStage
            asset={vaultPreviewAsset}
            project={assetVaultPreviewProject}
            caption="Rotate and zoom to review this file on its own."
          />
        </section>
      ) : null}
    </>
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
            <div className="brand-row">
              <div>
                <h1>PRO X</h1>
              </div>
            </div>
            <p className="eyebrow">Invitation-Only Investment Intelligence</p>
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
                  onClick={() => {
                    setActiveView(view.id);
                    setHoveredListProjectId(null);
                  }}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="content-grid">
          {activeView === "discover"
            ? selectedProject
              ? opportunityContent
              : discoverContent
            : activeView === "browse"
              ? selectedProject
                ? opportunityContent
                : browseContent
              : activeView === "models"
                ? modelsContent
                : activeView === "platform"
                  ? platformContent
                  : null}
        </div>
      </section>

      <section className="map-shell">
        <MapExperience
          assetLibrary={assetLibrary}
          projects={mapProjectList}
          selectedProject={selectedProject}
          selectedAsset={selectedAsset}
          onSelectProject={handleSelectProject}
          searchQuery={query}
          viewMode={activeView}
          focusRequest={mapFocusRequest}
          resultCount={
            activeView === "browse"
              ? browseFilteredProjects.length
              : activeView === "discover"
                ? filteredProjects.length
                : activeView === "models"
                  ? assetLibrary.length
                  : projects.length
          }
          panelHoveredProjectId={
            (activeView === "discover" || activeView === "browse") &&
            !selectedProject
              ? hoveredListProjectId
              : null
          }
        />
      </section>
    </main>
  );
}
