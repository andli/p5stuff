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
    let ax1 = margin;
    let ay1 = height - margin - (numLines + l) * step;
    let ax4 = width - margin - step * -l;
    let ay4 = height - margin;
    let x2 = ax1 + anchorDistance.x * scaleControl;
    let y2 = ay1 + anchorDistance.y * scaleControl;
    let x3 = ax4 - anchorDistance.y * scaleControl;
    let y3 = ay4 - anchorDistance.x * scaleControl;

    x2 = x2 * (1 + noise(ax1 * noiseFactor) - 0.5 * noiseScale);
    y2 = y2 * (1 + -noise(ay1 * noiseFactor) - 0.5 * noiseScale);
    x3 = x3 * (1 + noise(ax4 * noiseFactor) - 0.5 * noiseScale);
    y3 = y3 * (1 + -noise(ay4 * noiseFactor) - 0.5 * noiseScale);

    if (l >= 0) {
      scaleControl = ((numLines - l) / numLines) * anchorScale;
      ax1 = l * step + margin;
      ay1 = margin;
      ax4 = width - margin;
      ay4 = height - l * step - margin;
      x2 = ax1 + anchorDistance.x * scaleControl;
      y2 = ay1 + anchorDistance.y * scaleControl;
      x3 = ax4 - anchorDistance.y * scaleControl;
      y3 = ay4 - anchorDistance.x * scaleControl;

      x2 = x2 * (1 + noise(ax1 * noiseFactor) - 0.5 * noiseScale);
      y2 = y2 * (1 + -noise(ay1 * noiseFactor) - 0.5 * noiseScale);
      x3 = x3 * (1 + noise(ax4 * noiseFactor) - 0.5 * noiseScale);
      y3 = y3 * (1 + -noise(ay4 * noiseFactor) - 0.5 * noiseScale);
      console.log(1 + noise(ax1 * noiseFactor) - 0.5 * noiseScale);
      console.log(1 + noise(ax4 * noiseFactor) - 0.5 * noiseScale);
    }

    if (drawControlPoints) {
      strokeWeight(8);
      stroke("blue");
      point(ax1, ay1);
      point(ax4, ay4);
      stroke("red");
      point(x2, y2);
      point(x3, y3);
      stroke(0);
      strokeWeight(1);
    }

    bezier(ax1, ay1, x2, y2, x3, y3, ax4, ay4);
  }
}
