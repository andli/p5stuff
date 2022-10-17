let rows;
let cols;
let margin;
let points;
let subdivs;

function setup() {
  createCanvas(1000, 1000, SVG);
  //createCanvas(1000, 1414, SVG);// A3 paper size

  randomSeed(37);

  COLS = 10;
  ROWS = 19;
  wiggleR = 23;
  wiggleT = 0.185;
  SUBDIVS = 10;
  innerMargin = 60;

  cellWidth = (0.48 * width - innerMargin) / COLS;
  cellHeight = (Math.PI * 2) / ROWS;
  totalHeight = cellHeight * ROWS;
  points = [];

  points = [];
  for (let c = 0; c < COLS + 1; c++) {
    points[c] = [];
    for (let r = 0; r < ROWS + 1; r++) {
      points[c][r] = [cellWidth * c + innerMargin, cellHeight * r];
    }
  }

  // wiggle points
  wiggle();

  function wiggle() {
    for (let c = 0; c <= COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        if (c == 0 || c == COLS) {
          points[c][r][1] += random(-wiggleT, wiggleT);
        } else {
          points[c][r][1] += random(-wiggleT, wiggleT);
          points[c][r][0] += random(-wiggleR, wiggleR);
        }
      }
      // marry the two "ends" of the matrix
      for (let x = 0; x <= COLS; x++) {
        points[x][ROWS][0] = points[x][0][0];
        points[x][ROWS][1] = points[x][0][1] + totalHeight;
      }
    }
  }
}

function draw() {
  noLoop();
  background(255);
  stroke(0);
  strokeWeight(1);
  noFill();
  translate(width / 2, height / 2);

  drawMainGrid();
  for (let colNo = 1; colNo <= COLS; colNo++) {
    for (let rowNo = 1; rowNo <= ROWS; rowNo++) {
      strokeWeight(1.0);
      drawColSubdivs(colNo, rowNo);
      drawRowSubdivs(colNo, rowNo);
    }
  }

  // save("out3.svg");

  function drawMainGrid() {
    for (let colNo = 0; colNo <= COLS; colNo++) {
      for (let rowNo = 0; rowNo <= ROWS - 1; rowNo++) {
        currentX = points[colNo][rowNo][0];
        currentY = points[colNo][rowNo][1];
        // strokeWeight(2.5);
        if (colNo < COLS) {
          plinei(
            currentX,
            currentY,
            points[colNo + 1][rowNo][0],
            points[colNo + 1][rowNo][1]
          );
        }
        if (rowNo < ROWS) {
          plinei(
            currentX,
            currentY,
            points[colNo][rowNo + 1][0],
            points[colNo][rowNo + 1][1]
          );
        }
      }
    }
  }

  function drawColSubdivs(colNo, rowNo) {
    for (let subdiv = 1; subdiv < SUBDIVS; subdiv++) {
      let lastX1 = points[colNo - 1][rowNo - 1][0];
      let lastY1 = points[colNo - 1][rowNo - 1][1];
      let lastX2 = points[colNo][rowNo - 1][0];
      let lastY2 = points[colNo][rowNo - 1][1];
      let deltaLastX = (lastX2 - lastX1) / SUBDIVS;
      let deltaLastY = (lastY2 - lastY1) / SUBDIVS;

      let currentX1 = points[colNo - 1][rowNo][0];
      let currentY1 = points[colNo - 1][rowNo][1];
      let currentX2 = points[colNo][rowNo][0];
      let currentY2 = points[colNo][rowNo][1];
      let deltaCurrentX = (currentX2 - currentX1) / SUBDIVS;
      let deltaCurrentY = (currentY2 - currentY1) / SUBDIVS;

      plinei(
        lastX1 + deltaLastX * subdiv,
        lastY1 + deltaLastY * subdiv,
        currentX1 + deltaCurrentX * subdiv,
        currentY1 + deltaCurrentY * subdiv
      );
    }
  }

  function drawRowSubdivs(colNo, rowNo) {
    for (let subdiv = 1; subdiv < SUBDIVS; subdiv++) {
      let lastX1 = points[colNo - 1][rowNo - 1][0];
      let lastY1 = points[colNo - 1][rowNo - 1][1];
      let lastX2 = points[colNo - 1][rowNo][0];
      let lastY2 = points[colNo - 1][rowNo][1];
      let deltaLastX = (lastX2 - lastX1) / SUBDIVS;
      let deltaLastY = (lastY2 - lastY1) / SUBDIVS;

      let currentX1 = points[colNo][rowNo - 1][0];
      let currentY1 = points[colNo][rowNo - 1][1];
      let currentX2 = points[colNo][rowNo][0];
      let currentY2 = points[colNo][rowNo][1];
      let deltaCurrentX = (currentX2 - currentX1) / SUBDIVS;
      let deltaCurrentY = (currentY2 - currentY1) / SUBDIVS;

      plinei(
        lastX1 + deltaLastX * subdiv,
        lastY1 + deltaLastY * subdiv,
        currentX1 + deltaCurrentX * subdiv,
        currentY1 + deltaCurrentY * subdiv
      );
    }
  }
}

function pline(r1, t1, r2, t2) {
  let c1 = polar2Cartesian(r1, t1);
  let c2 = polar2Cartesian(r2, t2);
  line(c1.x, c1.y, c2.x, c2.y);
}

function plinei(r1, t1, r2, t2) {
  let linePoints = [];

  for (let i = 0; i <= SUBDIVS; i++) {
    let interpolationAmount = map(i, 0, SUBDIVS, 0.0, 1.0);
    // calculate interpolated position
    let interpolated = polar2Cartesian(
      lerp(r1, r2, interpolationAmount),
      lerp(t1, t2, interpolationAmount)
    );
    linePoints.push(interpolated);
  }

  for (let p = 0; p < linePoints.length - 1; p++) {
    // strokeWeight(7);
    // point(linePoints[p].x,linePoints[p].y)
    // strokeWeight(1);
    line(
      linePoints[p].x,
      linePoints[p].y,
      linePoints[p + 1].x,
      linePoints[p + 1].y
    );
  }
}

function polar2Cartesian(r, theta) {
  let x = r * cos(theta);
  let y = r * sin(theta);
  let cart = { x: x, y: y };
  return cart;
}

function cartesian2Polar(x, y) {
  var distance = Math.sqrt(x * x + y * y);
  var radians = Math.atan2(y, x); // Note: Takes y first
  var polarCoor = { distance: distance, radians: radians };
  return polarCoor;
}
