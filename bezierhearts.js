const A3SCALE = 1.414;
const CANVAS_WIDTH = 1000;
const RENDER_SVG = true;
let randomHash;

const NOISEFACTOR_ROT = 0.2;

function localSetup() {
  // your setup code goes here
}

function localDraw() {
  // your drawing code goes here
  stroke(0);
  background(255);
  noFill();
  strokeWeight(2);
  //   bezier(10, 190, 10, 80, 90, 130, 90, 10);
  const MARGIN = 25;
  const PADDING = 40;
  const ROWS = 20;
  const COLS = 13;
  const SIZE = 1.1;
  let hearts = [];
  for (x = 0; x < COLS; x++) {
    for (y = 0; y < ROWS; y++) {
      hearts.push([
        x * PADDING + MARGIN,
        y * PADDING + MARGIN,
        noise(x, y) * NOISEFACTOR_ROT,
      ]);
    }
  }
  for (x = 0; x < COLS * ROWS; x++) {
    drawHeart(hearts[x][0], hearts[x][1], SIZE, hearts[x][2]);
  }
}

function drawHeart(cx, cy, size, noiseVal) {
  const R = 2.5;
  let c = createVector(cx, cy);
  let p1 = createVector(0, -5.5);
  let p4 = createVector(0, 16.0);
  let cp1 = createVector(-5.0 + random(-R, R), -13.0 + random(-R, R));
  let cp2 = createVector(-14.0 + random(-R, R), -11.0 + random(-R, R));
  let p2 = createVector(cp2.x, -2.0);
  let cp3 = createVector(cp2.x + random(-R, R), 5.0 + random(-R, R));
  let cp4 = createVector(-4.0 + random(-R, R), p4.y - 3.0 + random(-R, R));
  let cp5 = createVector(4.0 + random(-R, R), p4.y - 3.0 + random(-R, R));
  let cp6 = createVector(14.0 + random(-R, R), 5.0 + random(-R, R));
  let p3 = createVector(cp6.x + random(-R, R), -2.0 + random(-R, R));
  let cp7 = createVector(14.0 + random(-R, R), -11.0 + random(-R, R));
  let cp8 = createVector(5.0 + random(-R, R), -13.0 + random(-R, R));

  push();
  translate(c);
  rotate(noiseVal * 2 * Math.PI);
  scale(size);
  beginShape();
  vertex(p1.x, p1.y);
  bezierVertex(cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);
  bezierVertex(cp3.x, cp3.y, cp4.x, cp4.y, p1.x, p4.y);
  bezierVertex(cp5.x, cp5.y, cp6.x, cp6.y, p3.x, p3.y);
  bezierVertex(cp7.x, cp7.y, cp8.x, cp8.y, p1.x, p1.y);
  endShape();
  pop();
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
