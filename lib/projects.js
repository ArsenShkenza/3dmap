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

const fieldAssets = [
  {
    id: "asset-lorton-field",
    label: "Field Development Site",
    fileName: "lorton_field.glb",
    src: "/assets/lorton_field.glb",
    assignedProjectId: "lorton-field-estates",
    capabilities: {
      floorExplorer: false
    }
  }
];

const buildingAssets = [
  {
    id: "asset-louisiana-state-house",
    label: "Coastal Resort Hero",
    fileName: "louisiana_state_house.glb",
    src: "/assets/louisiana_state_house.glb",
    assignedProjectId: "palase-riviera-resort",
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-le-millefiori",
    label: "Boulevard Tower Hero",
    fileName: "le_millefiori.glb",
    src: "/assets/le_millefiori.glb",
    assignedProjectId: "boulevard-crown-tower",
    capabilities: {
      floorExplorer: false
    },
    floorExplorer: {
      mode: "namedNodes",
      supportedModes: ["namedNodes"],
      namedNodePattern: "floor_01",
      shellNodePatterns: ["shell", "core", "base", "roof"]
    }
  },
  {
    id: "asset-singer-building",
    label: "Prishtina Office Hero",
    fileName: "singer_building.glb",
    src: "/assets/singer_building.glb",
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
    id: "asset-building-interior-effect",
    label: "Integrated Tower Experience",
    fileName: "building__interior_effect.glb",
    src: "/assets/building__interior_effect.glb",
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
    src: "/assets/smart_home_interior_floor_plan.glb",
    assignedProjectId: "boulevard-crown-tower",
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
    src: "/assets/interior_scene_-_living.glb",
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
    src: "/assets/top_down_interior_environment.glb",
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
    src: "/assets/low_poly_restaurant_interior_scene.glb",
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
    src: "/assets/home_interior.glb",
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

export const assetLibrary = [...fieldAssets, ...buildingAssets, ...interiorAssets];

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
    fullProjectFlow: {
      type: "separate-files",
      overviewCopy:
        "Lead with the resort-scale exterior, then switch into a representative apartment file to show the lived-in hospitality product behind the site story.",
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
    fullProjectFlow: {
      type: "separate-files",
      overviewCopy:
        "Open with the full tower massing, then switch into apartment-specific files as separate unit demonstrations.",
      unitAssets: [
        {
          id: "unit-a1",
          label: "Apartment A1",
          assetId: "asset-smart-home-apartment",
          copy:
            "A separate apartment file demonstrates the residence-level experience while the tower remains the primary building object."
        },
        {
          id: "unit-living-scene",
          label: "Living Interior",
          assetId: "asset-interior-scene-living",
          copy:
            "This living-scene interior adds a softer residential atmosphere to the tower story while the main building remains the skyline-scale object."
        },
        {
          id: "unit-top-down",
          label: "Top-Down Interior",
          assetId: "asset-top-down-interior",
          copy:
            "This top-down interior file helps the tower story pivot from landmark exterior to layout readability and unit-planning logic."
        }
      ]
    },
    modelLabel: "Mixed-use tower preview",
    mapAccent: "#83b7ff",
    floorExplorer: {
      enabled: false,
      pilotObject: true,
      contract:
        "Floor-by-floor exploration requires a floor-authored GLB with named groups such as floor_01, floor_02, floor_03.",
      overviewLabel: "Tower Exterior",
      floorLabelPrefix: "Tower Floor",
      floorLabels: {
        1: "Arrival Lobby",
        6: "Partner Suites",
        12: "Sky Offices",
        18: "Crown Penthouse"
      },
      focusCopy: {
        1: "Start on the lobby and podium layer to frame arrival quality, tenant mix, and how the tower receives capital partners.",
        6: "This partner-suites focus is the clean mid-stack story: flexible mixed-use inventory with strong boulevard visibility.",
        12: "The sky-office layer is where the tower pitch becomes institutional, combining skyline identity with repeatable floor economics.",
        18: "Use the crown floor as the scarcity layer in the story: premium top-of-stack space with the clearest prestige angle."
      }
    }
  },
  {
    id: "lorton-field-estates",
    name: "Lorton Field Estates",
    city: "Tirana",
    district: "Eastern Growth Corridor",
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
    floorCount: 22,
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
    floorCount: 14,
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
  }
];
