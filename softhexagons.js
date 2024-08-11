//http://127.0.0.1:3000/?hash=0xdd54690a4d5c4079c73fa00d1fb4d7ef21ba9d3b63ceccc295a59fa38a628a0a

const A3SCALE = 1.414;
const CANVAS_WIDTH = 1000;
const RENDER_SVG = false;
let randomHash;
let seed;
let hexRadius;

const ROWS = 5;
const COLS = 5;
const HEX_RADIUS = 100; // Radius of the hexagon

function localSetup() {
  // Set the radius of the hexagon
  hexRadius = HEX_RADIUS;
}

function localDraw() {
  let hexWidth = hexRadius * 2; // Width of a single hexagon
  let hexHeight = hexRadius * sqrt(3); // Height of a single hexagon
  let horizontalSpacing = hexWidth * 3/4; // Horizontal spacing between hexagon centers
  let verticalSpacing = hexHeight; // Vertical spacing between hexagon centers
  let totalWidth = (COLS - 1) * horizontalSpacing + hexWidth; // Total width of the hexagon grid
  let totalHeight = (ROWS - 1) * verticalSpacing + hexHeight; // Total height of the hexagon grid

  let startX = (width - totalWidth) / 2;
  let startY = (height - totalHeight) / 2;

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      let centerX = startX + col * horizontalSpacing;
      let centerY = startY + row * verticalSpacing + (col % 2) * (hexHeight / 2);
      
      drawFlowFieldHexagon(centerX, centerY, hexRadius);
      //drawHexagonOutline(centerX, centerY, hexRadius);
    }
  }
}


function drawFlowFieldHexagon(centerX, centerY, radius) {
  stroke(0);
  let numCurves = 300; // Number of flow lines
  let noiseScale = 0.0032; // Scale of the Perlin noise
  let stepSize = 1; // Size of each step in the flow field
  let maxSteps = 150; // Maximum number of steps per flow line

  noiseSeed(randomHash.random_int(0, 1000000)); // Ensure each hexagon has its own unique noise pattern

  for (let i = 0; i < numCurves; i++) {
    // Start each line at a random point within the hexagon
    let angle = random(TWO_PI);
    let r = random(hexRadius);
    let startX = centerX + r * cos(angle);
    let startY = centerY + r * sin(angle);
    let x = startX;
    let y = startY;

    beginShape();
    for (let j = 0; j < maxSteps; j++) {
      if (!pointInHexagon(x, y, centerX, centerY, radius)) break;
      vertex(x, y);
      let angle = noise(x * noiseScale, y * noiseScale) * TWO_PI; // Flow field direction
      x += cos(angle) * stepSize;
      y += sin(angle) * stepSize;
    }
    endShape();
  }
}

function drawHexagonOutline(centerX, centerY, radius) {
  stroke(255, 0, 0); // Set stroke color to red
  noFill();
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x = centerX + radius * cos(angle);
    let y = centerY + radius * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function pointInHexagon(x, y, centerX, centerY, radius) {
  for (let i = 0; i < 6; i++) {
    let theta1 = TWO_PI / 6 * i;
    let theta2 = TWO_PI / 6 * (i + 1);
    let x1 = centerX + radius * cos(theta1);
    let y1 = centerY + radius * sin(theta1);
    let x2 = centerX + radius * cos(theta2);
    let y2 = centerY + radius * sin(theta2);
    if (triangleContains(x1, y1, x2, y2, centerX, centerY, x, y)) {
      return true;
    }
  }
  return false;
}

function triangleContains(x1, y1, x2, y2, x3, y3, px, py) {
  let d1 = sign(px, py, x1, y1, x2, y2);
  let d2 = sign(px, py, x2, y2, x3, y3);
  let d3 = sign(px, py, x3, y3, x1, y1);
  let has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  let has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
  return !(has_neg && has_pos);
}

function sign(x1, y1, x2, y2, x3, y3) {
  return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
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

  if (RENDER_SVG) {
    createCanvas(CANVAS_WIDTH, Math.round(CANVAS_WIDTH * A3SCALE), SVG);
  } else {
    createCanvas(CANVAS_WIDTH, Math.round(CANVAS_WIDTH * A3SCALE));
  }

  localSetup();
}

function draw() {
  noLoop();
  stroke(0);
  background(255);
  strokeWeight(1);
  noFill();

  localDraw();

  if (RENDER_SVG) {
    save("out.svg");
  }
}

class Random {
  constructor(hash) {
    let result = "0x";
    if (hash == undefined) {
      let chars = "0123456789abcdef";
      for (let i = 64; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
      print("random hash result: " + result);
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
