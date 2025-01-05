const RENDER_SVG = false;
const A_PAPER_SCALE = 1.414;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = Math.round(1000 * A_PAPER_SCALE);

const MARGIN = 80;
const MAX_DIAMETER = 8;
const SPACING = MAX_DIAMETER * 0.9;
const NOISE_SCALING = 0.08;
const SMALLEST_RADIUS_THRESHOLD = MAX_DIAMETER * 0.05;

const CIRCLE_COLS = Math.round((CANVAS_WIDTH - 2 * MARGIN) / SPACING);
const CIRCLE_ROWS = Math.round((CANVAS_HEIGHT - 2 * MARGIN) / SPACING);

let randomHash;

function localSetup() {
  // your setup code goes here
}

function localDraw() {
  // Calculate the values
  const valuesArray = Array.from(
    { length: CIRCLE_ROWS * CIRCLE_COLS },
    (_, index) => MAX_DIAMETER * getNoise(index)
  );

  // Draw the circles in a snake-like pattern
  for (let i = 0; i < CIRCLE_COLS; i++) {
    if (i % 2 === 0) {
      // Odd row (0-indexed): left to right
      for (let j = 0; j < CIRCLE_ROWS; j++) {
        drawCircle(i, j);
      }
    } else {
      // Even row (0-indexed): right to left
      for (let j = CIRCLE_ROWS - 1; j >= 0; j--) {
        drawCircle(i, j);
      }
    }
  }

  function drawCircle(i, j) {
    const yCoord = j * SPACING + MARGIN;
    const xCoord = i * SPACING + MARGIN;

    const arrayPos = i * CIRCLE_COLS + j;
    if (valuesArray[arrayPos] < SMALLEST_RADIUS_THRESHOLD) {
      return;
    }
    circle(xCoord, yCoord, valuesArray[arrayPos]);
  }
}

function getNoise(param) {
  return noise(param * NOISE_SCALING);
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
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, SVG);
  } else {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
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
