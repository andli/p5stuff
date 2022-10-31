const A3SCALE = 1.414;
const CANVAS_WIDTH = 1000;
const RENDER_SVG = false;
let randomHash;

let circles = [];
const NUMLINES = 20;
const CP_MARGIN = 20;
const LINE_MARGIN = 5;
let lineDist;

function localSetup() {
  // your setup code goes here
  lineDist = height / NUMLINES;

  circles.push({ x: 300, y: 200, r: 80 });
  circles.push({ x: 600, y: 400, r: 100 });
}

function localDraw() {
  // your drawing code goes here
  circles.forEach(function (item) {
    circle(item.x, item.y, 2 * item.r);
  });

  let currentLineHeight = 0;
  while (currentLineHeight < height) {
    if (
      circles.some(
        (c) => currentLineHeight > c.y - c.r && currentLineHeight < c.y + c.r
      )
    ) {
      let ci = circles.find(
        (c) => currentLineHeight > c.y - c.r && currentLineHeight < c.y + c.r
      );
      let cp1x = ci.x - ci.r - CP_MARGIN;
      let cp1y = currentLineHeight;
      let cp2x = ci.x - ci.r - CP_MARGIN;
      let cp2y = currentLineHeight - ci.r - CP_MARGIN;
      let cp3x = ci.x;
      let cp3y = ci.y - ci.r;

      push(); // Start a new drawing state
      strokeWeight(10);
      stroke("red");
      point(cp1x, cp1y);
      stroke("blue");
      point(cp2x, cp2y);
      stroke("green");
      point(cp3x, cp3y);
      pop();

      beginShape();
      vertex(0, currentLineHeight);
      bezierVertex(cp1x, cp1y, cp2x, cp2y, cp3x, cp3y);
      bezierVertex(
        ci.x + ci.r + CP_MARGIN,
        ci.y - ci.r,
        ci.x + ci.r + CP_MARGIN,
        currentLineHeight + ci.r + LINE_MARGIN,
        ci.x + ci.r + CP_MARGIN,
        currentLineHeight
      );
      vertex(width, currentLineHeight);
      endShape();
    } else {
      line(0, currentLineHeight, width, currentLineHeight);
    }
    currentLineHeight += lineDist;
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
