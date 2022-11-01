const A3SCALE = 1.414;
const CANVAS_WIDTH = 1000;
const RENDER_SVG = false;
let randomHash;

let circles = [];
const DRAWCONTROLPOINTS = false;
const NUMLINES = 140;
const CP_MARGIN = 0;
const LINE_BACKOFF = 70;
const LINE_MARGIN = 5;
let lineDist;

function localSetup() {
  // your setup code goes here
  lineDist = height / NUMLINES;

  circles.push({ x: 300, y: 200, r: 80 });
  circles.push({ x: 600, y: 400, r: 100 });
  circles.push({ x: 350, y: 500, r: 50 });
}

function localDraw() {
  // your drawing code goes here
  circles.forEach(function (item) {
    circle(item.x, item.y, 2 * item.r);

    drawLine(item.y - lineDist / 2, item, circles);
    drawLine(item.y + lineDist / 2, item, circles);
  });
}

function drawLine(currentLineHeight, ci, circles) {
  //TODO: check intersections to add points
  let pointsList = [];

  let dirMod = 1;
  if (currentLineHeight < ci.y) {
    dirMod = -1;
  }
  let cp1x = ci.x - ci.r - CP_MARGIN;
  let cp1y = currentLineHeight;
  let cp2x = ci.x - ci.r - CP_MARGIN;
  let cp2y = ci.y + dirMod * ci.r;
  let p3x = ci.x;
  let distFromCenter = Math.abs(ci.y - currentLineHeight);
  let p3y = ci.y + dirMod * (ci.r + LINE_MARGIN - distFromCenter);

  let cp4x = ci.x + ci.r + CP_MARGIN;
  let cp4y = ci.y + dirMod * ci.r;
  let cp5x = ci.x + ci.r + CP_MARGIN;
  let cp5y = currentLineHeight - LINE_MARGIN;
  let p6x = ci.x + ci.r + CP_MARGIN + LINE_BACKOFF;
  let p6y = currentLineHeight;

  if (DRAWCONTROLPOINTS) {
    push(); // draw control points
    strokeWeight(10);
    stroke("red");
    point(cp1x, cp1y);
    stroke("purple");
    point(cp2x, cp2y);
    stroke("blue");
    point(p3x, p3y);
    stroke("green");
    point(cp4x, cp4y);
    stroke("brown");
    point(cp5x, cp5y);
    stroke("orange");
    point(p6x, p6y);
    pop();
  }
  beginShape();
  vertex(0, currentLineHeight);
  vertex(ci.x - ci.r - CP_MARGIN - LINE_BACKOFF, currentLineHeight);
  bezierVertex(cp1x, cp1y, cp2x, cp2y, p3x, p3y);
  bezierVertex(cp4x, cp4y, cp5x, cp5y, p6x, p6y);
  vertex(width, currentLineHeight);
  endShape();
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
  strokeWeight(3);
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
