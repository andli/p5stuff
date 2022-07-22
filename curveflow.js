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
    var x1 = width * noise(t + 1);
    var x2 = width * noise(t + 2);
    var x3 = width * noise(t + 3);
    var x4 = width * noise(t + 4);
    var y1 = height * noise(t + 5);
    var y2 = height * noise(t + 6);
    var y3 = height * noise(t + 7);
    var y4 = height * noise(t + 8);

    bezier(x1, y1, x2, y2, x3, y3, x4, y4);

    t += 0.007;
  }
  // clear the background every 500 frames using mod (%) operator
  if (frameCount % 500 == 0) {
    background(255);
  }
}
