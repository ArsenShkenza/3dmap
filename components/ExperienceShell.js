"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import AssetVault from "@/components/AssetVault";
import MapExperience from "@/components/MapExperience";
import ModelStage from "@/components/ModelStage";
import { assetVaultPreviewProject, exploreCategories } from "@/lib/projects";
import { filterProjectsBySearchQuery } from "@/lib/searchFilter";

const RESULTS_PREVIEW = 4;
const RESULTS_PAGE_SIZE = 5;

const NARROW_STACK_MEDIA = "(max-width: 1240px)";

function useMatchMedia(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

function ProfileAvatarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

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
  initialSelectedId = null,
}) {
  const panelViews = [
    { id: "discover", label: "Discover" },
    { id: "browse", label: "Browse" },
    { id: "models", label: "Models" },
    { id: "platform", label: "Platform" },
  ];
  const [activeView, setActiveView] = useState("discover");
  const [query, setQuery] = useState(initialQuery);
  const [selectedId, setSelectedId] = useState(() =>
    normalizeInitialSelectedId(initialSelectedId, projects),
  );
  const [mapFocusRequest, setMapFocusRequest] = useState(0);
  const [resultsExpanded, setResultsExpanded] = useState(false);
  const [resultsPage, setResultsPage] = useState(1);
  const [hoveredListProjectId, setHoveredListProjectId] = useState(null);
  const [browseCategoryId, setBrowseCategoryId] = useState("all");
  const [vaultPreviewAssetId, setVaultPreviewAssetId] = useState(null);
  const [isAccessOverlayVisible, setIsAccessOverlayVisible] = useState(true);
  const [mobileOpportunitySheetOpen, setMobileOpportunitySheetOpen] =
    useState(false);
  const [isViewPending, startViewTransition] = useTransition();
  const isNarrowStack = useMatchMedia(NARROW_STACK_MEDIA);
  const deferredQuery = useDeferredValue(query);
  const filteredProjects = useMemo(
    () => filterProjectsBySearchQuery(projects, deferredQuery),
    [projects, deferredQuery],
  );

  const browseFilteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (
        browseCategoryId !== "all" &&
        project.categoryId !== browseCategoryId
      ) {
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
    setVaultPreviewAssetId(
      (currentId) => currentId ?? assetLibrary[0]?.id ?? null,
    );
  }, [activeView, assetLibrary]);

  useEffect(() => {
    setResultsExpanded(false);
    setResultsPage(1);
  }, [deferredQuery]);

  useEffect(() => {
    setMobileOpportunitySheetOpen(false);
  }, [selectedId]);

  useEffect(() => {
    if (!mobileOpportunitySheetOpen || typeof window === "undefined") {
      return;
    }
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpportunitySheetOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpportunitySheetOpen]);

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
  const selectedAsset = selectedProject
    ? (assetLibrary.find(
        (asset) => asset.id === selectedProject.primaryAssetId,
      ) ?? null)
    : null;
  const vaultPreviewAsset = useMemo(
    () =>
      assetLibrary.find((asset) => asset.id === vaultPreviewAssetId) ?? null,
    [assetLibrary, vaultPreviewAssetId],
  );
  const hasSearchQuery = query.trim().length > 0;
  const useOpportunityMobileSheet =
    isNarrowStack &&
    Boolean(selectedProject) &&
    (activeView === "discover" || activeView === "browse");
  const shouldShowPanel =
    (activeView !== "discover" || hasSearchQuery || Boolean(selectedProject)) &&
    !useOpportunityMobileSheet;

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
    [activeView],
  );

  const handleActivateView = useCallback((viewId) => {
    startViewTransition(() => {
      setActiveView(viewId);
      setSelectedId(null);
      setHoveredListProjectId(null);
      if (viewId !== "discover") {
        setQuery("");
      }
    });
  }, []);

  const handleBackToResults = useCallback(() => {
    setSelectedId(null);
    setHoveredListProjectId(null);
  }, []);

  const searchHelperText =
    activeView === "discover"
      ? selectedProject && !hasSearchQuery
        ? useOpportunityMobileSheet
          ? "Map is in focus. Open the opportunity sheet for the full memo and 3D preview."
          : "The opportunity rail stays open while a project is selected."
        : hasSearchQuery
          ? `${filteredProjects.length} matching opportunit${
              filteredProjects.length === 1 ? "y" : "ies"
            } in focus.`
          : "Type to reveal the investment rail and review matching opportunities."
      : "Search at any time to jump back into Discover.";

  const discoverContent = (
    <section className="detail-card detail-card-scroll">
      {/* <div className="detail-hero">
        <div>
          <p className="section-label">Discover</p>
          <h2>Navigate the curated capital stack.</h2>
        </div>
      </div> */}

      <div className="view-stack">
        {/* <div className="view-section">
          <p className="detail-copy compact discover-panel-copy">
            Search stays on the map so the market context remains visible while
            this rail turns into your short list.
          </p>
        </div> */}

        {hasSearchQuery ? (
          <div className="view-section">
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
                    Try a broader search term or remove the property-type
                    keyword to reopen the full deck.
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
                          Math.min(totalResultPages, page + 1),
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

  const renderOpportunityDetails = (isMobileSheetBody = false) => {
    if (!selectedProject) {
      return null;
    }
    return (
      <section
        className={`detail-card detail-card-opportunity detail-card-scroll${
          isMobileSheetBody ? " detail-card-opportunity--mobile-sheet" : ""
        }`}
      >
        {!isMobileSheetBody ? (
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
        ) : null}

        <div className="detail-hero">
          <div className="opportunity-heading">
            <p className="section-label">Opportunity</p>
            <h2 id="opportunity-sheet-title">{selectedProject.name}</h2>
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
          <div className="opportunity-model-tail-gap" aria-hidden="true" />
        </div>
      </section>
    );
  };

  const browseContent = (
    <section className="detail-card detail-card-scroll">
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
                    <span className="browse-meta-pill">
                      {project.categoryLabel}
                    </span>
                  </div>
                  <p className="deal-copy">{project.stageSummary}</p>
                </button>
              ))
            ) : (
              <div className="empty-state">
                <p className="section-label">No matches</p>
                <p>
                  Widen the category filter to bring opportunities back into
                  view.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const modelsContent = (
    <section className="detail-card detail-card-scroll">
      <div className="view-stack">
        <section className="detail-card">
          <div className="detail-hero">
            <div>
              <p className="section-label">Models</p>
              <h2>Explore the full 3D library.</h2>
            </div>
          </div>
          <p className="detail-copy compact browse-deck-caption">
            Mapped heroes, integrated towers, interiors, and every exterior in
            the vault—the same files you can open from Discover and Browse on
            the map.
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
      </div>
    </section>
  );

  const platformContent = (
    <section className="detail-card detail-card-scroll">
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
            Supplies the future-state vision, design language, and 3D material
            that makes the investment story believable.
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
    </section>
  );

  const panelContent =
    activeView === "discover"
      ? selectedProject
        ? renderOpportunityDetails(false)
        : discoverContent
      : activeView === "browse"
        ? selectedProject
          ? renderOpportunityDetails(false)
          : browseContent
        : activeView === "models"
          ? modelsContent
          : activeView === "platform"
            ? platformContent
            : null;

  const mapSearchOverlayInner = (
    <>
      <label className="search-input map-search-input">
        <span className="sr-only">Search deals</span>
        <input
          value={query}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Search by city, land or building"
        />
      </label>
      <p className="map-search-helper">{searchHelperText}</p>
    </>
  );

  return (
    <main className="page-shell">
      <MapExperience
        assetLibrary={assetLibrary}
        projects={mapProjectList}
        selectedProject={selectedProject}
        selectedAsset={selectedAsset}
        onSelectProject={handleSelectProject}
        viewMode={activeView}
        focusRequest={mapFocusRequest}
        panelVisible={shouldShowPanel}
        panelHoveredProjectId={
          (activeView === "discover" || activeView === "browse") &&
          !selectedProject
            ? hoveredListProjectId
            : null
        }
      />

      <header className="page-topbar">
        <div className="topbar-brand">
          <div className="topbar-brand-mark">PX</div>
          <span
            className="profile-avatar topbar-brand-profile-avatar"
            aria-hidden="true"
          >
            <ProfileAvatarIcon />
          </span>
          <div className="topbar-brand-copy">
            <strong>PRO X</strong>
            <p className="eyebrow">Invitation-Only Investment Intelligence</p>
          </div>
        </div>

        <div className="topbar-nav" role="tablist" aria-label="PRO X sections">
          {panelViews.map((view) => (
            <button
              key={view.id}
              type="button"
              role="tab"
              aria-selected={activeView === view.id}
              className={`panel-nav-button${
                activeView === view.id ? " active" : ""
              }`}
              onClick={() => handleActivateView(view.id)}
            >
              {view.label}
            </button>
          ))}
        </div>

        <div
          className="profile-placeholder"
          aria-label="Investor profile placeholder"
        >
          <span className="profile-avatar" aria-hidden="true">
            <ProfileAvatarIcon />
          </span>
          <div className="profile-copy">
            <strong>Investor Profile</strong>
            <span>VIP / Standard placeholder</span>
          </div>
        </div>
      </header>

      <div
        className={`experience-stage${shouldShowPanel ? " rail-open" : " rail-closed"}${isViewPending ? " view-switch-pending" : ""}`}
      >
        {shouldShowPanel ? (
          <div className="content-grid">{panelContent}</div>
        ) : null}

        <section className="map-shell">
          {isNarrowStack ? (
            <div className="map-search-stack">
              <div className="map-search-overlay map-search-overlay--stacked">
                {mapSearchOverlayInner}
              </div>
            </div>
          ) : (
            <div className="map-search-overlay">{mapSearchOverlayInner}</div>
          )}
        </section>
      </div>

      {useOpportunityMobileSheet ? (
        <div className="opportunity-mobile-sheet-host">
          {mobileOpportunitySheetOpen ? (
            <div
              className="opportunity-mobile-sheet-scrim"
              aria-hidden="true"
              onClick={() => setMobileOpportunitySheetOpen(false)}
            />
          ) : null}
          {mobileOpportunitySheetOpen ? (
            <div
              className="opportunity-mobile-sheet-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="opportunity-sheet-title"
            >
              {renderOpportunityDetails(true)}
            </div>
          ) : (
            <button
              type="button"
              className="opportunity-mobile-sheet-launch"
              onClick={() => setMobileOpportunitySheetOpen(true)}
            >
              <span className="opportunity-mobile-sheet-launch-label">
                Opportunity
              </span>
              <span className="opportunity-mobile-sheet-launch-name">
                {selectedProject.name}
              </span>
            </button>
          )}
        </div>
      ) : null}

      {/* {isAccessOverlayVisible ? (
        <div
          className="premium-access-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="premium-access-title"
        >
          <div
            className="premium-access-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="premium-access-lock">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="eyebrow">Investor Access Required</p>
            <h2 id="premium-access-title">
              Login to enter the PRO X capital room.
            </h2>
            <p className="premium-access-copy">
              This page is framed as an invitation-only investor surface for VIP
              and standard accounts. Use the gate as a premium front door for
              the demo.
            </p>

            <form
              className="premium-access-form"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <label className="premium-access-field">
                <span>Investor Email</span>
                <input type="email" placeholder="investor@pro-x.com" />
              </label>

              <label className="premium-access-field">
                <span>Access Code</span>
                <input type="password" placeholder="Invite or VIP code" />
              </label>

              <div className="premium-access-actions">
                <button
                  type="submit"
                  className="primary-link-button premium-access-button"
                >
                  Login To Continue
                </button>
                <button
                  type="button"
                  className="ghost-link-button premium-access-button"
                  onClick={() => setIsAccessOverlayVisible(false)}
                >
                  Enter Demo Preview
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null} */}
    </main>
  );
}
