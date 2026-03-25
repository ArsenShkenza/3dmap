export const exploreCategories = [
  { id: "all", label: "All Access" },
  { id: "land", label: "Land & Development" },
  { id: "partners", label: "Seeking Partners" },
  { id: "turnkey", label: "Turn-key Income" }
];

export const promptExamples = [
  "Find permit-ready resort land on the south coast",
  "Projects in Tirana seeking co-investors with ROI above 8%",
  "Show a stabilized commercial asset in Prishtina"
];

export const assetLibrary = [
  {
    id: "asset-louisiana-state-house",
    label: "Coastal Resort Hero",
    fileName: "louisiana_state_house.glb",
    src: "/assets/louisiana_state_house.glb",
    posterSrc: "/assets/building.png",
    assignedProjectId: "palase-riviera-resort"
  },
  {
    id: "asset-le-millefiori",
    label: "Boulevard Tower Hero",
    fileName: "le_millefiori.glb",
    src: "/assets/le_millefiori.glb",
    posterSrc: "/assets/building.png",
    assignedProjectId: "boulevard-crown-tower"
  },
  {
    id: "asset-singer-building",
    label: "Prishtina Office Hero",
    fileName: "singer_building.glb",
    src: "/assets/singer_building.glb",
    posterSrc: "/assets/building.png",
    assignedProjectId: "prishtina-prime-offices"
  },
  {
    id: "asset-skyscraper",
    label: "Skyscraper Concept",
    fileName: "skyscraper.glb",
    src: "/assets/skyscraper.glb",
    posterSrc: "/assets/building.png",
    assignedProjectId: null
  },
  {
    id: "asset-lantern",
    label: "Lantern Object Study",
    fileName: "lantern.glb",
    src: "/assets/lantern.glb",
    posterSrc: "/assets/building.png",
    assignedProjectId: null
  },
  {
    id: "asset-boombox",
    label: "Boombox Object Study",
    fileName: "boombox.glb",
    src: "/assets/boombox.glb",
    posterSrc: "/assets/building.png",
    assignedProjectId: null
  },
  {
    id: "asset-duck",
    label: "Duck Object Study",
    fileName: "duck.glb",
    src: "/assets/duck.glb",
    posterSrc: "/assets/building.png",
    assignedProjectId: null
  },
  {
    id: "asset-avocado",
    label: "Avocado Object Study",
    fileName: "avocado.glb",
    src: "/assets/avocado.glb",
    posterSrc: "/assets/building.png",
    assignedProjectId: null
  }
];

export const projects = [
  {
    id: "palase-riviera-resort",
    name: "Palase Riviera Resort Site",
    city: "Palase",
    district: "Southern Coastline",
    categoryId: "land",
    categoryLabel: "Land & Development",
    access: "VIP",
    roi: "12.8%",
    ticket: "EUR 10.8M equity",
    stage: "Approved Permit",
    stageSummary:
      "A resort-ready south-coast land play with permit clarity and strong visual storytelling potential.",
    memo:
      "This is the flagship land-and-development opportunity in the concept pitch: a permit-backed coastal site that allows the conversation to move quickly from empty land to future-value narrative.",
    thesis:
      "The brief specifically needs a premium land story with real visual upside, and Palase gives us the strongest contrast between today's parcel and tomorrow's resort identity.",
    narrative:
      "Open with coastline scarcity and permit readiness, then use the 3D preview to help investors imagine the destination outcome rather than only the land basis.",
    sponsor: "PRO Real Estate x Xplan Studio",
    program: "Luxury resort masterplan",
    landSize: "50,000 m2 coastal land bank",
    diligence: "Permit package, site narrative, financial projections",
    virtualExperience:
      "Use the render to answer the investor's real question: what does this empty site become once Xplan's resort vision is built?",
    timeline: [
      "Land Control",
      "Approved Permit",
      "Capital Raise",
      "Construction Launch"
    ],
    searchTerms: [
      "palase",
      "south coast",
      "resort",
      "permit",
      "land",
      "development",
      "vip"
    ],
    center: [19.5935, 40.1708],
    bearing: -28,
    zoom: 14.8,
    pitch: 60,
    footprint: [
      [19.5919, 40.1698],
      [19.5954, 40.1698],
      [19.5961, 40.1716],
      [19.5926, 40.1718],
      [19.5919, 40.1698]
    ],
    floorCount: 12,
    floorHeight: 3.8,
    massingHeight: 45.6,
    primaryAssetId: "asset-louisiana-state-house",
    modelLabel: "Future resort massing preview",
    mapAccent: "#d4aa6d"
  },
  {
    id: "boulevard-crown-tower",
    name: "Boulevard Crown Tower",
    city: "Tirana",
    district: "Bulevardi i Ri",
    categoryId: "partners",
    categoryLabel: "Seeking Partners",
    access: "Invite Only",
    roi: "9.2%",
    ticket: "EUR 8.5M for 30%",
    stage: "Capital Raise",
    stageSummary:
      "A central-city tower concept in Tirana structured around a polished co-investment story.",
    memo:
      "This is the partnership-led prestige asset in the deck: high visibility, strong city symbolism, and a cleaner institutional pitch than a speculative listing-style opportunity.",
    thesis:
      "The project matches the brief's co-investment requirement closely because the capital ask, partnership angle, and city positioning are all immediately legible.",
    narrative:
      "Frame it as access to a visible Tirana address with a ready-made business story, not just a tower that needs capital.",
    sponsor: "PRO Capital Desk",
    program: "18-floor mixed-use tower",
    landSize: "3,900 m2 urban site",
    diligence: "Business plan, co-investment structure, design package",
    virtualExperience:
      "Use the tower model as the bridge between financial partnership language and architectural ambition.",
    timeline: [
      "Concept Locked",
      "Business Plan",
      "Capital Raise",
      "Permit Delivery"
    ],
    searchTerms: [
      "tirana",
      "partner",
      "co-investor",
      "tower",
      "boulevard",
      "central",
      "raise"
    ],
    center: [19.8317, 41.3406],
    bearing: -12,
    zoom: 16.15,
    pitch: 63,
    footprint: [
      [19.83145, 41.34042],
      [19.83192, 41.3404],
      [19.83203, 41.34075],
      [19.83157, 41.34079],
      [19.83145, 41.34042]
    ],
    floorCount: 18,
    floorHeight: 3.45,
    massingHeight: 62.1,
    primaryAssetId: "asset-le-millefiori",
    modelLabel: "Mixed-use tower preview",
    mapAccent: "#83b7ff"
  },
  {
    id: "prishtina-prime-offices",
    name: "Prishtina Prime Offices",
    city: "Prishtina",
    district: "Central Business District",
    categoryId: "turnkey",
    categoryLabel: "Turn-key Income",
    access: "Open",
    roi: "8.1%",
    ticket: "EUR 6.2M acquisition",
    stage: "Stabilized Asset",
    stageSummary:
      "A finished office asset with lease-backed cash flow and lower-volatility investor messaging.",
    memo:
      "This is the credibility anchor of the concept deck: a completed commercial asset that balances the vision-heavy opportunities with immediate income logic.",
    thesis:
      "The brief asks for a finished commercial example, and this one gives the deck a calmer yield story after the more ambitious development narratives.",
    narrative:
      "Position it as proof that the platform can speak to both upside capital and capital preservation in the same interface.",
    sponsor: "PRO Asset Advisory",
    program: "Leased Grade-A office floors",
    landSize: "Completed CBD asset",
    diligence: "Lease summary, occupancy pack, yield snapshot",
    virtualExperience:
      "The 3D stage gives even the stabilized asset a premium walkthrough feel instead of a dry PDF-only presentation.",
    timeline: ["Completed", "Leased", "Cash Flow", "Refinance or Exit"],
    searchTerms: [
      "prishtina",
      "office",
      "yield",
      "built",
      "turnkey",
      "leased",
      "commercial"
    ],
    center: [21.1618, 42.6627],
    bearing: 16,
    zoom: 15.8,
    pitch: 58,
    footprint: [
      [21.16153, 42.6625],
      [21.16201, 42.66246],
      [21.16212, 42.66282],
      [21.16166, 42.66287],
      [21.16153, 42.6625]
    ],
    floorCount: 37,
    floorHeight: 3.2,
    massingHeight: 44.8,
    primaryAssetId: "asset-singer-building",
    modelLabel: "Stabilized office asset preview",
    mapAccent: "#61c3a5"
  }
];
