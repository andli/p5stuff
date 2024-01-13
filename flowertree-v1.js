let axiom = "X";
let sentence = axiom;
let rules = [];
let len = 25;
let angle = 17;
let generations = 5;
let flowerTypeCounter = 0;

rules[0] = {
  a: "F",
  b: "FF",
};

rules[1] = {
  a: "X",
  b: "F+[X]-F[+FX]-[XF*]",
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
  len *= 0.8;
}

function drawPetal(petalLength, petalWidth, style) {
  // Drawing a petal with different styles
  beginShape();
  if (style === "pointy") {
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
    vertex(0, 0);
    bezierVertex(
      petalWidth,
      -petalLength / 3,
      petalWidth,
      (-3 * petalLength) / 3,
      0,
      -petalLength
    );
    bezierVertex(
      -petalWidth,
      (-3 * petalLength) / 3,
      -petalWidth,
      -petalLength / 3,
      0,
      0
    );
  }
  endShape();
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

function turtle() {
  background(255);
  resetMatrix();
  translate(width / 2, height);
  stroke(0);
  noFill();

  for (let i = 0; i < sentence.length; i++) {
    let current = sentence.charAt(i);
    flowerTypeCounter += 1;

    switch (current) {
      case "F":
        line(0, 0, 0, -len);
        translate(0, -len);
        break;
      case "+":
        rotate(-angle);
        break;
      case "-":
        rotate(angle);
        break;
      case "[":
        push();
        break;
      case "]":
        pop();
        break;
      case "*": // Flower symbol
        if (flowerTypeCounter % 3 == 0) {
          drawEpicycleFlower(0, 0, 5, 12, 6, "round");
        } else if (flowerTypeCounter % 1 == 0) {
          drawEpicycleFlower(0, 0, 5, 12, 6, "pointy");
        }

        break;
    }
  }
}

function setup() {
  createCanvas(800, 800);
  angle = radians(angle);
  background(255);
  for (let i = 0; i < generations; i++) {
    generate();
  }
  turtle();
}

function draw() {
  // No continuous drawing required
}
