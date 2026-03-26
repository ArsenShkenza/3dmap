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

export function getSearchIntent(query) {
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

export function filterProjectsBySearchQuery(projects, rawQuery) {
  const searchIntent = getSearchIntent(rawQuery);
  return projects.filter(
    (project) =>
      matchesIntent(project, searchIntent) &&
      matchesQuery(project, searchIntent.textQuery)
  );
}
