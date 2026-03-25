// Absolute floor polygons in original image pixel space (full facade image coordinates).
// Paste tracing-tool output here to make floor hover highlights match the facade precisely.
//
// Expected shape (same as the clipboard payload):
// FLOOR_POLYGONS_ABSOLUTE["palase-horizon"] = {
//   sourceWidth: 1089,
//   sourceHeight: 2171,
//   floors: {
//     37: [116, 276, 325, 58, 968, 281, 968, 337, 328, 121, 116, 334, 116, 276],
//     36: [ ... ],
//   },
// };

export const FLOOR_POLYGONS_ABSOLUTE = {
  "prishtina-prime-offices": {
    sourceWidth: 1089,
    sourceHeight: 2171,
    floors: {
      0: [116,
        2038,
        323,
        2038,
        966,
        2035,
        965,
        2111,
        321,
        2116,
        115,
        2107,
        116,
        2038],
        1: [116,
            2037,
            323,
            2037,
            967,
            2034,
            967,
            1987,
            325,
            1984,
            116,
            1988,
            116,
            2037],
            2: [117,
                1988,
                118,
                1940,
                324,
                1930,
                967,
                1939,
                967,
                1987,
                323,
                1985,
                117,
                1988],
                3: [119,
                    1892,
                    325,
                    1875,
                    967,
                    1891,
                    967,
                    1939,
                    326,
                    1931,
                    118,
                    1941,
                    119,
                    1892]
    }
  }
};

