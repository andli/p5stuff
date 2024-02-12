let img; // Variable to store the image

function preload() {
  img = loadImage("test5.jpg"); // Use "test1.jpg"
}

function setup() {
  createCanvas(3574 / 2, 2176 / 2);
  noLoop(); // The image is static, so no need to loop
  img.resize(width, height); // Resize the image to fit the canvas
  pixelDensity(1); // Ensure pixel density is consistent
}

function draw() {
  background(255);

  img.loadPixels();

  const maxLines = 190; // Maximum number of lines to draw
  const lineSpacing = height / maxLines; // Calculate the vertical spacing between lines

  // Modulation parameters
  const maxAmplitude = 8; // Adjusted maximum wave amplitude for clarity
  const maxFrequency = 0.5; // Maximum wave frequency
  const amplitudeThreshold = 220; // Lower threshold for the grayscale to affect amplitude

  // Draw modulated lines at intervals based on maxLines
  for (let line = 0; line < maxLines; line++) {
    let y = line * lineSpacing;

    beginShape();
    noFill();
    stroke(66); // Set line color to black
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
      let frequency = map(grayscale, 0, 255, 0, maxFrequency);

      // Calculate sine wave
      let angle = x * frequency;
      let sinValue = sin(angle) * amplitude;

      vertex(x, y + sinValue);
    }
    endShape();
  }
}
