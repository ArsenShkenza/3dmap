"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  startTransition,
  useState,
} from "react";
import { flushSync } from "react-dom";
import AssetVault from "@/components/AssetVault";
import MapExperience from "@/components/MapExperience";
import ModelStage from "@/components/ModelStage";
import { cn } from "@/lib/cn";
import { assetVaultPreviewProject, exploreCategories } from "@/lib/projects";
import { filterProjectsBySearchQuery } from "@/lib/searchFilter";
import {
  chipButton,
  countPill,
  detailCard,
  detailCardScrollShell,
  ghostLinkButton,
  iconButton,
  navButton,
  proseSoft,
  sectionLabel,
  serifHeading,
  statLabel,
  switcherCard,
} from "@/lib/uiClasses";

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

const topbarShellClass =
  "relative z-[6] grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[24px] border border-pro-line border-white/8 px-[14px] py-[18px] shadow-pro-panel backdrop-blur-[20px] [background:radial-gradient(circle_at_top_right,rgba(214,180,123,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02)),rgba(6,11,18,0.84)] max-[1240px]:grid-cols-1 max-[820px]:gap-[10px] max-[820px]:rounded-[24px] max-[820px]:px-[16px] max-[820px]:py-[14px] max-[480px]:px-[14px] max-[480px]:py-3";
/** PX mark — matches legacy topbar brand tile (`52px`, `18px` radius, `var(--gold-bright)`, type scale). */
const brandMarkClass =
  "font-sans grid h-[52px] w-[52px] place-items-center rounded-[18px] border border-black/12 bg-[var(--gold-bright)] text-[0.9rem] font-bold uppercase tracking-[0.18em] text-black antialiased max-[820px]:h-[44px] max-[820px]:w-[44px] max-[820px]:rounded-[16px] max-[820px]:text-[0.82rem] max-[820px]:tracking-[0.14em]";
/** Legacy profile avatar ring: `42px`, gold border/fill, icon inherits `var(--gold-bright)`. */
const profileAvatarClass =
  "font-sans grid h-[42px] w-[42px] place-items-center rounded-full border border-[rgba(241,211,161,0.24)] bg-[rgba(214,180,123,0.1)] text-(--gold-bright) box-border [&_svg]:h-[16px] [&_svg]:w-[16px] max-[820px]:[&_svg]:h-[18px] max-[820px]:[&_svg]:w-[18px]";
/** Legacy `.topbar-nav` — tab rail (gap 10px, centered, scroll, inset padding). */
const topbarNavTablistClass =
  "font-sans box-border pointer-events-auto text-(--text) flex w-auto max-w-full flex-nowrap items-center justify-center justify-self-center gap-[10px] overflow-x-auto px-[4px] py-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[1240px]:w-full max-[1240px]:min-w-0 max-[1240px]:justify-self-stretch";
const pageStageClass =
  "min-h-0 gap-5 pointer-events-none max-[1240px]:flex max-[1240px]:min-h-auto max-[1240px]:flex-col-reverse max-[1240px]:justify-end max-[1240px]:gap-3";
const viewStackClass = "grid gap-[18px]";
const viewSectionClass = "grid gap-4";
const sectionHeadClass =
  "flex items-start justify-between gap-3 max-[820px]:flex-col max-[820px]:items-start";
const compactCopyClass = "m-0 text-(--text-soft) leading-[1.6]";
const switcherHeadClass =
  "flex items-start justify-between gap-3 max-[1480px]:flex-col max-[1480px]:items-start";
const dealCityClass =
  "mb-2 text-[0.78rem] uppercase tracking-[0.12em] text-(--text-soft)";
const dealCopyClass =
  "mt-[10px] text-[0.92rem] leading-[1.6] text-(--text-soft)";
const statCardClass =
  "rounded-[18px] border border-white/8 p-[14px] [background:linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02)),rgba(255,255,255,0.02)]";
const statValueClass = "mt-2 block text-base text-pro-text";
const emptyStateClass = "rounded-[18px] bg-white/3 p-[18px]";
const metaPillClass =
  "inline-block rounded-full border border-[rgba(241,211,161,0.3)] bg-[rgba(214,180,123,0.12)] px-[10px] py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-(--gold-bright)";
const paginationButtonClass =
  "rounded-full border border-[rgba(241,211,161,0.3)] bg-white/3 px-[14px] py-2 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-(--gold-bright) transition duration-200 ease-out hover:-translate-y-px hover:border-[rgba(241,211,161,0.4)] hover:text-(--gold-bright) disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0";
const searchInputClass =
  "w-full rounded-full border border-[rgba(241,211,161,0.22)] bg-[rgba(8,14,21,0.18)] px-[22px] py-[18px] text-[0.96rem] text-pro-gold-bright caret-pro-gold-bright outline-none backdrop-blur-[6px] placeholder:text-[rgba(241,211,161,0.84)] focus:border-[rgba(241,211,161,0.44)] focus:shadow-[0_0_0_4px_rgba(214,180,123,0.08)] max-[820px]:px-[18px] max-[820px]:py-[14px] max-[820px]:text-base max-[820px]:text-left";

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
  const activeViewRef = useRef(activeView);
  activeViewRef.current = activeView;
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

  const handleSelectProject = useCallback((projectId, nextView) => {
    setSelectedId(projectId);
    setHoveredListProjectId(null);
    setActiveView(nextView ?? activeViewRef.current);
    setMapFocusRequest((currentValue) => currentValue + 1);
  }, []);

  const handleActivateView = useCallback((viewId) => {
    flushSync(() => {
      setActiveView(viewId);
      setSelectedId(null);
      setHoveredListProjectId(null);
    });
    if (viewId !== "discover") {
      startTransition(() => {
        setQuery("");
      });
    }
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

  const renderProjectCard = (project, extraMeta = null) => (
    <button
      key={project.id}
      type="button"
      aria-pressed={project.id === selectedId}
      className={switcherCard}
      onClick={() => handleSelectProject(project.id)}
      onMouseEnter={() => setHoveredListProjectId(project.id)}
      onMouseLeave={() => setHoveredListProjectId(null)}
    >
      <div className={switcherHeadClass}>
        <div className="min-w-0">
          <p className={dealCityClass}>
            {project.city} / {project.district}
          </p>
          <strong className={cn(serifHeading, "block text-base")}>
            {project.name}
          </strong>
        </div>
      </div>
      {extraMeta}
      <p className={dealCopyClass}>{project.stageSummary}</p>
    </button>
  );

  const discoverContent = (
    <section
      className={cn(detailCard, detailCardScrollShell)}
    >
      {/* <div className="detail-hero">
        <div>
          <p className="section-label">Discover</p>
          <h2>Navigate the curated capital stack.</h2>
        </div>
      </div> */}

      <div
        className={cn(
          viewStackClass,
          "min-h-0 content-start pb-[clamp(20px,3.5vw,40px)]",
        )}
      >
        {/* <div className="view-section">
          <p className="detail-copy compact discover-panel-copy">
            Search stays on the map so the market context remains visible while
            this rail turns into your short list.
          </p>
        </div> */}

        {hasSearchQuery ? (
          <div className={viewSectionClass}>
            <div className={sectionHeadClass}>
              <div className="min-w-0">
                <p className={sectionLabel}>Results</p>
                <h3 className={cn(serifHeading, "text-[1.05rem]")}>
                  Select a property to review it below.
                </h3>
              </div>
              <span className={countPill}>
                {filteredProjects.length} result
                {filteredProjects.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="grid gap-[10px] pb-[clamp(12px,2.4vw,26px)]">
              {filteredProjects.length ? (
                visibleProjects.map((project) => renderProjectCard(project))
              ) : (
                <div className={emptyStateClass}>
                  <p className={sectionLabel}>No exact match</p>
                  <p className={compactCopyClass}>
                    Try a broader search term or remove the property-type
                    keyword to reopen the full deck.
                  </p>
                </div>
              )}
            </div>

            {filteredProjects.length > 0 &&
            (hasMoreThanPreview || resultsExpanded) ? (
              <div className="mt-[14px] flex flex-col items-center gap-3 border-t border-white/6 pt-[14px] pb-[clamp(12px,2.2vw,22px)]">
                {!resultsExpanded && hasMoreThanPreview ? (
                  <div className="flex w-full justify-center">
                    <button
                      type="button"
                      className={cn(
                        ghostLinkButton,
                        "text-[0.85rem] normal-case tracking-[0.04em]",
                      )}
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
                  <div className="flex w-full flex-wrap items-center justify-center gap-[14px]">
                    <button
                      type="button"
                      className={paginationButtonClass}
                      disabled={resultsPage <= 1}
                      onClick={() =>
                        setResultsPage((page) => Math.max(1, page - 1))
                      }
                    >
                      Previous
                    </button>
                    <span className="text-[0.78rem] uppercase tracking-[0.06em] text-pro-text-soft">
                      Page {resultsPage} of {totalResultPages}
                    </span>
                    <button
                      type="button"
                      className={paginationButtonClass}
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
                  <div className="flex w-full justify-center">
                    <button
                      type="button"
                      className={cn(
                        ghostLinkButton,
                        "text-[0.85rem] normal-case tracking-[0.04em]",
                      )}
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
        className={cn(
          detailCard,
          "detail-card detail-card-opportunity detail-card-scroll relative",
          isMobileSheetBody
            ? "detail-card-opportunity--mobile-sheet m-0 flex-1 min-h-0 rounded-none border-none bg-transparent p-0 shadow-none [clip-path:none] overflow-x-hidden overflow-y-auto overscroll-contain overscroll-y-contain [-webkit-overflow-scrolling:touch]"
            : null,
        )}
      >
        {!isMobileSheetBody ? (
          <div className="my-[-4px] mb-[2px] flex items-center justify-end gap-[10px]">
            <button
              type="button"
              className={iconButton}
              onClick={handleBackToResults}
              aria-label="Close opportunity"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-[18px] w-[18px]"
              >
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

        <div className="flex items-start justify-between gap-3 max-[820px]:flex-col max-[820px]:items-start">
          <div className="min-w-0 flex-1">
            <p className={sectionLabel}>Opportunity</p>
            <h2
              id="opportunity-sheet-title"
              className={cn(serifHeading, "text-[1.6rem]")}
            >
              {selectedProject.name}
            </h2>
          </div>
        </div>

        <div
          className={cn(
            viewStackClass,
            "content-start pb-[clamp(44px,8vw,88px)]",
          )}
        >
          <div className={viewSectionClass}>
            <p className={compactCopyClass}>{selectedProject.memo}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-[1480px]:grid-cols-2 max-[820px]:grid-cols-1">
            <article className={statCardClass}>
              <span className={statLabel}>Target ROI</span>
              <strong className={statValueClass}>{selectedProject.roi}</strong>
            </article>
            <article className={statCardClass}>
              <span className={statLabel}>Funding Ask</span>
              <strong className={statValueClass}>
                {selectedProject.ticket}
              </strong>
            </article>
            <article className={statCardClass}>
              <span className={statLabel}>Program</span>
              <strong className={statValueClass}>
                {selectedProject.program}
              </strong>
            </article>
            <article className={statCardClass}>
              <span className={statLabel}>Access</span>
              <strong className={statValueClass}>
                {selectedProject.access}
              </strong>
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
    <section
      className={cn(detailCard, detailCardScrollShell)}
    >
      <div className={sectionHeadClass}>
        <div className="min-w-0">
          <p className={sectionLabel}>Browse</p>
          <h2 className={cn(serifHeading, "text-[1.6rem]")}>
            Explore the deck by mandate.
          </h2>
        </div>
      </div>

      <div className={viewStackClass}>
        <p className={cn(compactCopyClass, "mt-[-4px] leading-[1.55]")}>
          Filter the curated stack by investment mandate—land and development,
          partnership asks, or turn-key income.
        </p>

        <div className="grid gap-[10px]">
          <p className={sectionLabel}>Category</p>
          <div
            className="mt-0 flex flex-wrap gap-[10px]"
            role="group"
            aria-label="Investment category"
          >
            {exploreCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                aria-pressed={browseCategoryId === category.id}
                className={chipButton}
                onClick={() => setBrowseCategoryId(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="mt-3 flex justify-end">
            <span className={countPill}>
              {browseFilteredProjects.length} result
              {browseFilteredProjects.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid gap-[10px] pb-[clamp(12px,2.4vw,26px)]">
            {browseFilteredProjects.length ? (
              browseFilteredProjects.map((project) =>
                renderProjectCard(
                  project,
                  <div className="my-[10px] mb-[2px] flex flex-wrap gap-2">
                    <span className={metaPillClass}>
                      {project.categoryLabel}
                    </span>
                  </div>,
                ),
              )
            ) : (
              <div className={emptyStateClass}>
                <p className={sectionLabel}>No matches</p>
                <p className={compactCopyClass}>
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
    <section
      className={cn(detailCard, detailCardScrollShell)}
    >
      <div className={viewStackClass}>
        <section className={detailCard}>
          <div className={sectionHeadClass}>
            <div className="min-w-0">
              <p className={sectionLabel}>Models</p>
              <h2 className={cn(serifHeading, "text-[1.6rem]")}>
                Explore the full 3D library.
              </h2>
            </div>
          </div>
          <p className={cn(compactCopyClass, "mt-[-4px] leading-[1.55]")}>
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
          <section className={detailCard}>
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
    <section
      className={cn(detailCard, detailCardScrollShell)}
    >
      <div className={sectionHeadClass}>
        <div className="min-w-0">
          <p className={sectionLabel}>Platform</p>
          <h2 className={cn(serifHeading, "text-[1.6rem]")}>
            How PRO X wins the room.
          </h2>
        </div>
      </div>

      <div className="grid gap-[14px]">
        <p className="m-0 text-[1.04rem] leading-[1.6] text-pro-text-soft">
          A cinematic capital-raising surface for premium real estate
          opportunities, built to feel closer to private banking than a local
          property portal.
        </p>
        <p className={compactCopyClass}>
          The concept stays intentionally narrow: a curated set of flagship
          opportunities, a map-led market view, and a presentation surface that
          turns static development narratives into investor-facing product
          moments.
        </p>
      </div>

      <div className={sectionHeadClass}>
        <div className="min-w-0">
          <p className={sectionLabel}>Unfair Advantage</p>
          <h3 className={cn(serifHeading, "text-[1.05rem]")}>
            Why this collaboration is compelling.
          </h3>
        </div>
      </div>
      <div className="grid gap-3 pt-4">
        <div className="rounded-2xl bg-white/3 p-[14px]">
          <strong className={cn(serifHeading, "block text-base")}>
            Xplan Studio
          </strong>
          <p className={cn(proseSoft, "mt-2")}>
            Supplies the future-state vision, design language, and 3D material
            that makes the investment story believable.
          </p>
        </div>
        <div className="rounded-2xl bg-white/3 p-[14px]">
          <strong className={cn(serifHeading, "block text-base")}>
            PRO Real Estate
          </strong>
          <p className={cn(proseSoft, "mt-2")}>
            Supplies the market access, investor network, and financing
            narrative that closes the commercial side.
          </p>
        </div>
        <div className="rounded-2xl bg-white/3 p-[14px]">
          <strong className={cn(serifHeading, "block text-base")}>
            Better Tech
          </strong>
          <p className={cn(proseSoft, "mt-2")}>
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
      <label className="block w-full">
        <span className="sr-only">Search deals</span>
        <input
          value={query}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Search by city, land or building"
          className={searchInputClass}
        />
      </label>
      <p className="m-0 text-center text-[0.78rem] leading-[1.45] text-pro-gold-bright drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] max-[820px]:text-[clamp(0.58rem,2.4vw,0.65rem)] max-[820px]:leading-[1.3]">
        {searchHelperText}
      </p>
    </>
  );

  return (
    <main className="relative grid h-dvh min-h-dvh grid-rows-[auto_minmax(0,1fr)] gap-[18px] overflow-hidden p-[18px] *:min-w-0 *:min-h-0 max-[1240px]:h-auto max-[1240px]:min-h-dvh max-[1240px]:gap-3 max-[1240px]:overflow-visible max-[1240px]:pt-[max(16px,env(safe-area-inset-top,0px))] max-[1240px]:pr-[max(16px,env(safe-area-inset-right,0px))] max-[1240px]:pb-[max(16px,env(safe-area-inset-bottom,0px))] max-[1240px]:pl-[max(16px,env(safe-area-inset-left,0px))] max-[820px]:gap-3 max-[820px]:pt-[max(12px,env(safe-area-inset-top,0px))] max-[820px]:pr-[max(12px,env(safe-area-inset-right,0px))] max-[820px]:pb-[max(12px,env(safe-area-inset-bottom,0px))] max-[820px]:pl-[max(12px,env(safe-area-inset-left,0px))]">
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

      <header
        className={cn(
          topbarShellClass,
          "row-start-1 col-start-1 pointer-events-auto",
        )}
      >
        <div className="flex min-w-0 items-center gap-[10px] max-[820px]:grid max-[820px]:w-full max-[820px]:grid-cols-[auto_auto_1fr] max-[820px]:items-center max-[820px]:gap-x-[10px] max-[820px]:gap-y-0">
          <div className={brandMarkClass}>PX</div>
          <span
            className={cn(
              profileAvatarClass,
              "hidden max-[820px]:grid max-[820px]:col-start-3 max-[820px]:row-start-1 max-[820px]:justify-self-end",
            )}
            aria-hidden="true"
          >
            <ProfileAvatarIcon />
          </span>
          <div className="grid min-w-0 gap-[2px] max-[820px]:col-start-2 max-[820px]:row-start-1 max-[820px]:gap-[4px]">
            <strong className="font-sans text-base font-bold uppercase tracking-[0.2em] text-(--gold-bright) antialiased max-[820px]:text-[0.92rem] max-[820px]:tracking-[0.14em]">
              PRO X
            </strong>
            <p className="font-sans m-0 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white antialiased max-[820px]:hidden">
              Invitation-Only Investment Intelligence
            </p>
          </div>
        </div>

        <div
          className={topbarNavTablistClass}
          role="tablist"
          aria-label="PRO X sections"
        >
          {panelViews.map((view) => {
            const isViewActive = activeView === view.id;
            return (
              <button
                key={view.id}
                type="button"
                role="tab"
                aria-selected={isViewActive}
                className={cn(
                  navButton,
                  "min-w-0 flex-1 whitespace-nowrap text-center max-[820px]:min-h-[42px] max-[820px]:py-[10px] max-[820px]:text-[0.72rem]",
                )}
                onClick={() => handleActivateView(view.id)}
              >
                {view.label}
              </button>
            );
          })}
        </div>

        <div
          className="flex min-w-[190px] items-center gap-[10px] justify-self-end rounded-[16px] border border-white/8 bg-white/3 px-[12px] py-[8px] max-[820px]:hidden"
          aria-label="Investor profile placeholder"
        >
          <span className={profileAvatarClass} aria-hidden="true">
            <ProfileAvatarIcon />
          </span>
          <div className="grid gap-1">
            <strong className="font-sans text-[0.88rem] font-bold text-(--text) antialiased">
              Investor Profile
            </strong>
            <span className="font-sans text-[0.7rem] uppercase tracking-[0.08em] text-(--text-soft) antialiased">
              VIP / Standard placeholder
            </span>
          </div>
        </div>
      </header>

      <div
        className={cn(
          pageStageClass,
          "relative z-2 row-start-2 col-start-1",
          shouldShowPanel
            ? "grid grid-cols-[minmax(360px,500px)_minmax(0,1fr)] max-[1360px]:grid-cols-[minmax(320px,440px)_minmax(0,1fr)]"
            : "grid grid-cols-[minmax(0,1fr)]",
        )}
      >
        {shouldShowPanel ? (
          <div className="relative z-2 flex h-full min-h-0 flex-col gap-[18px] pointer-events-auto max-[1240px]:h-auto max-[1240px]:min-h-auto">
            {panelContent}
          </div>
        ) : null}

        <section className="relative min-h-0 overflow-visible bg-transparent pointer-events-none max-[1240px]:z-2 max-[1240px]:min-h-[clamp(108px,24dvh,200px)] max-[1240px]:w-full max-[1240px]:shrink-0">
          {isNarrowStack ? (
            <div className="pointer-events-none absolute left-1/2 top-[max(12px,env(safe-area-inset-top,0px))] z-3 grid w-[min(var(--search-track-width),calc(100%-32px))] -translate-x-1/2 gap-[10px]">
              <div className="pointer-events-auto relative grid w-full gap-3">
                {mapSearchOverlayInner}
              </div>
            </div>
          ) : (
            <div className="pointer-events-auto absolute left-1/2 top-0 z-3 grid w-[min(var(--search-track-width),calc(100%-48px))] -translate-x-1/2 gap-3">
              {mapSearchOverlayInner}
            </div>
          )}
        </section>
      </div>

      {useOpportunityMobileSheet ? (
        <div className="pointer-events-none relative z-4 row-span-full col-start-1">
          {mobileOpportunitySheetOpen ? (
            <div
              className="opportunity-mobile-sheet-scrim pointer-events-auto"
              aria-hidden="true"
              onClick={() => setMobileOpportunitySheetOpen(false)}
            />
          ) : null}
          {mobileOpportunitySheetOpen ? (
            <div
              className="opportunity-mobile-sheet-panel pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="opportunity-sheet-title"
            >
              {renderOpportunityDetails(true)}
            </div>
          ) : (
            <button
              type="button"
              className="opportunity-mobile-sheet-launch pointer-events-auto"
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
