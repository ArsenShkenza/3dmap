const FLOOR_33_APARTMENTS = {
  0: {
    apartmentLabel: "APARTAMENTI - 3+1",
    coordsPct: [
      [74.807, 17.597],
      [74.722, 39.031],
      [77.635, 38.887],
      [77.806, 51.921],
      [93.059, 52.066],
      [93.059, 17.597],
    ],
  },
  1: {
    apartmentLabel: "APARTAMENTI - 3+1",
    coordsPct: [
      [74.207, 17.597],
      [55.955, 17.742],
      [55.955, 38.452],
      [59.212, 38.597],
      [59.126, 47.721],
      [68.038, 47.721],
      [68.038, 38.452],
      [74.293, 38.452],
    ],
  },
  2: {
    apartmentLabel: "APARTAMENTI - 2+1",
    highlightColor: "rgba(30, 140, 60, 0.52)",
    coordsPct: [
      [55.441, 17.742],
      [55.441, 40.045],
      [58.44, 40.045],
      [58.44, 47.576],
      [49.357, 47.721],
      [49.357, 38.742],
      [37.361, 38.597],
      [37.275, 17.452],
    ],
  },
  3: {
    apartmentLabel: "APARTAMENTI - 2+1",
    coordsPct: [
      [36.761, 17.597],
      [36.847, 38.597],
      [20.994, 38.742],
      [20.908, 43.376],
      [18.081, 43.376],
      [18.166, 17.742],
    ],
  },
  4: {
    apartmentLabel: "APARTAMENTI - 2+1",
    coordsPct: [
      [17.652, 17.452],
      [17.738, 43.376],
      [21.08, 43.232],
      [21.165, 51.921],
      [5.656, 51.921],
      [5.741, 17.597],
    ],
  },
  5: {
    apartmentLabel: "APARTAMENTI - 2+1",
    coordsPct: [
      [5.656, 52.645],
      [5.57, 86.97],
      [17.652, 86.825],
      [17.738, 60.611],
      [20.908, 60.321],
      [20.994, 52.645],
    ],
  },
  6: {
    apartmentLabel: "APARTAMENTI - 3+1",
    coordsPct: [
      [18.166, 61.48],
      [18.166, 86.97],
      [42.845, 86.97],
      [42.845, 66.259],
      [20.823, 66.259],
      [20.737, 61.335],
    ],
  },
  7: {
    apartmentLabel: "APARTAMENTI - 2+1",
    highlightColor: "rgba(30, 140, 60, 0.52)",
    coordsPct: [
      [43.273, 65.825],
      [43.359, 86.825],
      [61.697, 87.115],
      [61.697, 65.825],
      [58.355, 65.97],
      [58.355, 56.99],
      [49.529, 56.99],
      [49.529, 65.97],
    ],
  },
  8: {
    apartmentLabel: "APARTAMENTI - 2+1",
    coordsPct: [
      [80.805, 61.48],
      [80.634, 87.115],
      [62.382, 86.97],
      [62.296, 65.825],
      [77.292, 65.97],
      [77.464, 61.335],
    ],
  },
  9: {
    apartmentLabel: "APARTAMENTI - 3+1",
    coordsPct: [
      [77.892, 52.501],
      [77.978, 60.466],
      [81.234, 60.611],
      [81.148, 86.825],
      [93.059, 86.97],
      [93.231, 52.79],
    ],
  },
};

const ALL_FLOORS = Array.from({ length: 37 }, (_unused, index) => index + 1);

export const APARTMENT_POLYGONS_ABSOLUTE = {
  sourceAsset: "/assets/plan-33.jpg",
  floors: Object.fromEntries(
    ALL_FLOORS.map((floorNumber) => [
      floorNumber,
      {
        apartments: FLOOR_33_APARTMENTS,
      },
    ]),
  ),
};

/** Floors that use project-specific plan images (no fallback to plan-33 polygons). */
const TIRANA_SIGNATURE_PLAN_FLOORS = new Set([1, 2, 3]);

export const APARTMENT_POLYGONS_BY_PROJECT = {
  "tirana-signature-residences": {
    floors: {
      1: {
        apartments: {
          0: {
            apartmentLabel: "Space 1",
            coordsPct: [
              [60.167, 16.478],
              [61.333, 78.739],
              [84.833, 78.565],
              [85.167, 16.652],
            ],
          },
          1: {
            apartmentLabel: "Space 2",
            coordsPct: [
              [38.333, 16.739],
              [38.125, 78.478],
              [59.583, 78.696],
              [59.792, 48.261],
              [60, 26.304],
              [58.333, 26.087],
              [58.333, 16.677],
            ],
          },
          2: {
            apartmentLabel: "Space 3",
            coordsPct: [
              [16.667, 16.522],
              [16.597, 83.261],
              [36.458, 83.406],
              [36.319, 16.449],
            ],
          },
        },
      },
      2: {
        apartments: {
          0: {
            apartmentLabel: "Apartment 2+1",
            coordsPct: [
              [63.405, 3.103],
              [63.978, 98.799],
              [98.244, 98.599],
              [98.387, 3.303],
            ],
          },
          1: {
            apartmentLabel: "Apartment 2+1",
            coordsPct: [
              [62.401, 3.103],
              [62.401, 27.928],
              [63.405, 27.928],
              [63.978, 80.38],
              [62.401, 80.38],
              [62.401, 97.798],
              [33.871, 97.598],
              [33.728, 4.705],
              [37.168, 4.905],
              [37.025, 2.903],
            ],
          },
          2: {
            apartmentLabel: "Apartment 2+1",
            coordsPct: [
              [2.043, 2.703],
              [29.857, 3.103],
              [29.857, 4.705],
              [32.724, 4.905],
              [32.867, 27.728],
              [34.014, 27.528],
              [33.871, 43.343],
              [30.573, 43.143],
              [30.573, 44.945],
              [32.867, 44.945],
              [32.437, 97.798],
              [1.9, 97.598],
            ],
          },
        },
      },
      3: {
        apartments: {
          0: {
            apartmentLabel: "Apartment 2+1",
            coordsPct: [
              [63.405, 3.103],
              [63.978, 98.799],
              [98.244, 98.599],
              [98.387, 3.303],
            ],
          },
          1: {
            apartmentLabel: "Apartment 2+1",
            coordsPct: [
              [62.401, 3.103],
              [62.401, 27.928],
              [63.405, 27.928],
              [63.978, 80.38],
              [62.401, 80.38],
              [62.401, 97.798],
              [33.871, 97.598],
              [33.728, 4.705],
              [37.168, 4.905],
              [37.025, 2.903],
            ],
          },
          2: {
            apartmentLabel: "Apartment 2+1",
            coordsPct: [
              [2.043, 2.703],
              [29.857, 3.103],
              [29.857, 4.705],
              [32.724, 4.905],
              [32.867, 27.728],
              [34.014, 27.528],
              [33.871, 43.343],
              [30.573, 43.143],
              [30.573, 44.945],
              [32.867, 44.945],
              [32.437, 97.798],
              [1.9, 97.598],
            ],
          },
        },
      },
    },
  },
};

export function getApartmentPolygonsForProjectFloor(projectId, floorNumber) {
  if (
    projectId === "tirana-signature-residences" &&
    TIRANA_SIGNATURE_PLAN_FLOORS.has(floorNumber)
  ) {
    return (
      APARTMENT_POLYGONS_BY_PROJECT[projectId]?.floors?.[floorNumber]
        ?.apartments || {}
    );
  }
  return APARTMENT_POLYGONS_ABSOLUTE?.floors?.[floorNumber]?.apartments || {};
}
