const RENDER_SVG = false;
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

      // Growth factor controls the spacing between spiral arms
      // This is based only on PEN_THICKNESS to ensure consistent spacing
      const growthFactor = PEN_THICKNESS / (2 * PI);

      // Calculate the final spiral radius that would result from the growth factor
      const naturalFinalRadius = growthFactor * revolutions * TWO_PI;

      // Calculate a scaling factor to achieve the target radius specified by radius
      // This ensures the spiral reaches exactly radius at its maximum
      const scalingRatio = radius / naturalFinalRadius;

      // Number of points to draw in the spiral (more points = smoother curve)
      const numPoints = 40;

      // Start the spiral
      beginShape();
      noFill();

      // Add first point at center
      curveVertex(0, 0);
      curveVertex(0, 0); // Repeat first point to ensure curve starts correctly

      // Draw the spiral points using the Archimedean spiral formula
      // r = b * θ where b is the growth factor
      for (let i = 0; i < numPoints; i++) {
        // Map i to angle (θ): gradually increase to create revolutions
        const angle = map(i, 0, numPoints - 1, 0, revolutions * TWO_PI);

        // Calculate the natural radius using the growth factor
        // This creates a spiral where the distance between arms is consistent
        const naturalRadius = growthFactor * angle;

        // Scale the radius to match the target final radius (radius)
        const scaledRadius = naturalRadius * scalingRatio;

        // Calculate coordinates (x = r*cos(θ), y = r*sin(θ))
        const sx = scaledRadius * cos(angle);
        const sy = scaledRadius * sin(angle);

        // Add point to the curve
        curveVertex(sx, sy);
      }

      // Add final point to ensure smooth ending
      const lastAngle = revolutions * TWO_PI;
      const lastNaturalRadius = growthFactor * lastAngle;
      const lastScaledRadius = lastNaturalRadius * scalingRatio;
      curveVertex(
        lastScaledRadius * cos(lastAngle),
        lastScaledRadius * sin(lastAngle)
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
function drawRadialCircles(x, y, numRings, spacing, rotation = 0) {
  push();
  translate(x, y);
  rotate(radians(rotation));

  // Draw the center dot
  drawPoint(0, 0);

  // For each ring
  for (let r = 1; r <= numRings; r++) {
    // Current ring radius
    const ringRadius = r * spacing;

    // Calculate circumference of this ring
    const circumference = 2 * PI * ringRadius;

    // Calculate how many dots will fit in this ring with the given spacing
    const dotsInRing = Math.floor(circumference / spacing);

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
      drawPoint(dotX, dotY);
    }
  }

  pop();
}

function testPen() {
  const circleSpacing = 10; // Spacing between points
  const numCircles = 24; // Grid size

  drawPointGrid(100, 50, 10, 2, circleSpacing, 6, 0, POINT_STYLE.SWIRL);
  drawPointGrid(250, 50, 10, 2, circleSpacing, 5, 0, POINT_STYLE.CIRCLE);
  drawPointGrid(400, 50, 10, 2, circleSpacing, 6, 0, POINT_STYLE.POINT);
}

function localSetup() {
  noLoop();
  background(240, 240, 240);
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
  drawRadialCircles(
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

  // Now that the p5.svg library is loaded, we can use SVG rendering
  if (RENDER_SVG) {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, SVG);
  } else {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  localSetup();
}

function draw() {
  localDraw();

  if (RENDER_SVG) {
    save("moiree-shapes.svg");
  }
}
