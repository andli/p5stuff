let maxNoise;
let maxRadius;
let numCircles;

function setup() {
  createCanvas(400, 400);
  numCircles = 20;
  maxNoise = 10;
  maxRadius = 120;
}

function draw() {
  background(220);

  translate(width / 2, height / 2);
  stroke(0);
  noFill();

  for (let i = 0; i < numCircles; i++) {
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.01) {
      let { x, y } = applyNoise(a, i);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function applyNoise(a, i) {
  let xoff = map(cos(a), -1, 1, 0, maxNoise);
  let yoff = map(sin(a), -1, 1, 0, maxNoise);
  let r = map(i, 0, numCircles, 10, maxRadius);

  if (sin(a) < 0) {
    // Upper half of the circle, no noise
    return { x: r * cos(a), y: r * sin(a) };
  } else {
    // Lower half of the circle, apply noise
    let noiseFactor = sin(a); // Ranges from 0 to 1 in the lower half
    noiseFactor *= noiseFactor; // Squaring the noise factor
    noiseFactor = ease(noiseFactor); // Apply easing after squaring
    let n = noise(xoff, yoff) * noiseFactor * maxRadius; // Scale noise by radius
    return { x: (r + n) * cos(a), y: (r + n) * sin(a) };
  }
}

function ease(t) {
  return sin(t * HALF_PI); // Easing with sine function
}
