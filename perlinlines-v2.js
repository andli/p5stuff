const A3SCALE = 2; //1.414;
const CANVAS_WIDTH = 1000;
const RENDER_SVG = false;
let randomHash;
// http://localhost:3000/?hash=

const graphWidth = CANVAS_WIDTH;
const graphHeight = CANVAS_WIDTH;
const colors = ["purple", "orange", "teal"];
const numLines = colors.length * 25;
const spacing = 2;
const amplitudeMax = 1;
const step = 0.01; //noise offset

function localSetup() {
  // your setup code goes here
  noLoop();
}

function localDraw() {
  // your drawing code goes here
  // background(255);
  strokeWeight(1);
  noFill();

  var yGlobalOffset = graphHeight / 2;

  var xOffset = 0;
  for (let l = -numLines; l < numLines; l++) {
    let color = colors[Math.abs(l) % colors.length];
    stroke(color);
    beginShape();
    var yOffset = Math.abs(l) * spacing;
    var amp = 0;
    for (var x = 0; x < graphWidth; x++) {
      amp = map(sq(l), 0, numLines, 0, amplitudeMax);
      var noiseY = noise(xOffset) * amp;
      var sineComp = sin(map(xOffset, 0, step * graphHeight, 0, TWO_PI / 2));
      var y = noiseY * sineComp + yOffset;
      if (l < 0) {
        y = -y;
      }
      vertex(x, y + yGlobalOffset);
      //vertex(x, sinY + l * spacing);

      xOffset += step;
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
