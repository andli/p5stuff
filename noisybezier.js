let rows;
let cols;
let margin;
let points;
let numLines;
let anchorDistance;
let noiseFactor;

function setup() {
  createCanvas(1000, 1000);
  //createCanvas(1000, 1414, SVG);// A3 paper size

  noiseSeed(37);
  margin = 20;
  numLines = 80;
  anchorDistance = createVector(120, 80);
  noiseFactor = 0.02;
  noiseScale = 100;
  anchorScale = 1.5; // how far to pull the bezier handles
}

function draw() {
  noLoop();
  background(255);
  stroke(0);
  strokeWeight(1);
  noFill();
  let drawControlPoints = true;

  // translate(width/2,height/2);
  rect(margin, margin, width - 2 * margin, height - 2 * margin);

  let step = floor((width - 2 * margin) / numLines);
  for (let l = -numLines; l <= numLines; l++) {
    let scaleControl = ((numLines + l) / numLines) * anchorScale;
    let ad = anchorDistance.copy().mult(scaleControl);

    let a1 = createVector(margin, height - margin - (numLines + l) * step);
    let a2 = createVector(width - margin - step * -l, height - margin);
    let c1 = createVector(a1.x + ad.x, a1.y + ad.y);
    let c2 = createVector(a2.x - ad.y, a2.y - ad.x);
    // addNoise(c1);
    // addNoise(c2);

    if (l >= 0) {
      scaleControl = ((numLines - l) / numLines) * anchorScale;
      ad = anchorDistance.copy().mult(scaleControl);
      a1.x = l * step + margin;
      a1.y = margin;
      a2.x = width - margin;
      a2.y = height - l * step - margin;
      c1 = a1.copy().add(ad);
      c2 = a2.copy().sub(ad);
      // addNoise(c1);
      // addNoise(c2);
    }

    if (drawControlPoints) {
      strokeWeight(8);
      stroke("blue");
      point(a1.x, a1.y);
      point(a2.x, a2.y);
      stroke("red");
      point(c1.x, c1.y);
      point(c2.x, c2.y);
      stroke(0);
      strokeWeight(1);
    }

    bezier(a1.x, a1.y, c1.x, c1.y, c2.x, c2.y, a2.x, a2.y);
  }
}

function addNoise(controlVector) {
  const cv = controlVector.copy();
  p5.Vector.normalize(cv);
  let noisedVector = createVector(
    noiseScale * (noise(noiseFactor * cv.x) - 0.5),
    noiseScale * (noise(noiseFactor * cv.y) - 0.5)
  );
  controlVector.add(noisedVector);
}
