const A3SCALE = 1.414;
const CANVAS_WIDTH = 1000;
const RENDER_SVG = false;
let randomHash;
let seed;
let circleRadius;

function localSetup() {
  // Set the radius of the circle
  circleRadius = CANVAS_WIDTH / 3; // Example radius
}

function localDraw() {
  // Draw the circle filled with bezier curves
  let centerX = width / 2;
  let centerY = height / 2;

  let numCurves = 300; // Number of bezier curves
  let noiseScale = 2;

  for (let i = 0; i < numCurves; i++) {
    let t = (i + 0.5) / numCurves; // Adjust t to avoid edge cases

    let y1 = lerp(centerY - circleRadius, centerY + circleRadius, t);
    let y4 = y1;

    let x1 = centerX - sqrt(circleRadius ** 2 - (y1 - centerY) ** 2);
    let x4 = centerX + sqrt(circleRadius ** 2 - (y1 - centerY) ** 2);

    let noiseVal1 = noise(t * noiseScale);
    let noiseVal2 = noise((t + 1) * noiseScale);

    // Control points adjusted by Perlin noise, kept inside the circle
    let x2 = lerp(x1, x4, 0.3) + (noiseVal1 - 0.5) * circleRadius * 0.8;
    let y2 = y1 + (noiseVal1 - 0.5) * circleRadius * 0.8;
    let x3 = lerp(x1, x4, 0.7) + (noiseVal2 - 0.5) * circleRadius * 0.8;
    let y3 = y4 + (noiseVal2 - 0.5) * circleRadius * 0.8;

    bezier(x1, y1, x2, y2, x3, y3, x4, y4);
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
