const A3SCALE = 1.414;
const CANVAS_WIDTH = 1000;
const RENDER_SVG = false;
let randomHash;

function localSetup() {
  // your setup code goes here
}

function localDraw() {
  // your drawing code goes here
  stroke(0);
  background(255);
  noFill();
  strokeWeight(4);
  //   bezier(10, 190, 10, 80, 90, 130, 90, 10);
  drawHeart(150, 160, 1);
  drawHeart(250, 300, 0.5);
}

function drawHeart(cx, cy, size) {
  let heartFoldTopY = cy - 55 * size;
  let heartTipY = cy + 160 * size;

  //TODO: change to vectors for better math
  let cp1x = cx - 50 * size;
  let cp1y = cy - 130 * size;
  let cp2x = cx - 140 * size;
  let cp2y = cy - 110 * size;
  let p2x = cp2x;
  let p2y = cy - 20 * size;
  let cp3x = cp2x;
  let cp3y = cy + 50 * size;
  let cp4x = cx - 40 * size;
  let cp4y = heartTipY - 30 * size;
  let cp5x = cx + 40 * size;
  let cp5y = heartTipY - 30 * size;
  let cp6x = cx + 140 * size;
  let cp6y = cy + 50 * size;
  let p7x = cp6x;
  let p7y = cy - 20 * size;
  let cp8x = cx + 140 * size;
  let cp8y = cy - 110 * size;
  let cp9x = cx + 50 * size;
  let cp9y = cy - 130 * size;

  beginShape();
  vertex(cx, heartFoldTopY);
  cp(cp1x, cp1y);
  cp(cp2x, cp2y);
  bezierVertex(cp1x, cp1y, cp2x, cp2y, p2x, p2y);
  cp(cp3x, cp3y);
  cp(cp4x, cp4y);
  bezierVertex(cp3x, cp3y, cp4x, cp4y, cx, heartTipY);
  cp(cp5x, cp5y);
  cp(cp6x, cp6y);
  bezierVertex(cp5x, cp5y, cp6x, cp6y, p7x, p7y);
  cp(cp8x, cp8y);
  cp(190, 30);
  bezierVertex(cp8x, cp8y, cp9x, cp9y, cx, heartFoldTopY);
  endShape();
  function cp(x, y) {
    strokeWeight(14);
    stroke(160, 0, 0);
    point(x, y);
    stroke(0);
    strokeWeight(4);
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
