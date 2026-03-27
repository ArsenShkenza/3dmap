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

const exteriorAssets = [
  {
    id: "asset-lorton-field",
    label: "Field Development Site",
    fileName: "lorton_field.glb",
    src: "/assets/exterior/lorton_field.glb",
    assignedProjectId: "lorton-field-estates",
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-louisiana-state-house",
    label: "Coastal Resort Hero",
    fileName: "louisiana_state_house.glb",
    src: "/assets/exterior/louisiana_state_house.glb",
    assignedProjectId: "palase-riviera-resort",
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-le-millefiori",
    label: "Tirana tower massing (library)",
    fileName: "le_millefiori.glb",
    src: "/assets/exterior/le_millefiori.glb",
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-singer-building",
    label: "Prishtina Office Hero",
    fileName: "singer_building.glb",
    src: "/assets/exterior/singer_building.glb",
    assignedProjectId: "prishtina-prime-offices",
    capabilities: {
      floorExplorer: false
    },
    floorExplorer: {
      mode: "namedNodes",
      supportedModes: ["namedNodes"],
      namedNodePattern: "floor_01",
      shellNodePatterns: ["shell", "core", "base", "roof", "penthouse"]
    }
  },
  {
    id: "asset-exterior-building",
    label: "Generic building shell",
    fileName: "building.glb",
    src: "/assets/exterior/building.glb",
    assignedProjectId: "tirana-core-midrise",
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-exterior-building-03",
    label: "Exterior building 03",
    fileName: "building_03.glb",
    src: "/assets/exterior/building_03.glb",
    assignedProjectId: "durres-waterfront-block",
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-exterior-building-06",
    label: "Exterior building 06",
    fileName: "building_06.glb",
    src: "/assets/exterior/building_06.glb",
    assignedProjectId: "vlora-harbor-office",
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-exterior-brutalist-tricorner",
    label: "Brutalist tricorner tower",
    fileName: "building_brutalist_tricorner.glb",
    src: "/assets/exterior/building_brutalist_tricorner.glb",
    assignedProjectId: "tirana-brutalist-icon",
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-exterior-school",
    label: "School building",
    fileName: "school_building.glb",
    src: "/assets/exterior/school_building.glb",
    assignedProjectId: "shkoder-campus-hub",
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-exterior-tokyo-otemachi-6",
    label: "Tokyo Otemachi pack — building 6",
    fileName: "building_no_6_form_tokyo_otemachi_building_pack.glb",
    src: "/assets/exterior/building_no_6_form_tokyo_otemachi_building_pack.glb",
    assignedProjectId: "tirana-cbd-reference",
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-exterior-office-2",
    label: "Office building variant 2",
    fileName: "office_building_2 (1).glb",
    src: "/assets/exterior/office_building_2%20(1).glb",
    assignedProjectId: "pristina-financial-plaza",
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-exterior-residential-parking",
    label: "Residential with parking podium",
    fileName: "residential_building_with_parking_lot.glb",
    src: "/assets/exterior/residential_building_with_parking_lot.glb",
    assignedProjectId: "tirana-residential-podium",
    capabilities: {
      floorExplorer: false
    }
  }
];

const fullAssets = [
  {
    id: "asset-building-interior-effect",
    label: "Integrated Tower Experience",
    fileName: "building__interior_effect.glb",
    src: "/assets/full/building__interior_effect.glb",
    assignedProjectId: "tirana-signature-residences",
    capabilities: {
      floorExplorer: false
    }
  }
];

const interiorAssets = [
  {
    id: "asset-smart-home-apartment",
    label: "Smart Apartment Demo",
    fileName: "smart_home_interior_floor_plan.glb",
    src: "/assets/interior/smart_home_interior_floor_plan.glb",
    assignedProjectId: "palase-riviera-resort",
    viewerMode: "interior-navigation",
    viewerLabel: "Interior Navigation",
    viewerConfig: {
      cameraOrbit: "-22deg 82deg 34%",
      minCameraOrbit: "auto 0deg 3%",
      maxCameraOrbit: "auto 89deg 260%",
      minFieldOfView: "10deg",
      maxFieldOfView: "60deg",
      interactionPrompt: "auto",
      autoRotate: false
    },
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-interior-scene-living",
    label: "Living Interior Scene",
    fileName: "interior_scene_-_living.glb",
    src: "/assets/interior/interior_scene_-_living.glb",
    assignedProjectId: "palase-riviera-resort",
    viewerMode: "interior-navigation",
    viewerLabel: "Interior Navigation",
    viewerConfig: {
      cameraOrbit: "-18deg 84deg 30%",
      minCameraOrbit: "auto 0deg 2%",
      maxCameraOrbit: "auto 89deg 240%",
      minFieldOfView: "9deg",
      maxFieldOfView: "58deg",
      interactionPrompt: "auto",
      autoRotate: false
    },
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-top-down-interior",
    label: "Top-Down Interior Environment",
    fileName: "top_down_interior_environment.glb",
    src: "/assets/interior/top_down_interior_environment.glb",
    assignedProjectId: "prishtina-prime-offices",
    viewerMode: "interior-navigation",
    viewerLabel: "Interior Navigation",
    viewerConfig: {
      cameraOrbit: "0deg 8deg 62%",
      minCameraOrbit: "auto 0deg 8%",
      maxCameraOrbit: "auto 70deg 260%",
      minFieldOfView: "12deg",
      maxFieldOfView: "52deg",
      interactionPrompt: "auto",
      autoRotate: false
    },
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-restaurant-interior",
    label: "Restaurant Interior Scene",
    fileName: "low_poly_restaurant_interior_scene.glb",
    src: "/assets/interior/low_poly_restaurant_interior_scene.glb",
    assignedProjectId: "palase-riviera-resort",
    viewerMode: "interior-navigation",
    viewerLabel: "Interior Navigation",
    viewerConfig: {
      cameraOrbit: "-24deg 80deg 38%",
      minCameraOrbit: "auto 0deg 3%",
      maxCameraOrbit: "auto 89deg 280%",
      minFieldOfView: "10deg",
      maxFieldOfView: "58deg",
      interactionPrompt: "auto",
      autoRotate: false
    },
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-home-interior",
    label: "Home Interior",
    fileName: "home_interior.glb",
    src: "/assets/interior/home_interior.glb",
    assignedProjectId: "lorton-field-estates",
    viewerMode: "interior-navigation",
    viewerLabel: "Interior Navigation",
    viewerConfig: {
      cameraOrbit: "-20deg 82deg 32%",
      minCameraOrbit: "auto 0deg 2%",
      maxCameraOrbit: "auto 89deg 250%",
      minFieldOfView: "9deg",
      maxFieldOfView: "58deg",
      interactionPrompt: "auto",
      autoRotate: false
    },
    capabilities: {
      floorExplorer: false
    }
  }
];

export const assetLibrary = [
  ...exteriorAssets,
  ...fullAssets,
  ...interiorAssets
];

/** Minimal project shape for ModelStage when previewing vault assets outside a deal */
export const assetVaultPreviewProject = {
  id: "asset-vault-preview",
  name: "Asset vault",
  virtualExperience:
    "Preview from the full model library. Inspect scale and framing before mapping this file to an opportunity."
};

export const projects = [
  {
    id: "palase-riviera-resort",
    name: "Palase Riviera Resort Site",
    city: "Palase",
    district: "Southern Coastline",
    propertyType: "building",
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
      "Open with coastline scarcity and permit readiness, then use the 3D preview to help investors imagine the destination outcome rather than only the land basis. In this room, lead with the resort-scale exterior, then switch into a representative apartment file to show the lived-in hospitality product behind the site story.",
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
    fullProjectFlow: {
      type: "separate-files",
      unitAssets: [
        {
          id: "unit-residence",
          label: "Residence Demo",
          assetId: "asset-smart-home-apartment",
          copy:
            "Use this apartment model as the unit-level hospitality proof point while the main building file keeps the coastal development story anchored at full-project scale."
        },
        {
          id: "unit-living-scene",
          label: "Living Interior",
          assetId: "asset-interior-scene-living",
          copy:
            "Use this authored living-scene interior as the softer hospitality moment in the project room, giving the resort story a more tangible guest-space reference."
        },
        {
          id: "unit-restaurant-scene",
          label: "Restaurant Interior",
          assetId: "asset-restaurant-interior",
          copy:
            "This restaurant interior adds a hospitality-focused dining atmosphere so the resort story can move beyond the shell and into guest-facing experience."
        }
      ]
    },
    modelLabel: "Future resort massing preview",
    mapAccent: "#d4aa6d"
  },
  {
    id: "lorton-field-estates",
    name: "Lorton Field Estates",
    city: "Tirana",
    district: "Eastern Growth Corridor",
    propertyType: "land",
    categoryId: "land",
    categoryLabel: "Land & Development",
    access: "Invite Only",
    roi: "11.1%",
    ticket: "EUR 7.4M equity",
    stage: "Site Assembly",
    stageSummary:
      "A land-first residential field play that uses the map for parcel selection and the project room for future-home interior storytelling.",
    memo:
      "This opportunity works as the cleaner suburban field story in the deck: open land, residential upside, and a direct bridge from parcel logic into eventual home experience.",
    thesis:
      "The field asset makes the land legible on the map, while the home interior gives investors a more emotional sense of the residential product without pretending the site is already vertical.",
    narrative:
      "Lead with land control and growth-corridor positioning, then open the project room to pair the field story with a future-home interior reference.",
    sponsor: "PRO Land Desk",
    program: "Low-rise residential field development",
    landSize: "18,400 m2 assembled field parcel",
    diligence: "Parcel survey, zoning memo, residential concept package",
    virtualExperience:
      "Use the field model to keep the site legible on the map, then switch into the home interior to show the product direction the land is meant to unlock.",
    timeline: [
      "Site Assembly",
      "Concept Framing",
      "Capital Raise",
      "Planning Submission"
    ],
    searchTerms: [
      "field",
      "land",
      "residential",
      "suburban",
      "tirana",
      "home",
      "development"
    ],
    center: [19.9278, 41.3341],
    bearing: -6,
    zoom: 14.9,
    pitch: 58,
    footprint: [
      [19.92694, 41.33352],
      [19.92868, 41.33345],
      [19.92895, 41.33455],
      [19.92712, 41.33473],
      [19.92694, 41.33352]
    ],
    floorCount: 3,
    floorHeight: 3.4,
    massingHeight: 10.2,
    primaryAssetId: "asset-lorton-field",
    fullProjectFlow: {
      type: "separate-files",
      overviewCopy:
        "Use the field asset as the parcel-scale development story, then switch into the home interior to preview the future residential product.",
      unitAssets: [
        {
          id: "unit-home-interior",
          label: "Home Interior",
          assetId: "asset-home-interior",
          copy:
            "This home interior acts as the residential proof of concept for the field opportunity, helping the land story connect to an eventual lived product."
        }
      ]
    },
    modelLabel: "Residential field development preview",
    mapAccent: "#9ecb7f",
    mapModelBaseHeight: 0.55,
    mapModelElevation: 0.35
  },
  {
    id: "tirana-signature-residences",
    name: "Tirana Signature Residences",
    city: "Tirana",
    district: "New Boulevard South",
    propertyType: "building",
    categoryId: "partners",
    categoryLabel: "Seeking Partners",
    access: "Invite Only",
    roi: "10.4%",
    ticket: "EUR 11.2M equity",
    stage: "Concept Review",
    stageSummary:
      "A premium Tirana tower story built around a single integrated GLB that already carries both exterior identity and interior atmosphere.",
    memo:
      "This opportunity is useful when the pitch needs a richer architectural story in one move: skyline presence, residential ambition, and a more immersive investor reveal without changing files.",
    thesis:
      "The combined exterior-plus-interior model makes this the strongest proof point for how PRO X can move from city-scale positioning into a more tactile building experience inside one project room.",
    narrative:
      "Lead with the tower as a landmark object on the map, then use the integrated full-project review to show that the building already contains enough authored depth for a more premium walkthrough.",
    sponsor: "PRO Capital Desk x Design Narrative Lab",
    program: "22-floor signature residential tower",
    landSize: "4,600 m2 central Tirana site",
    diligence: "Design package, interior concept, investment structure",
    virtualExperience:
      "Use the integrated building model as a single review object that can sell both skyline presence and interior quality without fragmenting the story into separate files.",
    timeline: [
      "Design Narrative",
      "Capital Structuring",
      "Partner Alignment",
      "Permit Readiness"
    ],
    searchTerms: [
      "tirana",
      "signature",
      "residential",
      "interior",
      "tower",
      "integrated",
      "partners"
    ],
    center: [19.83615, 41.33378],
    bearing: -18,
    zoom: 16.05,
    pitch: 64,
    footprint: [
      [19.83591, 41.3336],
      [19.83636, 41.33358],
      [19.83649, 41.33393],
      [19.83603, 41.33397],
      [19.83591, 41.3336]
    ],
    elevationImageSrc: "/assets/tirana-signature-residences-2d.jpg",
    floorCount: 3,
    floorHeight: 3.25,
    massingHeight: 71.5,
    primaryAssetId: "asset-building-interior-effect",
    fullProjectFlow: {
      type: "integrated-building",
      overviewCopy:
        "Use the integrated tower GLB as a single investor review object: exterior massing for skyline context, with authored interior detail already embedded in the same building file.",
      viewerMode: "interior-navigation",
      viewerLabel: "Interior Navigation",
      viewerCopy:
        "Scroll to move through the tower envelope, then drag to navigate the interior spaces already authored inside the same building file.",
      viewerConfig: {
        cameraOrbit: "-18deg 78deg 42%",
        minCameraOrbit: "auto 0deg 4%",
        maxCameraOrbit: "auto 89deg 240%",
        minFieldOfView: "12deg",
        maxFieldOfView: "56deg",
        interactionPrompt: "auto",
        autoRotate: false
      }
    },
    modelLabel: "Integrated exterior and interior tower preview",
    mapAccent: "#b993ff",
    floorExplorer: {
      enabled: false,
      pilotObject: true,
      contract:
        "This integrated GLB is review-ready as one building object. If floor-by-floor storytelling is needed later, the export should introduce explicit named floor groups."
    }
  },
  {
    id: "prishtina-prime-offices",
    name: "Prishtina Prime Offices",
    city: "Prishtina",
    district: "Central Business District",
    propertyType: "building",
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
    fullProjectFlow: {
      type: "separate-files",
      overviewCopy:
        "Start with the full office building, then open a representative apartment-style unit file as an interior prototype for premium fitted space.",
      unitAssets: [
        {
          id: "unit-top-down",
          label: "Top-Down Interior",
          assetId: "asset-top-down-interior",
          copy:
            "This top-down interior acts as a space-planning proof point for the office story, giving the project room a clearer fitted-layout reference."
        }
      ]
    },
    modelLabel: "Stabilized office asset preview",
    mapAccent: "#61c3a5",
    floorExplorer: {
      enabled: false,
      pilotObject: true,
      contract:
        "Floor-by-floor exploration requires a floor-authored GLB with named groups such as floor_01, floor_02, floor_03.",
      overviewLabel: "Office Exterior",
      floorLabelPrefix: "Office Floor",
      floorLabels: {
        1: "Reception & Lobby",
        5: "Anchor Tenant Floor",
        9: "Executive Suites",
        14: "Penthouse Offices"
      },
      focusCopy: {
        1: "Lead with the reception floor to show institutional arrival quality and tenant-facing polish rather than only rent-roll numbers.",
        5: "The anchor-tenant layer is the clearest leasing proof point, useful when the investor conversation shifts to durability of cash flow.",
        9: "Executive suites keep the office story premium, showing why the asset is more than a stabilized box in the CBD.",
        14: "The top floor reinforces exit optionality and prestige, which helps the yield story feel differentiated instead of purely defensive."
      }
    }
  },
  {
    id: "tirana-core-midrise",
    name: "Tirana Core Midrise Prototype",
    city: "Tirana",
    district: "Ring Road East",
    propertyType: "building",
    categoryId: "partners",
    categoryLabel: "Seeking Partners",
    access: "Invite Only",
    roi: "9.6%",
    ticket: "EUR 5.4M co-equity",
    stage: "Concept Framing",
    stageSummary:
      "A disciplined mid-rise shell study for investors who want a clean urban block narrative without over-building the story.",
    memo:
      "This slot uses a neutral hero massing file so the conversation can stay about structure, height envelope, and repeatable floor logic before any bespoke branding.",
    thesis:
      "When the deck needs a third or fourth Tirana reference without duplicating the signature tower story, this prototype keeps the map credible and the memo short.",
    narrative:
      "Position it as a capital-efficient urban infill option: visible on the map, legible in the viewer, easy to pair with your own underwriting.",
    sponsor: "PRO Capital Desk",
    program: "12-floor mixed-use prototype",
    landSize: "2,800 m2 corner infill",
    diligence: "Massing study, partner term sheet draft",
    virtualExperience:
      "Use the exterior GLB as a volume reference while the commercial story stays in the memo and ticket line.",
    timeline: ["Massing Lock", "Partner Sounding", "Capital Ask", "Permit Track"],
    searchTerms: [
      "tirana",
      "midrise",
      "prototype",
      "ring",
      "partners",
      "building",
      "shell"
    ],
    center: [19.7992, 41.3184],
    bearing: -22,
    zoom: 16.1,
    pitch: 62,
    footprint: [
      [19.7989, 41.31825],
      [19.7995, 41.31822],
      [19.79955, 41.31855],
      [19.79895, 41.31858],
      [19.7989, 41.31825]
    ],
    floorCount: 12,
    floorHeight: 3.35,
    massingHeight: 40.2,
    primaryAssetId: "asset-exterior-building",
    modelLabel: "Mid-rise urban shell preview",
    mapAccent: "#c4a574"
  },
  {
    id: "durres-waterfront-block",
    name: "Durrës Waterfront Block Study",
    city: "Durrës",
    district: "Port Adjacent",
    propertyType: "building",
    categoryId: "land",
    categoryLabel: "Land & Development",
    access: "Invite Only",
    roi: "11.4%",
    ticket: "EUR 6.8M land + pre-lease",
    stage: "Pre-Permit",
    stageSummary:
      "A coastal-adjacent block massing that reads well on the map when the pitch needs Adriatic exposure without the Palase resort arc.",
    memo:
      "The file is a second waterfront vocabulary for the deck: denser urban frontage, less resort, more city port energy.",
    thesis:
      "Diversifies the geography story north of Vlorë and south of Tirana while keeping the same investor UI patterns.",
    narrative:
      "Lead with port adjacency and summer demand, then let the model carry the height and podium read.",
    sponsor: "PRO Coastal Desk",
    program: "Waterfront podium + tower option",
    landSize: "4,200 m2 assembled strip",
    diligence: "Coastal zoning memo, traffic snapshot",
    virtualExperience:
      "Rotate the block in the viewer to explain podium retail logic versus tower residential above.",
    timeline: ["Land Control", "Design Optioneering", "Permit", "Raise"],
    searchTerms: [
      "durres",
      "waterfront",
      "port",
      "adriatic",
      "block",
      "development"
    ],
    center: [19.4456, 41.3231],
    bearing: 8,
    zoom: 15.95,
    pitch: 58,
    footprint: [
      [19.4453, 41.32295],
      [19.4459, 41.32292],
      [19.44595, 41.32325],
      [19.44535, 41.32328],
      [19.4453, 41.32295]
    ],
    floorCount: 16,
    floorHeight: 3.3,
    massingHeight: 52.8,
    primaryAssetId: "asset-exterior-building-03",
    modelLabel: "Waterfront block massing",
    mapAccent: "#6eb8d6"
  },
  {
    id: "vlora-harbor-office",
    name: "Vlorë Harbor Office Shell",
    city: "Vlorë",
    district: "Harbor Quarter",
    propertyType: "building",
    categoryId: "partners",
    categoryLabel: "Seeking Partners",
    access: "VIP",
    roi: "10.1%",
    ticket: "EUR 7.1M equity",
    stage: "Investor Teasers",
    stageSummary:
      "A harbor-quarter office shell for conversations where Vlorë momentum matters as much as Tirana.",
    memo:
      "Adds a southern coastal city pin without overlapping the Palase land play—this one is built-form and employment-led.",
    thesis:
      "Useful when investors ask for proof that the platform spans more than one Adriatic story.",
    narrative:
      "Frame harbor logistics, services growth, and a mid-rise office envelope that feels institution-ready.",
    sponsor: "PRO Adriatic Partners",
    program: "14-floor office over retail",
    landSize: "3,100 m2 urban parcel",
    diligence: "Harbor economic note, tenant interest letters",
    virtualExperience:
      "The exterior file sells the silhouette; pair it with yield assumptions in the memo.",
    timeline: ["Site Shortlist", "Design Partner", "Raise", "Groundbreak"],
    searchTerms: [
      "vlora",
      "vlore",
      "vlorë",
      "harbor",
      "office",
      "adriatic",
      "coast",
      "partners"
    ],
    center: [19.4902, 40.4726],
    bearing: -14,
    zoom: 16.2,
    pitch: 60,
    footprint: [
      [19.4899, 40.47245],
      [19.4905, 40.47242],
      [19.49055, 40.47275],
      [19.48995, 40.47278],
      [19.4899, 40.47245]
    ],
    floorCount: 14,
    floorHeight: 3.4,
    massingHeight: 47.6,
    primaryAssetId: "asset-exterior-building-06",
    modelLabel: "Harbor office envelope",
    mapAccent: "#7aa3ff"
  },
  {
    id: "tirana-brutalist-icon",
    name: "Tirana Brutalist Icon Study",
    city: "Tirana",
    district: "Creative Belt",
    propertyType: "building",
    categoryId: "partners",
    categoryLabel: "Seeking Partners",
    access: "Invite Only",
    roi: "10.9%",
    ticket: "EUR 9.5M equity",
    stage: "Design Narrative",
    stageSummary:
      "A bold tricorner massing for investors who respond to architectural character as a differentiation signal.",
    memo:
      "The brutalist-inspired shell is a deliberate contrast to glass curtain-wall towers elsewhere in the deck.",
    thesis:
      "Captures attention in the project room when the audience is design-literate or institutionally bored of generic boxes.",
    narrative:
      "Sell scarcity of form, then anchor back to floor plates and partnership economics in conversation.",
    sponsor: "PRO Capital Desk x Atelier Narrative",
    program: "Iconic mixed tower",
    landSize: "3,400 m2 triangular site",
    diligence: "Structural concept, brand positioning study",
    virtualExperience:
      "Let the model-viewer carry the drama; keep numbers in the left rail memo.",
    timeline: ["Icon Study", "Partner Deck", "Raise", "Permit"],
    searchTerms: [
      "tirana",
      "brutalist",
      "icon",
      "tower",
      "design",
      "creative",
      "partners"
    ],
    center: [19.8185, 41.3291],
    bearing: -35,
    zoom: 16.35,
    pitch: 66,
    footprint: [
      [19.8182, 41.32895],
      [19.8188, 41.32892],
      [19.81885, 41.32925],
      [19.81825, 41.32928],
      [19.8182, 41.32895]
    ],
    floorCount: 20,
    floorHeight: 3.5,
    massingHeight: 70,
    primaryAssetId: "asset-exterior-brutalist-tricorner",
    modelLabel: "Tricorner tower preview",
    mapAccent: "#a89f91"
  },
  {
    id: "shkoder-campus-hub",
    name: "Shkodër Campus Learning Hub",
    city: "Shkodër",
    district: "University Edge",
    propertyType: "building",
    categoryId: "partners",
    categoryLabel: "Seeking Partners",
    access: "Open",
    roi: "8.7%",
    ticket: "EUR 4.2M PPP-leaning",
    stage: "Municipal Dialogue",
    stageSummary:
      "A civic-scale school massing for education-adjacent capital and long-hold impact narratives.",
    memo:
      "Expands the map north and signals that PRO X can speak to institutional and development finance beyond pure luxury residential.",
    thesis:
      "The school shell is a credibility flex for conversations with DFIs, municipalities, or family offices with education mandates.",
    narrative:
      "Emphasize durable cash-flow structures and community lock-in before zooming the map to the site.",
    sponsor: "PRO Civic Infrastructure",
    program: "Campus hub + shared sports block",
    landSize: "12,000 m2 education zone",
    diligence: "Municipal LOI, OPEX model draft",
    virtualExperience:
      "Use the exterior to show scale against surrounding blocks when investors ask for context.",
    timeline: ["Municipal Alignment", "Partner Group", "Financing", "Build"],
    searchTerms: [
      "shkoder",
      "shkodër",
      "school",
      "campus",
      "education",
      "civic",
      "ppp"
    ],
    center: [19.5124, 42.0685],
    bearing: 12,
    zoom: 15.65,
    pitch: 55,
    footprint: [
      [19.512, 42.06832],
      [19.5128, 42.06828],
      [19.51285, 42.06868],
      [19.51205, 42.06872],
      [19.512, 42.06832]
    ],
    floorCount: 5,
    floorHeight: 4.2,
    massingHeight: 21,
    primaryAssetId: "asset-exterior-school",
    modelLabel: "Campus learning hub shell",
    mapAccent: "#8fbc8f"
  },
  {
    id: "tirana-cbd-reference",
    name: "Tirana CBD Reference Tower",
    city: "Tirana",
    district: "Central Business Ring",
    propertyType: "building",
    categoryId: "turnkey",
    categoryLabel: "Turn-key Income",
    access: "Invite Only",
    roi: "8.4%",
    ticket: "EUR 12.5M forward sale option",
    stage: "Stabilization Path",
    stageSummary:
      "A tight CBD reference massing for yield-first investors comparing floorplates across markets.",
    memo:
      "The imported reference geometry reads as institutional office without pretending it is a leased asset yet—use it as a comparables anchor.",
    thesis:
      "Gives the deck a second office vocabulary beside Prishtina Prime Offices for side-by-side geography conversations.",
    narrative:
      "Pair with lease-market commentary in the memo; let the map show Tirana versus Prishtina proximity.",
    sponsor: "PRO Asset Advisory",
    program: "CBD office tower reference",
    landSize: "3,600 m2 CBD infill",
    diligence: "Rent comps, cap-rate sensitivity",
    virtualExperience:
      "Rotate the tower to discuss core versus perimeter floor desirability.",
    timeline: ["Reference Lock", "Tenant Outreach", "Sale or Hold"],
    searchTerms: [
      "tirana",
      "cbd",
      "office",
      "yield",
      "reference",
      "tower",
      "turnkey"
    ],
    center: [19.8055, 41.3268],
    bearing: 20,
    zoom: 16.25,
    pitch: 59,
    footprint: [
      [19.8052, 41.32665],
      [19.8058, 41.32662],
      [19.80585, 41.32695],
      [19.80525, 41.32698],
      [19.8052, 41.32665]
    ],
    floorCount: 18,
    floorHeight: 3.25,
    massingHeight: 58.5,
    primaryAssetId: "asset-exterior-tokyo-otemachi-6",
    modelLabel: "CBD reference massing",
    mapAccent: "#8899aa"
  },
  {
    id: "pristina-financial-plaza",
    name: "Prishtina Financial Plaza Option",
    city: "Prishtina",
    district: "Finance Corridor",
    propertyType: "building",
    categoryId: "partners",
    categoryLabel: "Seeking Partners",
    access: "VIP",
    roi: "9.5%",
    ticket: "EUR 8.9M equity",
    stage: "Partner Shortlist",
    stageSummary:
      "A second Prishtina office envelope for side-by-side comparisons with the stabilized Prime Offices story.",
    memo:
      "Keeps Kosovo on the map twice: one stabilized narrative, one development-forward massing using the alternate office GLB.",
    thesis:
      "Investors often ask for option B in the same city; this is the deliberate counterweight.",
    narrative:
      "Use markers two blocks apart on the map to explain sub-market nuance without leaving the interface.",
    sponsor: "PRO Balkan Capital",
    program: "16-floor financial plaza",
    landSize: "2,950 m2 CBD parcel",
    diligence: "Bank covenant review, parking study",
    virtualExperience:
      "Highlight podium height versus tower set-back in the viewer when discussing FAR.",
    timeline: ["Partner DD", "Structure", "Raise", "Build"],
    searchTerms: [
      "prishtina",
      "pristina",
      "office",
      "plaza",
      "kosovo",
      "finance",
      "partners"
    ],
    center: [21.1585, 42.6645],
    bearing: -10,
    zoom: 16,
    pitch: 57,
    footprint: [
      [21.1582, 42.66432],
      [21.1588, 42.66429],
      [21.15885, 42.66462],
      [21.15825, 42.66465],
      [21.1582, 42.66432]
    ],
    floorCount: 16,
    floorHeight: 3.35,
    massingHeight: 53.6,
    primaryAssetId: "asset-exterior-office-2",
    modelLabel: "Financial plaza shell",
    mapAccent: "#5c9fd4"
  },
  {
    id: "tirana-residential-podium",
    name: "Tirana Podium Residential Block",
    city: "Tirana",
    district: "New Boulevard North",
    propertyType: "building",
    categoryId: "partners",
    categoryLabel: "Seeking Partners",
    access: "Invite Only",
    roi: "10.2%",
    ticket: "EUR 10.4M equity",
    stage: "Design Development",
    stageSummary:
      "Residential-over-parking massing for unit-mix conversations where the podium story matters as much as the tower.",
    memo:
      "The GLB foregrounds parking integration—useful when parking cap or EV staging is a diligence theme.",
    thesis:
      "Complements Signature Residences with a more suburban podium language without leaving Tirana.",
    narrative:
      "Walk investors from podium retail and parking through residential lift-off in one continuous map selection.",
    sponsor: "PRO Residential Lab",
    program: "Podium parking + 11 residential floors",
    landSize: "5,200 m2 boulevard parcel",
    diligence: "Parking yield model, unit mix matrix",
    virtualExperience:
      "Tilt the model to show podium scale relative to upper residential stack.",
    timeline: ["Parking Logic", "Unit Mix", "Raise", "Permit"],
    searchTerms: [
      "tirana",
      "residential",
      "podium",
      "parking",
      "boulevard",
      "housing",
      "partners"
    ],
    center: [19.8425, 41.3372],
    bearing: -8,
    zoom: 16.08,
    pitch: 61,
    footprint: [
      [19.8422, 41.33705],
      [19.8428, 41.33702],
      [19.84285, 41.33735],
      [19.84225, 41.33738],
      [19.8422, 41.33705]
    ],
    floorCount: 11,
    floorHeight: 3.15,
    massingHeight: 38.5,
    primaryAssetId: "asset-exterior-residential-parking",
    mapModelBaseHeight: 0.45,
    mapModelElevation: 0.2,
    modelLabel: "Podium residential preview",
    mapAccent: "#d4a574"
  },
  {
    id: "durres-waterfront-district",
    name: "Durrës Waterfront District Cluster",
    city: "Durrës",
    district: "Southern Strand",
    propertyType: "land",
    categoryId: "land",
    categoryLabel: "Land & Development",
    access: "VIP",
    roi: "12.2%",
    ticket: "EUR 14.5M master equity",
    stage: "Masterplan Sketch",
    stageSummary:
      "Multi-building cluster massing for district-scale land stories and phased capital draws.",
    memo:
      "Uses a compact waterfront massing preview—pair with map phasing to explain views, envelopes, and shared infrastructure.",
    thesis:
      "When one building is not enough to explain the opportunity, this pin sells the district imagination.",
    narrative:
      "Start zoomed out on the map, then select to unpack phase-one versus phase-two envelopes in the viewer.",
    sponsor: "PRO Masterplan Studio",
    program: "Phased waterfront district",
    landSize: "38,000 m2 assemblage",
    diligence: "Phasing model, infrastructure capex curve",
    virtualExperience:
      "Orbit the massing to anchor view corridors and staggered delivery against the map story.",
    timeline: ["Assemblage", "Phase 1", "Phase 2", "Exit"],
    searchTerms: [
      "durres",
      "district",
      "masterplan",
      "waterfront",
      "cluster",
      "land",
      "phasing"
    ],
    center: [19.4385, 41.3088],
    bearing: 4,
    zoom: 15.5,
    pitch: 52,
    footprint: [
      [19.4378, 41.3085],
      [19.4392, 41.30845],
      [19.43935, 41.30915],
      [19.43795, 41.30925],
      [19.4378, 41.3085]
    ],
    floorCount: 8,
    floorHeight: 3.2,
    massingHeight: 28,
    primaryAssetId: "asset-exterior-building-03",
    mapModelScale: 0.85,
    modelLabel: "Waterfront massing preview",
    mapAccent: "#5da3a8"
  }
];
