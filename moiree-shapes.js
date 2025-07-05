const RENDER_SVG = false;
const A_PAPER_SCALE = 1.414;
const GOLDEN_RATIO = 1.61803398875;
const MTG_RATIO = 1.3968;
const CHOSEN_RATIO = MTG_RATIO;
const CANVAS_WIDTH = 650;
const CANVAS_HEIGHT = Math.round(CANVAS_WIDTH * CHOSEN_RATIO);
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
 * Draws a grid of circles with a specified rotation
 * @param {number} x - X coordinate of the grid center
 * @param {number} y - Y coordinate of the grid center
 * @param {number} cols - Number of columns in the grid
 * @param {number} rows - Number of rows in the grid
 * @param {number} cellSize - Size of each cell in the grid
 * @param {number} circleRadius - Radius of each circle
 * @param {number} angle - Angle in degrees to rotate the entire grid
 */
function drawCircleGrid(x, y, cols, rows, cellSize, circleRadius, angle = 0) {
  push();
  translate(x, y);
  rotate(radians(angle));

  // Calculate the grid dimensions
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;

  // Offset to center the grid
  const offsetX = -gridWidth / 2;
  const offsetY = -gridHeight / 2;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Calculate the position of each circle
      const circleX = offsetX + i * cellSize + cellSize / 2;
      const circleY = offsetY + j * cellSize + cellSize / 2;

      // Draw the circle
      circle(circleX, circleY, circleRadius * 2);
    }
  }
  pop();
}

/**
 * Draws a grid of points with a specified rotation
 * @param {number} x - X coordinate of the grid center
 * @param {number} y - Y coordinate of the grid center
 * @param {number} cols - Number of columns in the grid
 * @param {number} rows - Number of rows in the grid
 * @param {number} cellSize - Size of each cell in the grid
 * @param {number} pointWeight - Weight/thickness of each point
 * @param {number} angle - Angle in degrees to rotate the entire grid
 */
function drawPointGrid(x, y, cols, rows, cellSize, angle = 0) {
  push();
  translate(x, y);
  rotate(radians(angle));

  // Calculate the grid dimensions
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;

  // Offset to center the grid
  const offsetX = -gridWidth / 2;
  const offsetY = -gridHeight / 2;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Calculate the position of each point
      const pointX = offsetX + i * cellSize + cellSize / 2;
      const pointY = offsetY + j * cellSize + cellSize / 2;

      // Draw the point
      point(pointX, pointY);
    }
  }

  pop();
}

function drawPointSquare(x, y, size, cellSize, angle) {
  drawPointGrid(x, y, size, size, cellSize, angle);
}

/**
 * Draws circles in a radial pattern starting from center
 * @param {number} x - X coordinate of the center
 * @param {number} y - Y coordinate of the center
 * @param {number} numRings - Number of rings to draw
 * @param {number} spacing - Spacing between dots both radially and angularly
 * @param {number} pointWeight - Radius of each dot
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
  point(0, 0);

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

      // Draw the dot
      point(dotX, dotY);
    }
  }
  // Restore the default stroke weight
  strokeWeight(1);
  pop();
}

function localSetup() {
  // your setup code goes here
}

function localDraw() {
  circleRadius = 5;
  circleSpacing = 10;
  numCircles = 24;
  numRings = 13;
  strokeWeight(5);

  drawPointSquare(220, 220, numCircles, circleSpacing, 0);
  drawPointSquare(318, 352, numCircles, circleSpacing, 20);
  /* drawPointSquare(
    372,
    540,
    numCircles,
    circleSpacing,
    45
  ); */
  drawRadialCircles(
    372, // x position (center)
    540, // y position (center)
    numRings, // max radius of pattern
    circleSpacing, // spacing between dots
    0 // rotation angle (degrees)
  );
  drawPointSquare(412, 682, numCircles, circleSpacing, 0);

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

  // Now that the p5.svg library is loaded, we can use SVG rendering
  if (RENDER_SVG) {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, SVG);
  } else {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  localSetup();
}

function draw() {
  noLoop();
  stroke(0);
  background(240, 240, 240);
  strokeWeight(8.5);
  noFill();

  localDraw();

  if (RENDER_SVG) {
    save("moiree-shapes.svg");
  }
}
