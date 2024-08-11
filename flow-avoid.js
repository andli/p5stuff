const A3SCALE = 1.414;
const CANVAS_WIDTH = 1000;
const RENDER_SVG = false;
let randomHash;
let seed;

function localSetup() {
  // Any setup code if needed
}

function localDraw() {
  let squareSize = 500; // Size of the square frame
  let centerX = width / 2;
  let centerY = height / 2;
  let circleRadius = 150; // Radius of the circle in the middle
  let numCurves = 350; // Number of flow lines
  let noiseScale = 0.01; // Scale of the Perlin noise
  let stepSize = 2; // Size of each step in the flow field
  let maxSteps = 300; // Maximum number of steps per flow line

  for (let i = 0; i < numCurves; i++) {
    let startX = centerX - squareSize / 2;
    let startY = centerY - squareSize / 2 + random(squareSize);
    let x = startX;
    let y = startY;

    beginShape();
    for (let j = 0; j < maxSteps; j++) {
      if (dist(x, y, centerX, centerY) < circleRadius) break;
      if (x > centerX + squareSize / 2 || y > centerY + squareSize / 2 || x < centerX - squareSize / 2 || y < centerY - squareSize / 2) break;
      vertex(x, y);
      let angle = noise(x * noiseScale, y * noiseScale) * TWO_PI; // Flow field direction
      x += cos(angle) * stepSize;
      y += sin(angle) * stepSize;
    }
    endShape();
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
