const a3scalefactor = 1.414;
const RENDER_SVG = true;
let circles;
let margin;
let randomHash;

const NUM_CIRCLES = 850;
const CIRCLE_MARGIN = 3;
const CIRCLE_MIN_RADIUS = 3;
const CIRCLE_MAX_RADIUS = 25;
const CIRCLE_FIRST_RADIUS = 92;
const CIRCLE_FILTER_RADIUS = 5;

function setup() {
  let params = getURLParams();
  if (params.hash != undefined) {
    randomHash = new Random(params.hash);
    randomizedHashString = params.hash;
  } else randomHash = new Random();
  seed = round(randomHash.random_dec() * 1000000000);
  noiseSeed(seed);
  randomSeed(seed);

  let canvasWidth = 1000;
  if (RENDER_SVG) {
    createCanvas(1000, 1414, SVG);
  } else {
    createCanvas(canvasWidth, Math.round(canvasWidth * a3scalefactor));
  }

  // --- setup begins here ---
  let radius = CIRCLE_FIRST_RADIUS;
  circles = [[width / 2, height / 2, 2 * radius]];
}

function draw() {
  noLoop();
  stroke(255);
  background(0);
  strokeWeight(2);
  noFill();

  // --- drawing logic here ---

  for (let i = 0; i < NUM_CIRCLES; i++) {
    // place circles until full around one circle
    while (placeCircleAroundCircle(circles[i], circles, i / NUM_CIRCLES)) {}
  }

  // draw all circles
  for (let i = 0; i < circles.length; i++) {
    if (circles[i][2] < CIRCLE_MAX_RADIUS - CIRCLE_FILTER_RADIUS) {
      circle(...circles[i]);
    }
  }

  if (RENDER_SVG) {
    save("hedblom.svg");
  }

  function createRelativeCircle(originCircle, angle, progressValue) {
    if (angle == undefined) {
      angle = random(360);
    }
    if (progressValue == undefined || progressValue == 0) {
      progressValue = 1;
    }
    let adjustedMaxRadius =
      CIRCLE_MAX_RADIUS * (progressValue + CIRCLE_MIN_RADIUS);
    let r = random(CIRCLE_MIN_RADIUS, adjustedMaxRadius);
    let distance = originCircle[2] / 2 + CIRCLE_MARGIN + r;
    let x = Math.round(originCircle[0] + distance * Math.cos(angle));
    let y = Math.round(originCircle[1] + distance * Math.sin(angle));
    return [x, y, r];
  }

  function placeCircleAroundCircle(originCircle, circles_array, progressValue) {
    let angle = random(360);
    let c_tmp = createRelativeCircle(originCircle, angle, progressValue);

    for (let a = angle; a < angle + 360; a++) {
      c_tmp = createRelativeCircle(originCircle, a, progressValue);
      if (circleWithinRect(c_tmp, [0, 0, width, height])) {
        if (!circles_array.some((m) => circlesOverlap(m, c_tmp))) {
          circles_array.push(c_tmp);
          return true;
        }
      }
    }
    // print(circles_array.length);
  }

  function circlesOverlap(c1, c2) {
    let x1 = c1[0];
    let x2 = c2[0];
    let y1 = c1[1];
    let y2 = c2[1];
    let r1 = c1[2];
    let r2 = c2[2];

    return Math.hypot(x1 - x2, y1 - y2) <= r1 / 2 + r2 / 2 + CIRCLE_MARGIN;
  }

  function circleWithinRect(c1, r1) {
    xLeft = c1[0] - c1[2];
    xRight = c1[0] + c1[2];
    yTop = c1[1] - c1[2];
    yBottom = c1[1] + c1[2];
    rLeft = r1[0];
    rTop = r1[1];
    rWidth = r1[2];
    rHeight = r1[3];

    return xLeft > rLeft && xRight < rWidth && yTop > rTop && yBottom < rHeight;
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
