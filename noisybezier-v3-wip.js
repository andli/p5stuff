let rows;
let cols;
let margin;
let points;
let numLines;
let anchorDistance;
let noiseFactor;

function setup() {
  createCanvas(1000, 1000); //, SVG);
  // createCanvas(1000, 1000, SVG);
  //createCanvas(1000, 1414, SVG);// A3 paper size

  noiseSeed(1);
  margin = 100;
  numLines = 5;

  noiseFactor = 0.015;
  noiseScale = 230;
}

function draw() {
  noLoop();
  stroke(0);
  background(255);
  strokeWeight(1);
  noFill();
  let drawControlPoints = true;

  drawCurves();
  // save("noisybezier.svg");

  function drawCurves() {
    rect(margin, margin, width - 2 * margin, height - 2 * margin);

    let step = (width - 2 * margin) / numLines;
    let ad;
    let a1;
    let a2;
    let c1;
    let c2;
    for (let l = -numLines; l <= numLines; l++) {
      let scaleControl;
      if (l < 0) {
        anchorDistance = createVector(80, 80).mult(2);

        a1 = createVector(margin + (numLines + l) * step, margin); // bottom
        a2 = createVector(margin + (numLines + l) * step, height - margin); // left
        ad = anchorDistance.copy().mult((numLines + l) / (1 * numLines));
        c1 = createVector(a1.x + ad.x, a1.y + ad.y);
        ad = anchorDistance.copy().mult((numLines + l) / (1 * numLines));
        c2 = createVector(a2.x - ad.x, a2.y - ad.y);

        // addNoise(c1, scaleControl);
        // addNoise(c2, scaleControl);
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
}

function addNoise(controlVector, scaleControl) {
  const cv = controlVector.copy();
  p5.Vector.normalize(cv);
  let noisedVector = createVector(
    noiseScale * (noise(noiseFactor * cv.x) - 0.5),
    noiseScale * (noise(noiseFactor * cv.y) - 0.5)
  );
  controlVector.add(noisedVector.mult(scaleControl));
}