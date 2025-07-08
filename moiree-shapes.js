let RENDER_SVG = false; // Will be configurable via URL parameter
const A_PAPER_SCALE = 1.414;

// NOTE: POINT_STYLE.POINT uses a tiny ellipse (0.4mm) when rendering to SVG
// This ensures dots are visible in Inkscape while remaining plotter-friendly
// without causing ink bleeding or excessive pen dwell
const GOLDEN_RATIO = 1.61803398875;
const MTG_RATIO = 1.3968;
const CHOSEN_RATIO = MTG_RATIO;
const CANVAS_WIDTH = 650;
const CANVAS_HEIGHT = Math.round(CANVAS_WIDTH * CHOSEN_RATIO);

const PEN_THICKNESS = 4; // Thickness of the pen used for drawing
// Thickness examples:
// STAEDTLER 0.3mm fineliner = 1.5

// Enum for point styles
const POINT_STYLE = {
  POINT: 0, // Minimal point - renders as tiny ellipse in SVG for Inkscape visibility
  CIRCLE: 1, // Standard circle with specified radius
  SWIRL: 2, // Archimedean spiral with wrap-back effect
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
 * @param {number} radius - Radius for circle or swirl styles
 * @param {number} style - Style of the point (POINT, CIRCLE, SWIRL)
 */
function drawPoint(x, y, radius, style) {
  switch (style) {
    case POINT_STYLE.POINT:
      // Simple point/dot that's visible in Inkscape but plotter-friendly
      push(); // Save current drawing settings

      if (RENDER_SVG) {
        // Special handling for SVG output
        // We'll create a minimal dot using a tiny ellipse for Inkscape visibility
        // This is more reliable for SVG editors than point() which may not render
        noFill();
        strokeWeight(0.2); // Minimal stroke weight that's still visible in Inkscape
        ellipse(x, y, 0.4, 0.4); // Very tiny ellipse that plots as a single point
      } else {
        // For screen rendering, use the standard point function
        point(x, y);
      }

      pop(); // Restore previous drawing settings
      break;

    case POINT_STYLE.CIRCLE:
      // Circle with specified radius
      circle(x, y, radius * 2);
      break;

    case POINT_STYLE.SWIRL:
      // Draw a spiral that starts at center and moves outward counterclockwise
      // Then wraps back to create a circular appearance
      push();
      translate(x, y);

      // Set target radius to match the circle radius exactly
      const targetRadius = radius;

      // Calculate 'b' parameter for the spiral
      // For an Archimedean spiral to have exactly PEN_THICKNESS spacing between arms
      const b = PEN_THICKNESS / (2 * PI);

      // Number of points to draw in the spiral (more points = smoother curve)
      const numPoints = 100; // Increased for smoother curves

      // Start the spiral
      beginShape();
      noFill();

      // Add first point at center
      curveVertex(0, 0);
      curveVertex(0, 0); // Repeat first point to ensure curve starts correctly

      // Calculate the maximum theta value needed to reach our target radius
      // Using the formula r = b*θ, we get θ = r/b
      const maxTheta = targetRadius / b;

      // The wrap-back should always be a consistent portion of the final revolution
      // Reserve the last 25% of the final revolution for the wrap-back
      const finalRevolutionFraction = 0.25; // 25% of final revolution for wrap-back

      // Calculate theta for main spiral (excluding wrap-back portion)
      const mainSpiralTheta = maxTheta - TWO_PI * finalRevolutionFraction;

      // Calculate how many points to use for main spiral vs wrap-back
      // Allocate points proportionally to the angle coverage
      const mainSpiralPoints = Math.floor(
        numPoints * (mainSpiralTheta / maxTheta)
      );

      // Draw the main spiral points using the proper Archimedean spiral formula
      for (let i = 0; i < mainSpiralPoints; i++) {
        // Map i to theta value for the outward spiral
        const theta = map(i, 0, mainSpiralPoints - 1, 0, mainSpiralTheta);

        // Archimedean spiral formula: r = bθ
        const r = b * theta;

        // Calculate coordinates
        const sx = r * cos(theta);
        const sy = r * sin(theta);

        // Add point to the curve
        curveVertex(sx, sy);
      }

      // Now add the wrap-back points for the final portion of the revolution
      // These will curve back toward the spiral, creating a smoother transition
      const wrapPoints = numPoints - mainSpiralPoints;

      // Starting values for the wrap-back
      const startWrapTheta = mainSpiralTheta;
      const startWrapRadius = b * startWrapTheta;
      const startWrapAngle = startWrapTheta % TWO_PI; // Get the angle in the 0-2π range

      // Final values at the maximum extent
      const finalTheta = maxTheta;
      const finalRadius = b * finalTheta;
      const finalAngle = finalTheta % TWO_PI; // Get the final angle in the 0-2π range

      // Create a smooth curve that wraps back toward the spiral
      for (let i = 0; i < wrapPoints; i++) {
        // Normalize i to 0-1 range
        const t = i / (wrapPoints - 1);

        // Start from where the main spiral ended and wrap back toward 90% of the spiral's radius
        // The wrap effect is stronger as t increases (square function makes it more gradual at start)
        const wrapRadius = startWrapRadius - t * t * 0.2 * startWrapRadius;

        // Continue angular motion through the last portion of the final revolution
        // This maps t from 0-1 to the remaining angular portion of the final revolution
        const wrapAngle = startWrapAngle + t * TWO_PI * finalRevolutionFraction;

        // Calculate coordinates
        const wx = wrapRadius * cos(wrapAngle);
        const wy = wrapRadius * sin(wrapAngle);

        curveVertex(wx, wy);
      }

      // Add one more control point to ensure smooth ending
      const lastWrapRadius = startWrapRadius * 0.8; // End at 80% of the spiral's radius
      const lastWrapAngle = startWrapAngle + TWO_PI * finalRevolutionFraction;
      curveVertex(
        lastWrapRadius * cos(lastWrapAngle),
        lastWrapRadius * sin(lastWrapAngle)
      );

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
 * @param {number} pointRadius - Radius of the points to draw
 * @param {number} style - Style of the points (POINT, CIRCLE, SWIRL)
 * @param {number} angle - Angle in degrees to rotate the entire grid
 */
function drawPointGrid(
  x,
  y,
  cols,
  rows,
  pointSpacing,
  pointRadius,
  style,
  angle = 0
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
 * @param {number} pointSpacing - Spacing between dots both radially and angularly
 * @param {number} pointRadius - Radius of the points to draw
 * @param {number} rotation - Rotation of the entire pattern in degrees
 * @param {number} style - Style of the points (POINT, CIRCLE, SWIRL)
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
  style = POINT_STYLE.POINT,
  rotation = 0
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

function testPenPoints() {
  // Reset style for drawing points
  noFill();
  stroke(0);
  strokeWeight(3);

  drawPointGrid(100, 50, 5, 2, 12, 1, 0, POINT_STYLE.POINT);
  drawPointGrid(200, 50, 5, 2, 18, 1, 0, POINT_STYLE.POINT);
  drawPointGrid(330, 50, 5, 2, 24, 1, 0, POINT_STYLE.POINT);

  stroke(0);
  strokeWeight(0.3);
}

function testPenCircles() {
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

  noFill();
  stroke(0);
  strokeWeight(0.3);
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
  noFill();
  stroke(0);
  // testPenPoints();
  const circleSpacing = 10; // Spacing between points
  const numCircles = 24; // Grid size
  const numRings = 13; // Number of rings for radial pattern
  strokeWeight(PEN_THICKNESS);
  currentPointStyle = POINT_STYLE.POINT; // Default point style
  currentPointRadius = 10; // Increase radius for circles

  drawPointGrid(
    220,
    220,
    numCircles,
    numCircles,
    circleSpacing,
    currentPointRadius,
    currentPointStyle
  );

  drawPointGrid(
    318,
    352,
    numCircles,
    numCircles,
    circleSpacing,
    currentPointRadius,
    currentPointStyle,
    20
  );

  drawRadialPoints(
    372,
    540,
    numRings,
    circleSpacing,
    currentPointRadius,
    currentPointStyle
  );

  drawPointGrid(
    412,
    682,
    numCircles,
    numCircles,
    circleSpacing,
    currentPointRadius,
    currentPointStyle
  );

  // Reset styles
  stroke(0);
  noFill();
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
