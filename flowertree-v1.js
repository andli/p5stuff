let axiom = "X";
let sentence = axiom;
let rules = [];
let len = 100;
let angle = 22.5;
let generations = 5; // Number of generations to generate

rules[0] = {
  a: "F",
  b: "FF",
};

rules[1] = {
  a: "X",
  b: "FF-[[X]+X]+F[+FX]-X",
};

function generate() {
  len *= 0.5;
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
}

function turtle() {
  background(255);
  resetMatrix();
  translate(width / 2, height);
  stroke(0);

  for (let i = 0; i < sentence.length; i++) {
    let current = sentence.charAt(i);

    if (current == "F") {
      line(0, 0, 0, -len);
      translate(0, -len);
    } else if (current == "+") {
      rotate(-angle);
    } else if (current == "-") {
      rotate(angle);
    } else if (current == "[") {
      push();
    } else if (current == "]") {
      pop();
    }
  }
}

function setup() {
  createCanvas(600, 600);
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
