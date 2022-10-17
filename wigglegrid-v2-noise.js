const a3scalefactor = 1.414;
const RENDER_SVG = false;
let randomHash;
let rows;
let cols;
let points;
let subdivs;

function setup() {
  let params = getURLParams();
  if (params.hash != undefined) {
    print(params.hash);
    randomHash = new Random(params.hash);
    randomizedHashString = params.hash;
  } else randomHash = new Random();
  seed = round(randomHash.random_dec() * 1000000000);
  noiseSeed(seed);
  randomSeed(seed);

  let canvasWidth = 1000;
  if (RENDER_SVG) {
    createCanvas(canvasWidth, Math.round(canvasWidth * a3scalefactor), SVG);
  } else {
    createCanvas(canvasWidth, Math.round(canvasWidth * a3scalefactor));
  }

  MARGIN = 40;
  COLS = 11;
  ROWS = 17;
  WIGGLEDISTANCE = 43;
  SUBDIVS = 26;
  FLATTEN_EDGES = false;

  cellWidth = floor((width - 2 * MARGIN) / COLS);
  cellHeight = floor((height - 2 * MARGIN) / ROWS);
  points = [];

  // main grid data
  for (let x = 0; x < COLS + 1; x++) {
    points[x] = [];
    for (let y = 0; y < ROWS + 1; y++) {
      points[x][y] = [MARGIN + cellWidth * x, MARGIN + cellHeight * y];
    }
  }

  // wiggle points
  for (let x = 0; x <= COLS; x++) {
    for (let y = 0; y <= ROWS; y++) {
      if (!FLATTEN_EDGES) {
        points[x][y][0] +=
          (noise(points[x][y][0], points[x][y][1]) - 0.5) * 100;
        points[x][y][1] +=
          (noise(points[x][y][0], points[x][y][1]) - 0.5) * 100;
      } else {
        if (x == 0 || x == COLS) {
          if (y != 0 && y != ROWS) {
            // only wiggle edge points along the edge
            points[x][y][1] += randomHash.random_between(
              -WIGGLEDISTANCE,
              WIGGLEDISTANCE
            );
          }
        } else {
          points[x][y][0] += randomHash.random_between(
            -WIGGLEDISTANCE,
            WIGGLEDISTANCE
          );
        }
        if (y == 0 || y == ROWS) {
          if (x != 0 && x != COLS && FLATTEN_EDGES) {
            // only wiggle edge points along the edge
            points[x][y][0] += randomHash.random_between(
              -WIGGLEDISTANCE,
              WIGGLEDISTANCE
            );
          }
        } else {
          points[x][y][1] += randomHash.random_between(
            -WIGGLEDISTANCE,
            WIGGLEDISTANCE
          );
        }
      }
    }
  }
}

function draw() {
  noLoop();
  background(255);
  stroke(0);
  strokeWeight(1.2);
  noFill();
  drawMainGrid();

  if (RENDER_SVG) {
    save("out.svg");
  }

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

class Random {
  constructor(hash) {
    if (hash == undefined) {
      let chars = "0123456789abcdef";
      let result = "0x";
      for (let i = 64; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
      print("random hash result: " + result);

      this.seed = parseInt(result.slice(0, 16), 16);
    } else {
      this.seed = parseInt(hash.slice(0, 16), 16);
    }
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
