export const exploreCategories = [
  { id: "all", label: "All Access" },
  { id: "land", label: "Land & Development" },
  { id: "partners", label: "Seeking Partners" },
  { id: "turnkey", label: "Turn-key Income" }
];

export const promptExamples = [
  "Bazaar Gate mixed-use tower in central Tirana",
  "United Towers of Tirana landmark and mixed-use program",
  "Tirana co-investor projects with 3D exterior and interior previews"
];

const exteriorAssets = [
  {
    id: "asset-bazaar-gate",
    label: "Bazaar Gate mixed-use tower",
    fileName: "bazaar_gate_min.glb",
    src: "/assets/exterior/bazaar_gate_min.glb",
    assignedProjectId: "bazaar-gate",
    posterSrc: "/assets/projects/bazaar-gate/bazaargate1.jpg",
    capabilities: {
      floorExplorer: false
    }
  },
  {
    id: "asset-united-towers-of-tirana",
    label: "United Towers of Tirana",
    fileName: "united_towers_of_tirana_min.glb",
    src: "/assets/exterior/united_towers_of_tirana_min.glb",
    assignedProjectId: "united-towers-of-tirana",
    posterSrc: "/assets/projects/united-towers-of-tirana/unitedtowersoftirana1.jpg",
    capabilities: {
      floorExplorer: false
    }
  }
];

const fullAssets = [];

const interiorAssets = [
  {
    id: "asset-smart-home-apartment",
    label: "Smart Apartment Demo",
    fileName: "smart_home_interior_floor_plan_min.glb",
    src: "/assets/interior/smart_home_interior_floor_plan_min.glb",
    assignedProjectId: "bazaar-gate",
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
    fileName: "interior_scene_-_living_min.glb",
    src: "/assets/interior/interior_scene_-_living_min.glb",
    assignedProjectId: "bazaar-gate",
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
    id: "asset-restaurant-interior",
    label: "Restaurant Interior Scene",
    fileName: "low_poly_restaurant_interior_scene_min.glb",
    src: "/assets/interior/low_poly_restaurant_interior_scene_min.glb",
    assignedProjectId: "bazaar-gate",
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
    id: "bazaar-gate",
    name: "BAZAAR GATE",
    city: "Tirana",
    district: "K. Kristoforidhi / Luigj Gurakuqi",
    propertyType: "building",
    categoryId: "partners",
    categoryLabel: "Seeking Partners",
    access: "VIP",
    roi: "On request",
    ticket: "Investor package by request",
    stage: "Under Construction",
    stageSummary:
      "A 26,000 m2 mixed-use Tirana tower by Bolles+Wilson and XPlan Studio, combining hotel, residential, office, service, and parking programs around a distinctive ventilated facade.",
    memo:
      "Bazaar Gate is positioned at the meeting of K. Kristoforidhi Street and Luigj Gurakuqi Street, in a fast-developing residential and service corridor. The project pairs a service-led base and hotel floors with upper residential levels, giving investors a live mixed-use story in the heart of Tirana.",
    thesis:
      "The building's stepped volumes, terrace greenery, and green bamboo-textured alpolic facade create a recognizable architectural identity while the program mix supports day-to-night activation across hospitality, services, offices, residences, parking, and technical areas.",
    aboutMemo: `The proposed facility is located at the intersection of K. Kristoforidhi Street and Luigj Gurakuqi Street in Tirana. The facility is also positioned in an area that tends to develop rapidly, especially as a residential area with all the facilities and services that accompany residential centers. Bearing in mind the above, the facility has been carefully designed from an architectural and urban point of view. It comes as an object composed in several volumes, alternating with different heights and with greenery on the terrace. The entire main volume is scaled and treated with a ventilated facade. The facade will be ventilated, with alpolico panels with a green printed texture of bamboo leaves and a solid white background.

Along the 0th floor, there should be places for services since this area has been undergoing infrastructural, social and economic development in recent years.

According to the project, the ground floor has a service function and partly a hotel, floor -1 and floor +1. Floors 2, 3, and 4 have a hotel function. Meanwhile, the other floors have a residential function. The underground floors are mainly dedicated to parking and technical areas of the facility.

The ground floor and the -1st floor of this building will have hotel, service, and office functions. Access to the service units is along the entire perimeter of the building and through internal passages. On floors -1 to +4, in the block of elevators and stairs, two elevators have been added that serve the floors of the hotel.`,
    aboutThesis: `On the ground floor of the building, there is a lobby from where the rest of the hotel is accessed. The hotel takes place on the first, second, third, and fourth floors. On the first floor, there are several conference rooms and a restaurant. The hotel rooms are located on floors +2 to +4.`,
    narrative:
      "Open with the urban corner and the active ground-floor perimeter, then move upward through the hotel lobby, conference, restaurant, and room floors before closing on the residential stack and terrace greenery.",
    sponsor: "Bregu sh.a. x Bolles+Wilson x XPlan Studio",
    program: "Mixed use: hotel, residential, offices, services, parking",
    landSize: "26,000 m2 gross project area",
    diligence: "Under-construction package, facade concept, mixed-use program schedule",
    virtualExperience:
      "Use the 3D model and renders to explain how the ventilated facade, scaled volumes, and program stack turn a central Tirana corner into a hospitality and residential landmark.",
    timeline: [
      "Design Authored",
      "Under Construction",
      "Hotel Floors",
      "Residential Delivery"
    ],
    searchTerms: [
      "bazaar",
      "gate",
      "tirana",
      "bregu",
      "bolles",
      "wilson",
      "xplan",
      "hotel",
      "residential",
      "mixed use",
      "under construction"
    ],
    // 41°19'45.5"N 19°49'23.3"E — MapLibre [lng, lat]
    center: [19.823139, 41.329306],
    bearing: -18,
    zoom: 16.4,
    pitch: 64,
    footprint: [
      [19.822889, 41.329146],
      [19.823389, 41.329116],
      [19.823459, 41.329486],
      [19.822959, 41.329526],
      [19.822889, 41.329146]
    ],
    elevationImageSrc: "/assets/projects/bazaar-gate/bazaargate1.jpg",
    floorCount: 25,
    floorHeight: 3.25,
    massingHeight: 86,
    primaryAssetId: "asset-bazaar-gate",
    fullProjectFlow: {
      type: "separate-files",
      unitAssets: [
        {
          id: "unit-residence",
          label: "Residence Demo",
          assetId: "asset-smart-home-apartment",
          copy:
            "Use the residence demo as a unit-level reference while Bazaar Gate's primary tower model keeps the mixed-use hotel and residential story anchored at full-project scale."
        },
        {
          id: "unit-living-scene",
          label: "Living Interior",
          assetId: "asset-interior-scene-living",
          copy:
            "Use this living interior to give the residential floors a warmer unit-level moment after the facade and program stack have been established."
        },
        {
          id: "unit-restaurant-scene",
          label: "Restaurant Interior",
          assetId: "asset-restaurant-interior",
          copy:
            "Use the restaurant interior as the hospitality proof point for Bazaar Gate's hotel, conference, and service-floor narrative."
        }
      ]
    },
    modelLabel: "Bazaar Gate exterior review",
    mapAccent: "#78c7bf",
    mapModelScale: 0.92,
    galleryImages: [
      {
        src: "/assets/projects/bazaar-gate/bazaargate1.jpg",
        alt: "Bazaar Gate street-level tower render",
        caption: "Street-level arrival and green ventilated facade"
      },
      {
        src: "/assets/projects/bazaar-gate/bazaargate2.jpg",
        alt: "Bazaar Gate aerial render showing rooftop volumes",
        caption: "Stepped rooftop volumes with terrace greenery"
      }
    ],
    projectFacts: {
      project: "Bolles+Wilson, XPlan Studio",
      investor: "Bregu sh.a.",
      location: "Tirana, Albania",
      status: "Under construction",
      area: "26,000 m2"
    }
  },
  {
    id: "united-towers-of-tirana",
    name: "UNITED TOWERS OF TIRANA",
    city: "Tirana",
    district: "Central Mixed-Use Corridor",
    propertyType: "building",
    categoryId: "partners",
    categoryLabel: "Seeking Partners",
    access: "VIP",
    roi: "On request",
    ticket: "Investor package by request",
    stage: "Under Construction",
    stageSummary:
      "A 50,500 m2 mixed-use landmark rising 25 floors above Tirana, designed by XPlan Studio with Marco Casamonti & Partners around hotel, residential, office, and retail uses.",
    memo:
      "United Towers of Tirana is a skyline-scale mixed-use project where two clean vertical volumes rise in parallel and converge across the final levels. The building is positioned as a contemporary landmark that brings hotel, residential, office, and retail functions into a single architectural statement.",
    thesis:
      "The tower's red vertical element anchors the facade with cultural memory, while the paired volumes, optimized light, ventilation, and spatial flow give the project both investment clarity and civic identity.",
    aboutMemo: `Rising 25 floors above Tirana, the United Tower stands as a compelling architectural landmark, an elegant fusion of contemporary design and cultural identity. Designed in collaboration by Archea Associati and X Plan Studio, this dynamic mixed-use complex brings together hotel, residential, office, and retail spaces within a singular, unified vision.

The tower's exterior is defined by clean, uninterrupted lines and a carefully articulated façade. Two distinct volumes rise in parallel before converging in the final four levels, creating a graceful architectural gesture that evokes the symbolism of an embrace. This subtle convergence reflects a minimalist design ethos, where clarity, proportion, and form speak louder than ornament.

A striking red vertical element—woven into the façade—introduces a layer of cultural storytelling. Inspired by traditional ethnic motifs, it serves as both a visual anchor and a tribute to Tirana's rich heritage, embedding a sense of place and identity into the tower's otherwise modern aesthetic.

Beyond its visual poise, the building's form has been meticulously planned to optimize spatial flow, natural light, and ventilation. The result is a sculptural and highly functional structure that adds both beauty and purpose to the city's growing skyline.`,
    aboutThesis: `United Tower is not just a building—it is a bold statement of Tirana's evolving identity, where innovation and tradition converge to shape the city's future.`,
    narrative:
      "Start with the 25-floor city silhouette, then use the red cultural motif and converging top levels to explain how the building turns mixed-use density into a memorable Tirana landmark.",
    sponsor: "Unico Construction sh.p.k. x XPlan Studio x Marco Casamonti & Partners",
    program: "Mixed use: hotel, residential, office, retail",
    landSize: "50,500 m2 gross project area",
    diligence: "Under-construction package, mixed-use program, facade and identity narrative",
    virtualExperience:
      "Use the GLB and render set to show how the two parallel volumes converge into a landmark form, with the red vertical element carrying Tirana's cultural identity through the facade.",
    timeline: [
      "Design Collaboration",
      "Under Construction",
      "Mixed-Use Fit-Out",
      "Landmark Delivery"
    ],
    searchTerms: [
      "united",
      "towers",
      "tirana",
      "xplan",
      "marco",
      "casamonti",
      "archea",
      "unico",
      "hotel",
      "office",
      "retail",
      "residential",
      "mixed use",
      "under construction"
    ],
    // 41°18'47.4"N 19°48'29.7"E — MapLibre [lng, lat]
    center: [19.80825, 41.313167],
    bearing: -26,
    zoom: 16.25,
    pitch: 66,
    footprint: [
      [19.80793, 41.312947],
      [19.8086, 41.312907],
      [19.80869, 41.313387],
      [19.80801, 41.313427],
      [19.80793, 41.312947]
    ],
    elevationImageSrc: "/assets/projects/united-towers-of-tirana/unitedtowersoftirana1.jpg",
    floorCount: 25,
    floorHeight: 3.45,
    massingHeight: 92,
    primaryAssetId: "asset-united-towers-of-tirana",
    fullProjectFlow: {
      type: "separate-files",
      unitAssets: [
        {
          id: "unit-residence",
          label: "Residence Demo",
          assetId: "asset-smart-home-apartment",
          copy:
            "Use the residence demo to move from United Towers' skyline form into a tangible unit-level residential story."
        },
        {
          id: "unit-living-scene",
          label: "Living Interior",
          assetId: "asset-interior-scene-living",
          copy:
            "Use this living interior as a softer residential contrast to the project's strong vertical facade and mixed-use landmark positioning."
        },
        {
          id: "unit-restaurant-scene",
          label: "Restaurant Interior",
          assetId: "asset-restaurant-interior",
          copy:
            "Use the restaurant interior to support the hotel and retail program with a guest-facing experience layer."
        }
      ]
    },
    modelLabel: "United Towers landmark preview",
    mapAccent: "#d45a68",
    mapModelScale: 0.88,
    galleryImages: [
      {
        src: "/assets/projects/united-towers-of-tirana/unitedtowersoftirana1.jpg",
        alt: "United Towers of Tirana city render",
        caption: "25-floor mixed-use landmark above Tirana"
      },
      {
        src: "/assets/projects/united-towers-of-tirana/unitedtowersoftirana2.jpg",
        alt: "United Towers of Tirana red facade detail render",
        caption: "Red vertical cultural motif and converging tower volumes"
      }
    ],
    projectFacts: {
      project: "XPlan Studio, Marco Casamonti & Partners",
      investor: "Unico Construction sh.p.k.",
      location: "Tirana",
      status: "Under construction",
      area: "50,500 m2"
    }
  }
];
