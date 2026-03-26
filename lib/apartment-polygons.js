const FLOOR_33_APARTMENTS = {
  0: {
    apartmentLabel: "APARTAMENTI - 3+1",
    coordsPct: [
      [74.807, 17.597],
      [74.722, 39.031],
      [77.635, 38.887],
      [77.806, 51.921],
      [93.059, 52.066],
      [93.059, 17.597]
    ]
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
      [74.293, 38.452]
    ]
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
      [37.275, 17.452]
    ]
  },
  3: {
    apartmentLabel: "APARTAMENTI - 2+1",
    coordsPct: [
      [36.761, 17.597],
      [36.847, 38.597],
      [20.994, 38.742],
      [20.908, 43.376],
      [18.081, 43.376],
      [18.166, 17.742]
    ]
  },
  4: {
    apartmentLabel: "APARTAMENTI - 2+1",
    coordsPct: [
      [17.652, 17.452],
      [17.738, 43.376],
      [21.08, 43.232],
      [21.165, 51.921],
      [5.656, 51.921],
      [5.741, 17.597]
    ]
  },
  5: {
    apartmentLabel: "APARTAMENTI - 2+1",
    coordsPct: [
      [5.656, 52.645],
      [5.57, 86.97],
      [17.652, 86.825],
      [17.738, 60.611],
      [20.908, 60.321],
      [20.994, 52.645]
    ]
  },
  6: {
    apartmentLabel: "APARTAMENTI - 3+1",
    coordsPct: [
      [18.166, 61.48],
      [18.166, 86.97],
      [42.845, 86.97],
      [42.845, 66.259],
      [20.823, 66.259],
      [20.737, 61.335]
    ]
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
      [49.529, 65.97]
    ]
  },
  8: {
    apartmentLabel: "APARTAMENTI - 2+1",
    coordsPct: [
      [80.805, 61.48],
      [80.634, 87.115],
      [62.382, 86.97],
      [62.296, 65.825],
      [77.292, 65.97],
      [77.464, 61.335]
    ]
  },
  9: {
    apartmentLabel: "APARTAMENTI - 3+1",
    coordsPct: [
      [77.892, 52.501],
      [77.978, 60.466],
      [81.234, 60.611],
      [81.148, 86.825],
      [93.059, 86.97],
      [93.231, 52.79]
    ]
  }
};

const ALL_FLOORS = Array.from({ length: 37 }, (_unused, index) => index + 1);

export const APARTMENT_POLYGONS_ABSOLUTE = {
  sourceAsset: "/assets/plan-33.jpg",
  floors: Object.fromEntries(
    ALL_FLOORS.map((floorNumber) => [
      floorNumber,
      {
        apartments: FLOOR_33_APARTMENTS
      }
    ])
  )
};
