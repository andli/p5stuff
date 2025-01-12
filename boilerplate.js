const RENDER_SVG = false;
const A_PAPER_SCALE = 1.414;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = Math.round(1000 * A_PAPER_SCALE);
let randomHash;

const sketch = (p) => {
  function localSetup() {
    // your setup code goes here
  }

  function localDraw() {
    // your drawing code goes here
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
      createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, SVG);
    } else {
      createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
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
};

new p5(sketch);
