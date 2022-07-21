// https://genekogan.com/code/p5js-perlin-noise/

var t;

function setup() {
  createCanvas(1000, 1000);
  stroke(0);
  noFill();
  t = 0;
}

function draw() {
  noLoop();
  background(255);
  for (let i = 0; i < 200; i++) {
    var x1 = width * noise(t + 15);
    var x2 = width * noise(t + 25);
    var x3 = width * noise(t + 35);
    var x4 = width * noise(t + 45);
    var y1 = height * noise(t + 55);
    var y2 = height * noise(t + 65);
    var y3 = height * noise(t + 75);
    var y4 = height * noise(t + 85);

    bezier(x1, y1, x2, y2, x3, y3, x4, y4);

    t += 0.005;
  }
  // clear the background every 500 frames using mod (%) operator
  if (frameCount % 500 == 0) {
    background(255);
  }
}
