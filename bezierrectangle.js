const A3SCALE = 1.414;
const CANVAS_WIDTH = 600;
const RENDER_SVG = false;
const numCurves = 200;
let randomHash;
let rectX, rectY, rectWidth, rectHeight;

function localSetup() {
  // Set the dimensions for the rectangle
  let padding = 0.05;
  rectX = CANVAS_WIDTH * padding;
  rectY = CANVAS_WIDTH * padding;
  rectWidth = CANVAS_WIDTH * (1 - 2 * padding);
  rectHeight = (CANVAS_WIDTH * A3SCALE) * (1 - 2 * padding);
}

function drawCurves(startX, startY, endX, endY, i, noiseScale) {
  let controlX1 = lerp(startX, endX, 0.2) + map(noise(i * noiseScale), 0, 1, -20, 20);
  let controlY1 = lerp(startY, endY, 0.2) + map(noise(i * noiseScale + 10), 0, 1, -20, 20);
  let controlX2 = lerp(startX, endX, 0.4) + map(noise(i * noiseScale + 20), 0, 1, -20, 20);
  let controlY2 = lerp(startY, endY, 0.4) + map(noise(i * noiseScale + 30), 0, 1, -20, 20);
  let controlX3 = lerp(startX, endX, 0.6) + map(noise(i * noiseScale + 40), 0, 1, -20, 20);
  let controlY3 = lerp(startY, endY, 0.6) + map(noise(i * noiseScale + 50), 0, 1, -20, 20);
  let controlX4 = lerp(startX, endX, 0.8) + map(noise(i * noiseScale + 60), 0, 1, -20, 20);
  let controlY4 = lerp(startY, endY, 0.8) + map(noise(i * noiseScale + 70), 0, 1, -20, 20);

  // Draw the bezier curve starting and ending exactly on the rectangle edges
  beginShape();
  for (let t = 0; t <= 1; t += 0.01) {
    let x = bezierPoint(bezierPoint(startX, controlX1, controlX2, controlX3, t), controlX3, controlX4, endX, t);
    let y = bezierPoint(bezierPoint(startY, controlY1, controlY2, controlY3, t), controlY3, controlY4, endY, t);

    vertex(x, y);
  }
  endShape();
}

function localDraw() {
  const noiseScale = 0.04;

  for (let i = 0; i < numCurves; i++) {
    // First Half: Top-left to bottom-right diagonal
    let startX = map(i, 0, numCurves - 1, rectX, rectX + rectWidth);
    let startY = rectY;
    let endX = rectX + rectWidth;
    let endY = map(i, 0, numCurves - 1, rectY + rectHeight, rectY);

    drawCurves(startX, startY, endX, endY, i, noiseScale);

    // Mirrored Half: Bottom-left to top-right diagonal (mirroring the first half)
    startX = map(i, 0, numCurves - 1, rectX, rectX + rectWidth);
    startY = rectY + rectHeight;
    endX = rectX;
    endY = map(i, 0, numCurves - 1, rectY, rectY + rectHeight);

    drawCurves(endX, endY, startX, startY, i + numCurves, noiseScale);
  }
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
