let rows;
let cols;
let points;
let subdivs;

function setup() {
  let params = getURLParams();
  if (params.hash != undefined) {
    randomHash = new Random(params.hash);
    randomizedHashString = params.hash;
  } else randomHash = new Random();
  seed = round(randomHash.random_dec() * 1000000000);
  noiseSeed(seed);
  randomSeed(seed);

  let a3scalefactor = 1.414;
  let canvasWidth = 500;
  //createCanvas(1000, 1414, SVG); // A3 paper size
  createCanvas(canvasWidth, Math.round(canvasWidth * a3scalefactor)); // A3 paper size

  cols = 5;
  rows = 6;
  wiggleDistance = 43;
  subdivs = 32;

  cellWidth = floor(width / cols);
  cellHeight = floor(height / rows);
  points = [];

  // main grid data
  for (let x = 0; x < cols + 1; x++) {
    points[x] = [];
    for (let y = 0; y < rows + 1; y++) {
      points[x][y] = [cellWidth * x, cellHeight * y];
    }
  }

  // wiggle points
  for (let x = 0; x <= cols; x++) {
    for (let y = 0; y <= rows; y++) {
      if (x == 0 || x == cols) {
        if (y != 0 && y != rows) {
          // only wiggle edge points along the edge
          points[x][y][1] += random(-wiggleDistance, wiggleDistance);
        }
      } else {
        points[x][y][0] += random(-wiggleDistance, wiggleDistance);
      }
      if (y == 0 || y == rows) {
        if (x != 0 && x != cols) {
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
    for (let colNo = 0; colNo <= cols; colNo++) {
      for (let rowNo = 0; rowNo <= rows; rowNo++) {
        currentX = points[colNo][rowNo][0];
        currentY = points[colNo][rowNo][1];
        if (colNo < cols) {
          line(
            currentX,
            currentY,
            points[colNo + 1][rowNo][0],
            points[colNo + 1][rowNo][1]
          );
        }

        if (rowNo < rows) {
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
    for (let subdiv = 1; subdiv < subdivs; subdiv++) {
      lastX1 = points[colNo - 1][rowNo - 1][0];
      lastY1 = points[colNo - 1][rowNo - 1][1];
      lastX2 = points[colNo][rowNo - 1][0];
      lastY2 = points[colNo][rowNo - 1][1];
      deltaLastX = (lastX2 - lastX1) / subdivs;
      deltaLastY = (lastY2 - lastY1) / subdivs;

      currentX1 = points[colNo - 1][rowNo][0];
      currentY1 = points[colNo - 1][rowNo][1];
      currentX2 = points[colNo][rowNo][0];
      currentY2 = points[colNo][rowNo][1];
      deltaCurrentX = (currentX2 - currentX1) / subdivs;
      deltaCurrentY = (currentY2 - currentY1) / subdivs;

      line(
        lastX1 + deltaLastX * subdiv,
        lastY1 + deltaLastY * subdiv,
        currentX1 + deltaCurrentX * subdiv,
        currentY1 + deltaCurrentY * subdiv
      );
    }
  }

  function drawRowSubdivs(colNo, rowNo) {
    for (let subdiv = 1; subdiv < subdivs; subdiv++) {
      lastX1 = points[colNo - 1][rowNo - 1][0];
      lastY1 = points[colNo - 1][rowNo - 1][1];
      lastX2 = points[colNo - 1][rowNo][0];
      lastY2 = points[colNo - 1][rowNo][1];
      deltaLastX = (lastX2 - lastX1) / subdivs;
      deltaLastY = (lastY2 - lastY1) / subdivs;

      currentX1 = points[colNo][rowNo - 1][0];
      currentY1 = points[colNo][rowNo - 1][1];
      currentX2 = points[colNo][rowNo][0];
      currentY2 = points[colNo][rowNo][1];
      deltaCurrentX = (currentX2 - currentX1) / subdivs;
      deltaCurrentY = (currentY2 - currentY1) / subdivs;

      line(
        lastX1 + deltaLastX * subdiv,
        lastY1 + deltaLastY * subdiv,
        currentX1 + deltaCurrentX * subdiv,
        currentY1 + deltaCurrentY * subdiv
      );
    }
  }
}

class Random {
  constructor() {
    let chars = "0123456789abcdef";
    let result = "0x";
    for (let i = 64; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    print("random hash result: " + result);

    this.seed = parseInt(result.slice(0, 16), 16);
  }
  random_dec() {
    this.seed ^= this.seed << 13;
    this.seed ^= this.seed >> 17;
    this.seed ^= this.seed << 5;
    return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000;
  }
  random_between(a, b) {
    return a + (b - a) * this.random_dec();
  }
  random_int(a, b) {
    return Math.floor(this.random_between(a, b + 1));
  }
  random_choice(x) {
    return x[Math.floor(this.random_between(0, x.length * 0.99))];
  }
}
