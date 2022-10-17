let rows;
let cols;
let points;
let subdivs;

function setup() {
  let a3scalefactor = 1.414;
  let canvasWidth = 500;
  //createCanvas(1000, 1414, SVG); // A3 paper size
  createCanvas(canvasWidth, Math.round(canvasWidth * a3scalefactor)); // A3 paper size
  randomSeed(26);

  COLS = 5;
  ROWS = 6;
  wiggleDistance = 43;
  SUBDIVS = 32;

  cellWidth = floor(width / COLS);
  cellHeight = floor(height / ROWS);
  points = [];

  // main grid data
  for (let x = 0; x < COLS + 1; x++) {
    points[x] = [];
    for (let y = 0; y < ROWS + 1; y++) {
      points[x][y] = [cellWidth * x, cellHeight * y];
    }
  }

  // wiggle points
  for (let x = 0; x <= COLS; x++) {
    for (let y = 0; y <= ROWS; y++) {
      if (x == 0 || x == COLS) {
        if (y != 0 && y != ROWS) {
          // only wiggle edge points along the edge
          points[x][y][1] += random(-wiggleDistance, wiggleDistance);
        }
      } else {
        points[x][y][0] += random(-wiggleDistance, wiggleDistance);
      }
      if (y == 0 || y == ROWS) {
        if (x != 0 && x != COLS) {
          // only wiggle edge points along the edge
          points[x][y][0] += random(-wiggleDistance, wiggleDistance);
        }
      } else {
        points[x][y][1] += random(-wiggleDistance, wiggleDistance);
      }
    }
  }
}

function draw() {
  noLoop();
  background(255);
  stroke(0);
  strokeWeight(0.8);
  noFill();
  drawMainGrid();

  //save("out.svg");

  function drawMainGrid() {
    for (let colNo = 0; colNo <= COLS; colNo++) {
      for (let rowNo = 0; rowNo <= ROWS; rowNo++) {
        currentX = points[colNo][rowNo][0];
        currentY = points[colNo][rowNo][1];
        if (colNo < COLS) {
          line(
            currentX,
            currentY,
            points[colNo + 1][rowNo][0],
            points[colNo + 1][rowNo][1]
          );
        }

        if (rowNo < ROWS) {
          line(
            currentX,
            currentY,
            points[colNo][rowNo + 1][0],
            points[colNo][rowNo + 1][1]
          );
        }

        if (colNo > 0 && rowNo > 0) {
          drawColSubdivs(colNo, rowNo);
          drawRowSubdivs(colNo, rowNo);
        }
      }
    }
  }

  function drawColSubdivs(colNo, rowNo) {
    for (let subdiv = 1; subdiv < SUBDIVS; subdiv++) {
      lastX1 = points[colNo - 1][rowNo - 1][0];
      lastY1 = points[colNo - 1][rowNo - 1][1];
      lastX2 = points[colNo][rowNo - 1][0];
      lastY2 = points[colNo][rowNo - 1][1];
      deltaLastX = (lastX2 - lastX1) / SUBDIVS;
      deltaLastY = (lastY2 - lastY1) / SUBDIVS;

      currentX1 = points[colNo - 1][rowNo][0];
      currentY1 = points[colNo - 1][rowNo][1];
      currentX2 = points[colNo][rowNo][0];
      currentY2 = points[colNo][rowNo][1];
      deltaCurrentX = (currentX2 - currentX1) / SUBDIVS;
      deltaCurrentY = (currentY2 - currentY1) / SUBDIVS;

      line(
        lastX1 + deltaLastX * subdiv,
        lastY1 + deltaLastY * subdiv,
        currentX1 + deltaCurrentX * subdiv,
        currentY1 + deltaCurrentY * subdiv
      );
    }
  }

  function drawRowSubdivs(colNo, rowNo) {
    for (let subdiv = 1; subdiv < SUBDIVS; subdiv++) {
      lastX1 = points[colNo - 1][rowNo - 1][0];
      lastY1 = points[colNo - 1][rowNo - 1][1];
      lastX2 = points[colNo - 1][rowNo][0];
      lastY2 = points[colNo - 1][rowNo][1];
      deltaLastX = (lastX2 - lastX1) / SUBDIVS;
      deltaLastY = (lastY2 - lastY1) / SUBDIVS;

      currentX1 = points[colNo][rowNo - 1][0];
      currentY1 = points[colNo][rowNo - 1][1];
      currentX2 = points[colNo][rowNo][0];
      currentY2 = points[colNo][rowNo][1];
      deltaCurrentX = (currentX2 - currentX1) / SUBDIVS;
      deltaCurrentY = (currentY2 - currentY1) / SUBDIVS;

      line(
        lastX1 + deltaLastX * subdiv,
        lastY1 + deltaLastY * subdiv,
        currentX1 + deltaCurrentX * subdiv,
        currentY1 + deltaCurrentY * subdiv
      );
    }
  }
}
