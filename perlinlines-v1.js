const A3SCALE = 2; //1.414;
const CANVAS_WIDTH = 1000;
const RENDER_SVG = false;
let randomHash;
// http://localhost:3000/?hash=

const graphWidth = CANVAS_WIDTH;
const graphHeight = CANVAS_WIDTH;
const numLines = 50;
const spacing = graphHeight / numLines;
const amplitudeMax = 400;

function localSetup() {
  // your setup code goes here
  noLoop();
}

function localDraw() {
  // your drawing code goes here
  // background(255);
  strokeWeight(1);
  noFill();
  let colors = ["purple", "orange", "teal"];
  var step = 0.015;

  for (let k = 0; k < colors.length; k++) {
    stroke(colors[k]);
    for (let l = 0; l < numLines; l++) {
      beginShape();
      var xOffset = 0;
      var yOffset = (k * spacing) / colors.length;
      var amp = 0;
      for (var x = 0; x < graphWidth; x++) {
        //amp = sq(x / graphWidth) * amplitudeMax;
        amp = map(0.001 * sq(l), 0, numLines, 0, amplitudeMax);
        var noiseY = noise(k + xOffset) * l * amp;
        var sinY = sin(map(xOffset, 0, step * graphWidth, 0, TWO_PI / 2));
        var y = noiseY * sinY + yOffset;
        vertex(x, y + l * spacing);
        //vertex(x, sinY + l * spacing);

        xOffset += step;
      }
      endShape();
    }
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
