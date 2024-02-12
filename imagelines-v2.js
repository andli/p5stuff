const A3SCALE = 1.414;
const CANVAS_WIDTH = 3574 / 2;
const RENDER_SVG = false;
let randomHash;

function preload() {
  img = loadImage("test5.jpg"); // Use "test1.jpg"
}

// Add a function for linear interpolation (lerp)
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

function setup() {
  let params = getURLParams();
  if (params.hash != undefined) {
    randomHash = new Random(params.hash);
    randomizedHashString = params.hash;
  } else randomHash = new Random();
  seed = round(randomHash.random_dec() * 1000000000);
  noiseSeed(seed);
  randomSeed(seed);

  if (RENDER_SVG) {
    createCanvas(3574 / 2, 2176 / 2, SVG);
  } else {
    createCanvas(3574 / 2, 2176 / 2);
  }

  noLoop(); // The image is static, so no need to loop
  img.resize(width, height); // Resize the image to fit the canvas
  pixelDensity(1); // Ensure pixel density is consistent
}

function draw() {
  noLoop();
  stroke(0);
  background(255);
  strokeWeight(1);
  noFill();

  background(255);

  img.loadPixels();

  const maxLines = 190; // Maximum number of lines to draw
  const lineSpacing = height / maxLines; // Calculate the vertical spacing between lines

  // Modulation parameters
  const maxAmplitude = 6; // Adjusted maximum wave amplitude for clarity
  const maxFrequency = 0.5; // Maximum wave frequency
  const amplitudeThreshold = 230; // Lower threshold for the grayscale to affect amplitude
  const smoothFactor = 0.65; // Adjust this to control the smoothing effect

  let prevFrequency = 0; // Store the previous frequency
  // Draw modulated lines at intervals based on maxLines
  for (let line = 0; line < maxLines; line++) {
    let y = line * lineSpacing;

    beginShape();
    noFill();
    stroke(66); // Set line color to a dark gray
    for (let x = 0; x < width; x++) {
      // Calculate the corresponding y-coordinate in the image
      let imgY = floor(map(y, 0, height, 0, img.height));
      const i = (x + imgY * img.width) * 4;
      const grayscale =
        (img.pixels[i] + img.pixels[i + 1] + img.pixels[i + 2]) / 3;

      // Apply threshold to determine if amplitude should be adjusted
      let amplitude =
        grayscale > amplitudeThreshold
          ? 0
          : map(grayscale, 0, amplitudeThreshold, maxAmplitude, 0);

      // Calculate frequency with easing
      let rawFrequency = map(grayscale, 0, 255, 0, maxFrequency);
      let frequency = lerp(prevFrequency, rawFrequency, smoothFactor); // Apply easing
      prevFrequency = frequency; // Update previous frequency for the next iteration

      // Calculate sine wave
      let angle = x * frequency;
      let sinValue = sin(angle) * amplitude;

      vertex(x, y + sinValue);
    }
    endShape();
  }

  if (RENDER_SVG) {
    save("out.svg");
  }
}

class Random {
  constructor(hash) {
    let result = "0x";
    if (hash == undefined) {
      let chars = "0123456789abcdef";
      for (let i = 64; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
      print("random hash result: " + result);
    } else {
      result = hash;
    }
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
