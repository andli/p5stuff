let ROWS;
let COLS;
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
  margin = 10;
  numLines = 400;
  anchorDistance = createVector(120, 80).mult(2);
  noiseFactor = 0.015;
  noiseScale = 230;
}

function draw() {
  noLoop();
  // background(255);
  stroke(0);
  strokeWeight(1);
  noFill();
  let drawControlPoints = false;

  drawCurves();
  // save("noisybezier.svg");

  function drawCurves() {
    rect(margin, margin, width - 2 * margin, height - 2 * margin);

    let step = (width - 2 * margin) / numLines;
    for (let l = -numLines; l <= numLines; l++) {
      let scaleControl;
      let ad;
      let a1;
      let a2;
      let c1;
      let c2;
      if (l < 0) {
        scaleControl = (numLines + l) / (1 * numLines);
        ad = anchorDistance.copy().mult(scaleControl);

        a1 = createVector(margin, height - margin - (numLines + l) * step);
        a2 = createVector(width - margin - step * -l, height - margin);
        c1 = a1.copy().add(ad);
        c2 = a2.copy().sub(ad);

        addNoise(c1, scaleControl);
        addNoise(c2, scaleControl);
      } else if (l >= 0) {
        scaleControl = (numLines - l) / numLines;
        ad = anchorDistance.copy().mult(scaleControl);
        a1 = createVector(l * step + margin, margin);
        a2 = createVector(width - margin, height - l * step - margin);
        c1 = a1.copy().add(ad);
        c2 = a2.copy().sub(ad);

        addNoise(c1, scaleControl);
        addNoise(c2, scaleControl);
      }

      if (drawControlPoints) {
        strokeWeight(8);
        //   stroke("blue");
        //   point(a1.x, a1.y);
        //   point(a2.x, a2.y);
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
