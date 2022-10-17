let rows;
let cols;
let points;
let SUBDIVS;

function setup() {
  createCanvas(1000, 1414, SVG); // A3 paper size
  //randomSeed(99);

  COLS = 5;
  ROWS = 8;
  cellWidth = floor(width / COLS);
  cellHeight = floor(height / ROWS);

  wf = 2;
  wiggleFactorH = cellHeight / wf;
  wiggleFactorW = cellWidth / wf;
  SUBDIVS = 20;
  bFactor = 0.5;
  points = [];

  // main grid
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
          // only wiggle edge points along the Y edges
          points[x][y][1] += random(-wiggleFactorH, 0);
        }
      } else {
        points[x][y][0] += random(-wiggleFactorW, wiggleFactorW);
      }
      if (y == 0 || y == ROWS) {
        if (x != 0 && x != COLS) {
          // only wiggle edge points along the X edges
          points[x][y][0] += random(-wiggleFactorW, 0);
        }
      } else {
        points[x][y][1] += random(-wiggleFactorH, wiggleFactorH);
      }
    }
  }
}

function draw() {
  noLoop();
  background(255);
  stroke(0);
  strokeWeight(1.5);
  noFill();
  drawMainGrid();

  //save("mySVG.svg");

  function drawMainGrid() {
    for (let colNo = 0; colNo <= COLS; colNo++) {
      for (let rowNo = 0; rowNo <= ROWS; rowNo++) {
        cX = points[colNo][rowNo][0];
        cY = points[colNo][rowNo][1];
        // strokeWeight(10);
        // point(cX,cY);
        // strokeWeight(1);

        if (rowNo == 0) {
          beginShape();
          vertex(cX, cY);
        }
        if (rowNo < ROWS) {
          nextX = points[colNo][rowNo + 1][0];
          nextY = points[colNo][rowNo + 1][1];
          lastHeight = nextY - cY;
          //line(nextX, nextY, nextX, nextY);
          //bezierVertex(cx1, cy1, cx2, cy2, x, y)
          bezierVertex(
            cX,
            cY + bFactor * lastHeight,
            nextX,
            nextY - bFactor * lastHeight,
            nextX,
            nextY
          );
        }
        if (rowNo == ROWS) {
          endShape();
        }
      }
    }

    for (let rowNo = 0; rowNo <= ROWS; rowNo++) {
      for (let colNo = 0; colNo <= COLS; colNo++) {
        cX = points[colNo][rowNo][0];
        cY = points[colNo][rowNo][1];
        // strokeWeight(10);
        // point(cX,cY);
        // strokeWeight(1);

        if (colNo == 0) {
          beginShape();
          vertex(cX, cY);
        }
        if (colNo < COLS) {
          nextX = points[colNo + 1][rowNo][0];
          nextY = points[colNo + 1][rowNo][1];
          lastWidth = nextX - cX;
          //line(nextX, nextY, nextX, nextY);
          //bezierVertex(cx1, cy1, cx2, cy2, x, y)
          bezierVertex(
            cX + bFactor * lastWidth,
            cY,
            nextX - bFactor * lastWidth,
            nextY,
            nextX,
            nextY
          );
        }
        if (colNo == COLS) {
          endShape();
        }
      }
    }
  }
}
