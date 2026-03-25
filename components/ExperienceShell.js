"use client";

import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useState
} from "react";
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
  prompts
}) {
  const panelViews = [
    { id: "discover", label: "Discover" },
    { id: "opportunity", label: "Opportunity" },
    { id: "platform", label: "Platform" }
  ];
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeView, setActiveView] = useState("opportunity");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(projects[0]?.id ?? null);
  const deferredQuery = useDeferredValue(query);

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
    assetLibrary.find((asset) => asset.id === selectedProject.primaryAssetId) ??
    assetLibrary[0];

  const handlePrompt = (value) => {
    startTransition(() => {
      setQuery(value);
      setActiveCategory("all");
      setActiveView("discover");
    });
  };

  const handleSelectProject = useCallback(
    (projectId, nextView = "opportunity") => {
      setSelectedId(projectId);
      setActiveView(nextView);
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
          <div>
            <p className="section-label">AI Omni-Search</p>
            <h3>Start with a natural-language investor ask.</h3>
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

        <div className="view-section view-section-divided">
          <div className="section-head">
            <div>
              <p className="section-label">Explore</p>
              <h3>Curated access modes.</h3>
            </div>
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

        <div className="view-section view-section-divided">
          <div className="section-head">
            <div>
              <p className="section-label">Curated Access</p>
              <h3>Select an opportunity to open the memo.</h3>
            </div>
          </div>

          <div className="switcher-list">
            {filteredProjects.length ? (
              filteredProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className={`switcher-card${
                    project.id === selectedProject.id ? " active" : ""
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
                  Try a broader investor ask or switch back to All Access to
                  reopen the core pitch deck.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const opportunityContent = (
    <section className="detail-card">
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
      </div>
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
        />
      </section>
    </main>
  );
}
