let RENDER_SVG = false; // Will be configurable via URL parameter
const A_PAPER_SCALE = 1.414;
const GOLDEN_RATIO = 1.61803398875;
const MTG_RATIO = 1.3968;
const CHOSEN_RATIO = MTG_RATIO;
const CANVAS_WIDTH = 650;
const CANVAS_HEIGHT = Math.round(CANVAS_WIDTH * CHOSEN_RATIO);

const PEN_THICKNESS = 2; // Thickness of the pen used for drawing
const CIRCLE_RADIUS = 1;
// Enum for point styles
const POINT_STYLE = {
  POINT: 0,
  CIRCLE: 1,
  SWIRL: 2,
};

let randomHash;
let seed;
let randomizedHashString;

// Define the Random class for consistent randomization
class Random {
  constructor(hash) {
    let result = "0x";
    if (hash == undefined) {
      let chars = "0123456789abcdef";
      for (let i = 64; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
      console.log("random hash result: " + result);
    } else {
      result = hash;
    }
    this.seed = parseInt(result.slice(0, 16), 16);
  }
  random_dec() {
    this.seed ^= this.seed << 13;
    this.seed ^= this.seed >> 17;
    this.seed ^= this.seed << 5;
    return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000;
  }
  random_between(a, b) {
    return a + (b - a) * this.random_dec();
  }
  random_int(a, b) {
    return Math.floor(this.random_between(a, b + 1));
  }
  random_choice(x) {
    return x[Math.floor(this.random_between(0, x.length * 0.99))];
  }
}

/**
 * Draws a point at the specified coordinates using the current style
 * @param {number} x - X coordinate of the point
 * @param {number} y - Y coordinate of the point
 */
function drawPoint(x, y, radius, style) {
  switch (style) {
    case POINT_STYLE.POINT:
      // Simple point/dot
      point(x, y);
      break;

    case POINT_STYLE.CIRCLE:
      // Circle with specified radius
      circle(x, y, radius * 2);
      break;

    case POINT_STYLE.SWIRL:
      // Draw a spiral that starts at center and moves outward counterclockwise
      push();
      translate(x, y);

      // Number of complete revolutions
      const revolutions = 2;

      // For a true Archimedean spiral with consistent arm spacing,
      // we need to use the proper formula: r = a + bθ
      // where 'a' is the starting radius (0 in our case)
      // and 'b' is the distance between successive turnings

      // Set target radius to match the circle radius exactly
      const targetRadius = radius; // Exact match to the circle radius parameter

      // Calculate 'b' parameter for the spiral
      // For an Archimedean spiral to have exactly PEN_THICKNESS spacing between arms,
      // we set b = PEN_THICKNESS/(2π)
      const b = PEN_THICKNESS / (2 * PI);

      // Number of points to draw in the spiral (more points = smoother curve)
      const numPoints = 60; // Increased for smoother curves

      // Start the spiral
      beginShape();
      noFill();

      // Add first point at center
      curveVertex(0, 0);
      curveVertex(0, 0); // Repeat first point to ensure curve starts correctly

      // Calculate the maximum theta value needed to reach our target radius
      // Using the formula r = b*θ, we get θ = r/b
      const maxTheta = targetRadius / b;

      // Draw the spiral points using the proper Archimedean spiral formula
      for (let i = 0; i < numPoints; i++) {
        // Map i to theta value
        const theta = map(i, 0, numPoints - 1, 0, maxTheta);

        // Archimedean spiral formula: r = bθ
        // This ensures truly consistent spacing between spiral arms
        const r = b * theta;

        // Calculate coordinates (x = r*cos(θ), y = r*sin(θ))
        const sx = r * cos(theta);
        const sy = r * sin(theta);

        // Add point to the curve
        curveVertex(sx, sy);
      }

      // Add final point to ensure smooth ending
      const finalTheta = maxTheta;
      const finalRadius = b * finalTheta;
      curveVertex(finalRadius * cos(finalTheta), finalRadius * sin(finalTheta));

      // Close the shape
      endShape();
      pop();
      break;
  }
}

/**
 * Draws a grid of points with a specified rotation
 * @param {number} x - X coordinate of the grid center
 * @param {number} y - Y coordinate of the grid center
 * @param {number} cols - Number of columns in the grid
 * @param {number} rows - Number of rows in the grid
 * @param {number} pointSpacing - Size of each cell in the grid
 * @param {number} angle - Angle in degrees to rotate the entire grid
 */
function drawPointGrid(
  x,
  y,
  cols,
  rows,
  pointSpacing,
  pointRadius,
  angle = 0,
  style = POINT_STYLE.POINT
) {
  push();
  translate(x, y);
  rotate(radians(angle));

  // Calculate the grid dimensions
  const gridWidth = cols * pointSpacing;
  const gridHeight = rows * pointSpacing;

  // Offset to center the grid
  const offsetX = -gridWidth / 2;
  const offsetY = -gridHeight / 2;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Calculate the position of each point
      const pointX = offsetX + i * pointSpacing + pointSpacing / 2;
      const pointY = offsetY + j * pointSpacing + pointSpacing / 2;

      // Draw the point using global style settings
      drawPoint(pointX, pointY, pointRadius, style);
    }
  }

  pop();
}

/**
 * Draws circles in a radial pattern starting from center
 * @param {number} x - X coordinate of the center
 * @param {number} y - Y coordinate of the center
 * @param {number} numRings - Number of rings to draw
 * @param {number} spacing - Spacing between dots both radially and angularly
 * @param {number} rotation - Rotation of the entire pattern in degrees
 *
 * Each ring starts at a random angle to prevent forming a straight "line"
 * of dots through the circle pattern
 */
function drawRadialPoints(
  x,
  y,
  numRings,
  pointSpacing,
  pointRadius,
  rotation = 0,
  style = POINT_STYLE.POINT
) {
  push();
  translate(x, y);
  rotate(radians(rotation));

  // Draw the center dot
  drawPoint(0, 0);

  // For each ring
  for (let r = 1; r <= numRings; r++) {
    // Current ring radius
    const ringRadius = r * pointSpacing;

    // Calculate circumference of this ring
    const circumference = 2 * PI * ringRadius;

    // Calculate how many dots will fit in this ring with the given spacing
    const dotsInRing = Math.floor(circumference / pointSpacing);

    // Don't draw rings with less than 3 dots
    if (dotsInRing < 3) continue;

    // Angular spacing between dots
    const angleStep = TWO_PI / dotsInRing;

    // Add a random starting angle offset for this ring
    // This prevents dots from forming a "line" through the circle
    const randomStartAngle = random(TWO_PI);

    // Draw dots around the ring
    for (let i = 0; i < dotsInRing; i++) {
      // Add the random offset to each angle calculation
      const angle = randomStartAngle + i * angleStep;

      // Calculate dot position
      const dotX = ringRadius * cos(angle);
      const dotY = ringRadius * sin(angle);

      // Draw the dot using global style settings
      drawPoint(dotX, dotY, pointRadius, style);
    }
  }

  pop();
}

function testPen() {
  const pointSpacing = 24; // Spacing between points

  // Reset style for drawing points
  noFill();
  stroke(0);
  strokeWeight(0.3);

  // Row 1: Small (radius 3)
  drawPointGrid(100, 50, 5, 1, pointSpacing, 1, 0, POINT_STYLE.SWIRL);
  drawPointGrid(240, 50, 5, 1, pointSpacing, 1, 0, POINT_STYLE.CIRCLE);

  // Row 1: Small (radius 3)
  drawPointGrid(100, 70, 5, 1, pointSpacing, 2, 0, POINT_STYLE.SWIRL);
  drawPointGrid(240, 70, 5, 1, pointSpacing, 2, 0, POINT_STYLE.CIRCLE);

  // Row 1: Small (radius 3)
  drawPointGrid(100, 90, 5, 1, pointSpacing, 3, 0, POINT_STYLE.SWIRL);
  drawPointGrid(240, 90, 5, 1, pointSpacing, 3, 0, POINT_STYLE.CIRCLE);

  // Row 2: Medium (radius 6)
  drawPointGrid(100, 120, 5, 1, pointSpacing, 6, 0, POINT_STYLE.SWIRL);
  drawPointGrid(240, 120, 5, 1, pointSpacing, 6, 0, POINT_STYLE.CIRCLE);
}

function localSetup() {
  noLoop();
  // Skip background for SVG export to avoid creating a background rectangle
  if (!RENDER_SVG) {
    background(240, 240, 240);
  }
  stroke(0);
  noFill();
  strokeWeight(PEN_THICKNESS);
}

function localDraw() {
  testPen();
  /* const circleSpacing = 10; // Spacing between points
  const numCircles = 24; // Grid size
  const numRings = 13; // Number of rings for radial pattern

  // Example: Points - simple dots
  currentPointRadius = 1; // Set global point radius
  currentPointStyle = POINT_STYLE.POINT;
  drawPointGrid(220, 220, numCircles, numCircles, circleSpacing, 0);

  // Example: Circles - small circles
  currentPointRadius = 10; // Increase radius for circles
  currentPointStyle = POINT_STYLE.CIRCLE;
  drawPointGrid(318, 352, numCircles, numCircles, circleSpacing, 20);

  // Example: Swirls - spiral shapes
  currentPointStyle = POINT_STYLE.SWIRL;
  currentPointRadius = 10; // This directly controls the final radius of each spiral
  drawRadialPoints(
    372, // x position (center)
    540, // y position (center)
    numRings - 7, // fewer rings since swirls are larger
    circleSpacing * 2.5, // increased spacing between spirals for better visibility
    0 // rotation angle (degrees)
  );

  // You can mix styles in the same sketch
  currentPointRadius = 2;
  currentPointStyle = POINT_STYLE.CIRCLE;
  drawPointGrid(412, 682, numCircles, numCircles, circleSpacing, 0);

  // Reset styles
  stroke(0);
  noFill(); */
}

function setup() {
  let params = getURLParams();
  if (params.hash != undefined) {
    randomHash = new Random(params.hash);
    randomizedHashString = params.hash;
  } else randomHash = new Random();
  seed = round(randomHash.random_dec() * 1000000000);
  noiseSeed(seed);
  randomSeed(seed);

  // Allow SVG rendering to be enabled via URL parameter
  if (params.svg === "true" || params.svg === "1") {
    RENDER_SVG = true;
  }

  // Now that the p5.svg library is loaded, we can use SVG rendering
  if (RENDER_SVG) {
    // Create canvas with SVG renderer
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, SVG);

    // Set initial drawing style to prevent automatic background
    clear(); // Ensure no background is drawn

    // Access the actual SVG element via _renderer
    const pg = window._renderer;
    if (pg && pg.svg) {
      // Set A4 paper size attributes (210mm x 297mm)
      pg.svg.setAttribute("width", "210mm");
      pg.svg.setAttribute("height", "297mm");

      // Set viewBox to maintain the drawing proportions
      pg.svg.setAttribute("viewBox", `0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`);

      // Add Inkscape namespace
      pg.svg.setAttribute(
        "xmlns:inkscape",
        "http://www.inkscape.org/namespaces/inkscape"
      );
      pg.svg.setAttribute(
        "xmlns:sodipodi",
        "http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
      );
    }
  } else {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  localSetup();
}

function draw() {
  localDraw();

  if (RENDER_SVG) {
    // Before saving, adjust the SVG structure to create an Inkscape layer
    // p5.js SVG renderer provides access to the SVG element via _renderer
    const pg = window._renderer;
    if (pg && pg.svg) {
      // Find the main group that p5.svg creates to hold all elements
      // This is typically the first g element
      let mainGroup = pg.svg.querySelector("g");

      // Find and remove any background rectangles
      // These are typically the first rect elements in the SVG
      const rects = pg.svg.querySelectorAll("rect");
      rects.forEach((rect) => {
        // Check if this is likely a background/canvas rectangle
        // (usually has width/height matching the canvas dimensions)
        const w = parseFloat(rect.getAttribute("width") || "0");
        const h = parseFloat(rect.getAttribute("height") || "0");

        // If dimensions match canvas or it has no stroke and a fill, it's likely a background
        if (
          (Math.abs(w - CANVAS_WIDTH) < 1 && Math.abs(h - CANVAS_HEIGHT) < 1) ||
          (rect.getAttribute("stroke") === "none" && rect.getAttribute("fill"))
        ) {
          rect.parentNode.removeChild(rect);
        }
      });

      if (mainGroup) {
        // Set Inkscape layer attributes
        mainGroup.setAttribute("inkscape:groupmode", "layer");
        mainGroup.setAttribute("inkscape:label", "Drawing Layer");

        // Make sure the group is directly under the SVG (not nested in other groups)
        // This effectively "ungroups" it from any parent groups
        if (mainGroup.parentElement !== pg.svg) {
          pg.svg.appendChild(mainGroup);
        }

        // Remove any background rectangle from the group too
        const groupRects = mainGroup.querySelectorAll("rect");
        groupRects.forEach((rect) => {
          const w = parseFloat(rect.getAttribute("width") || "0");
          const h = parseFloat(rect.getAttribute("height") || "0");

          if (
            (Math.abs(w - CANVAS_WIDTH) < 1 &&
              Math.abs(h - CANVAS_HEIGHT) < 1) ||
            (rect.getAttribute("stroke") === "none" &&
              rect.getAttribute("fill"))
          ) {
            mainGroup.removeChild(rect);
          }
        });
      }
    }

    // Create timestamped filename for SVG output
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    save(`moiree-shapes-${timestamp}.svg`);
  }
}
