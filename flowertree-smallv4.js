const A3SCALE = 1.414;
const CANVAS_WIDTH = 400;
const RENDER_SVG = false;

let axiom = "X";
let sentence = axiom;
let rules = [];

rules[0] = {
  a: "F",
  b: "FF",
};

let len = 30;
let angle = 25;
let generations = 6;
rules[1] = {
  a: "X",
  b: "F-[X]+FL[F-XF*]+[X]", //smallsize
  // b: "F+[XF]-F[F+XF*]-[X]", //original
};

function generate() {
  let nextSentence = "";
  for (let i = 0; i < sentence.length; i++) {
    let current = sentence.charAt(i);
    let found = false;
    for (let j = 0; j < rules.length; j++) {
      if (current == rules[j].a) {
        found = true;
        nextSentence += rules[j].b;
        break;
      }
    }
    if (!found) {
      nextSentence += current;
    }
  }
  sentence = nextSentence;
  len *= 0.68;
}
function drawEpicycleFlower(x, y, numPetals, petalLength, petalWidth, style) {
  push();
  translate(x, y);
  rotate(PI / 2); // Adjust orientation of first petal

  for (let i = 0; i < numPetals; i++) {
    drawPetal(petalLength, petalWidth, style);
    rotate(TWO_PI / numPetals);
  }
  pop();
}

function drawPetal(petalLength, petalWidth, style) {
  // Drawing a petal with different styles
  beginShape();
  if (style === "pointy") {
    stroke("violet");
    vertex(0, 0);
    bezierVertex(
      petalWidth / 2,
      -petalLength / 3,
      petalWidth / 2,
      (-2 * petalLength) / 3,
      0,
      -petalLength
    );
    bezierVertex(
      -petalWidth / 2,
      (-2 * petalLength) / 3,
      -petalWidth / 2,
      -petalLength / 3,
      0,
      0
    );
  } else {
    // Default style: 'round'
    stroke("teal");
    vertex(0, 0);
    bezierVertex(
      petalWidth,
      -petalLength / 2,
      petalWidth,
      (-2 * petalLength) / 2,
      0,
      -petalLength
    );
    bezierVertex(
      -petalWidth,
      (-2 * petalLength) / 2,
      -petalWidth,
      -petalLength / 2,
      0,
      0
    );
  }
  endShape();
  stroke(0);
}

function drawEpicycleLeaf(x, y, leafLength, leafWidth, branchAngle) {
  // Adjust the range of random variation to avoid unnatural angles
  let leafAngle = branchAngle - radians(90);

  push();
  translate(x, y);
  rotate(leafAngle);
  // Drawing the leaf
  beginShape();
  // Define the leaf shape using vertices or bezierVertex
  stroke("green");
  vertex(0, 0);
  bezierVertex(
    leafWidth / 2,
    -leafLength / 3,
    leafWidth / 2,
    (-2 * leafLength) / 3,
    0,
    -leafLength
  );
  bezierVertex(
    -leafWidth / 2,
    (-2 * leafLength) / 3,
    -leafWidth / 2,
    -leafLength / 3,
    0,
    0
  );
  endShape();

  // Drawing the midrib of the leaf
  line(0, 0, 0, (-2 * leafLength) / 3); // Draw a line from the base to 2/3 of the leaf length

  pop();
  stroke(0); // Set the color of the midrib
}

function turtle() {
  background(255);
  resetMatrix();
  translate(width / 2, height);
  stroke(0);
  noFill();

  let currentBranchAngle = 0;
  let flowerTypeCounter = 1;
  for (let i = 0; i < sentence.length; i++) {
    let current = sentence.charAt(i);
    switch (current) {
      case "F":
        line(0, 0, 0, -len);
        translate(0, -len);
        break;
      case "+":
        currentBranchAngle -= angle;
        rotate(-angle);
        break;
      case "-":
        currentBranchAngle += angle;
        rotate(angle);
        break;
      case "[":
        push();
        break;
      case "]":
        pop();
        break;
      case "*": // Flower symbol
        if (flowerTypeCounter % 7 == 0) {
          drawEpicycleFlower(0, 0, 5, 12, 5, "round");
        } else if (flowerTypeCounter % 5 == 0) {
          drawEpicycleFlower(0, 0, 5, 12, 6, "pointy");
        } else if (flowerTypeCounter % 3 == 0) {
          drawEpicycleLeaf(0, 0, 18, 10, currentBranchAngle);
        }

        break;
    }
    flowerTypeCounter += 1;
  }
}

function setup() {
  if (RENDER_SVG) {
    createCanvas(CANVAS_WIDTH, Math.round(CANVAS_WIDTH * A3SCALE), SVG);
  } else {
    createCanvas(CANVAS_WIDTH, Math.round(CANVAS_WIDTH * A3SCALE));
  }

  angle = radians(angle);
  background(255);
  for (let i = 0; i < generations; i++) {
    generate();
  }
  turtle();

  if (RENDER_SVG) {
    save("out.svg");
  }
}

function draw() {
  // No continuous drawing required
}
