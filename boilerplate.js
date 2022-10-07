const a3scalefactor = 1.414;

function setup() {
  let params = getURLParams();
  if (params.hash != undefined) {
    randomHash = new Random(params.hash);
    randomizedHashString = params.hash;
  } else randomHash = new Random();
  seed = round(randomHash.random_dec() * 1000000000);
  noiseSeed(seed);
  randomSeed(seed);

  let canvasWidth = 500;
  //createCanvas(1000, 1414, SVG); // A3 paper size
  createCanvas(canvasWidth, Math.round(canvasWidth * a3scalefactor)); // A3 paper size

  // --- setup begins here ---
}

function draw() {
  noLoop();
  stroke(0);
  background(255);
  strokeWeight(1);
  noFill();

  // --- drawing logic here ---

  //save("out.svg");
}

class Random {
  constructor() {
    let chars = "0123456789abcdef";
    let result = "0x";
    for (let i = 64; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    print("random hash result: " + result);

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
