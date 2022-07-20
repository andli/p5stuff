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
  noiseFactor = 0.005;
  noiseScale = 1;
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
    let noiseVal1;
    let noiseVal2;
    let scaleControl = ((numLines + l) / numLines) * anchorScale;
    let a1 = createVector(margin, height - margin - (numLines + l) * step);
    let a2 = createVector(width - margin - step * -l, height - margin);
    let c1 = createVector(
      a1.x + anchorDistance.x * scaleControl,
      a1.y + anchorDistance.y * scaleControl
    );
    let c2 = createVector(
      a2.x - anchorDistance.y * scaleControl,
      a2.y - anchorDistance.x * scaleControl
    );

    if (l >= 0) {
      scaleControl = ((numLines - l) / numLines) * anchorScale;
      a1.x = l * step + margin;
      a1.y = margin;
      a2.x = width - margin;
      a2.y = height - l * step - margin;
      c1.x = a1.x + anchorDistance.x * scaleControl;
      c1.y = a1.y + anchorDistance.y * scaleControl;
      c2.x = a2.x - anchorDistance.y * scaleControl;
      c2.y = a2.y - anchorDistance.x * scaleControl;
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
