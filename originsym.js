const A3SCALE = 1.414;
const CANVAS_WIDTH = 400;
const RENDER_SVG = false;
let randomHash;
let m;

function localSetup() {
  // your setup code goes here
  m = createModel();
}

function localDraw() {
  background(100);
  orbitControl(2, 1, 0.05);
  model(m);
}

function createModel() {
  return new p5.Geometry(
    // detailX and detailY are not used in this example
    1,
    1,
    // The callback must be an anonymous function, not an arrow function in
    // order for "this" to be bound correctly.
    function createGeometry() {
      const THICKNESS = 6;
      const F_HEIGHT = 50;
      const F_WIDTH = 30;
      const S_HEIGHT = 120;

      this.vertices.push(
        new p5.Vector(0, 0, 0),
        new p5.Vector(0, F_HEIGHT + THICKNESS, 0),
        new p5.Vector(F_WIDTH, F_HEIGHT + THICKNESS, 0),
        new p5.Vector(F_WIDTH, F_HEIGHT + THICKNESS + S_HEIGHT, 0),
        new p5.Vector(F_WIDTH + THICKNESS, F_HEIGHT + THICKNESS + S_HEIGHT, 0),
        new p5.Vector(F_WIDTH + THICKNESS, F_HEIGHT + THICKNESS, 0),
        new p5.Vector(2 * F_WIDTH + THICKNESS, F_HEIGHT + THICKNESS, 0),
        new p5.Vector(2 * F_WIDTH + THICKNESS, 0, 0),
        new p5.Vector(2 * F_WIDTH, 0, 0),
        new p5.Vector(2 * F_WIDTH, F_HEIGHT, 0),
        new p5.Vector(THICKNESS, F_HEIGHT, 0),
        new p5.Vector(THICKNESS, 0, 0)
      );
      this.faces.push([0, 1, 2]);
      this.gid = "my-example-geometry";
    }
  );
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
    createCanvas(CANVAS_WIDTH, Math.round(CANVAS_WIDTH * A3SCALE), WEBGL);
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
