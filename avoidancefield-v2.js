const A3SCALE = 1.414;
const CANVAS_WIDTH = 1000;
const RENDER_SVG = false;
let randomHash;

let circles = [];
const DRAWCONTROLPOINTS = false;
const NUMLINES = 220;
const CP_MARGIN = 0;
const LINE_BACKOFF = 70;
const LINE_MARGIN = 5;
let ld;

function localSetup() {
  // your setup code goes here
  ld = height / NUMLINES;

  circles.push({ x: 180, y: 300, r: 50 });
  circles.push({ x: 500, y: 200, r: 100 });
  circles.push({ x: 430, y: 490, r: 75 });
}

function localDraw() {
  // your drawing code goes here
  circles.forEach(function (item) {
    circle(item.x, item.y, 2 * item.r);
  });

  let currentLineHeight = 0;
  while (currentLineHeight < height) {
    drawLine(currentLineHeight, circles);

    currentLineHeight += ld;
  }
}

function drawLine(currentLineHeight, circles) {
  circles.sort((a, b) => a.x - b.x); // sort circles in order of x pos beacuse lines are drawn from x 0->width.

  beginShape();
  vertex(0, currentLineHeight); // line start

  let i = 0;
  while (i < circles.length) {
    let dirMod = 1;
    if (currentLineHeight < circles[i].y) {
      dirMod = -1;
    }
    let distFromCenter = Math.abs(currentLineHeight - circles[i].y); //OK
    let r = circles[i].r; //OK
    let threshold = r + 7 * ld;
    print(threshold);
    if (distFromCenter <= threshold) {
      let numLinesPerCircle = r / ld; //OK
      let compressedHeight = threshold / numLinesPerCircle + 0.2 * r;
      let originalHeight = numLinesPerCircle * ld; //OK
      let scale = compressedHeight / originalHeight; //OK
      let addToRadius = distFromCenter * scale + LINE_MARGIN;
      let h = dirMod * (r + addToRadius);
      // print(numLinesPerCircle);
      bvx(circles[i].x, currentLineHeight, r * 0.5, circles[i].y + h, false);
    }
    i++;
  }

  vertex(width, currentLineHeight); // line end
  endShape();
}

function bv(c1x, c1y, c2x, c2y, p3x, p3y, dots) {
  if (dots) {
    push();
    strokeWeight(10);
    stroke("red");
    point(p3x, p3y);
    stroke("blue");
    point(c1x, c1y);
    stroke("purple");
    point(c2x, c2y);
    pop();
  }
  bezierVertex(c1x, c1y, c2x, c2y, p3x, p3y);
}

function bvx(x, y, w, h, dots) {
  push();
  if (dots) {
    strokeWeight(10);
    stroke("green");
    point(x - 4 * w, y);
  }
  vertex(x - 4 * w, y);
  pop();
  bv(x - 2 * w, y, x - 2 * w, h, x, h, dots);
  bv(x + 2 * w, h, x + 2 * w, y, x + 4 * w, y, dots);
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
