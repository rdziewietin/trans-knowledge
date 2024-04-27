/**
* A map object connecting the state's initials and the coordinates on the map image. Done via JS to declutter HTML page. Incomplete.
* @constant
*/
const areas = new Map();
areas.set("CO", "384,230,488,237,486,316,375,309");
areas.set(
  "AK",
  "245,453,256,514,301,529,300,535,256,519,178,547,154,548,197,524,171,509,195,449",
);
areas.set(
  "HI",
  "344,471,409,501,431,527,416,539,412,504,407,522,401,508,322,474",
);
areas.set(
  "CA",
  "161,162,149,192,178,324,227,378,273,383,283,353,207,238,221,180",
);
areas.set(
  "OR",
  "190,83,161,162,267,189,275,150,273,140,288,115,284,110,254,103,225,103,203,96,203,87",
);
areas.set(
  "WA",
  "194,36,223,31,296,50,284,110,254,103,225,103,203,96,203,87,190,83",
);
areas.set(
  "ID",
  "296,50,309,53,302,72,320,104,315,124,324,125,335,151,361,154,353,206,267,189,275,150,273,140,288,115,284,110",
);
areas.set("NV", "221,180,310,198,289,317,279,336,207,238");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");
// areas.set("", "");

/**
* An object connecting the state's initials and the state's full name. Used to display state name when the map is clicked. Incomplete.
* @constant
*/
const stateNames = {
  OR: "Oregon",
  CA: "California",
  AK: "Alaska",
};

/**
* An object connecting the state's initials and the quality of trans laws. Only shows when clicked. Incomplete.
* @constant
*/
const stateQuality = {
  CA: "Good",
};

export { areas };
export { stateNames };
export { stateQuality };
