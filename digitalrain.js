import { Random } from "./libraries/random.js";

const RENDER_SVG = false;
const A_PAPER_SCALE = 1.414;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = Math.round(1000 * A_PAPER_SCALE);
const cols = 40; // Number of columns
const charSize = 20; // Size of each character
let streams = []; // Array to store the rain streams
let randomHash;

let svgPaths = []; // Array to store loaded SVG files
let parsedPaths = []; // Parsed path data from SVGs
const numChars = 17; // Number of SVG files (00.svg to 16.svg)

const sketch = (p) => {
  class MatrixStream {
    init(x, charSize, canvasHeight) {
      this.x = x; // X position of the stream
      this.y = p.random(-1000, 0); // Start offscreen
      this.speed = p.random(2, 5); // Random speed for the stream
      this.charSize = charSize; // Character size
      this.canvasHeight = canvasHeight; // Canvas height reference
      this.charCount = p.round(p.random(5, 15)); // Number of characters in this stream
      this.chars = []; // Array to store the characters

      // Generate the characters for this stream
      for (let i = 0; i < this.charCount; i++) {
        this.chars.push({
          charIndex: p.floor(p.random(parsedPaths.length)), // Randomly pick an SVG path index
          brightness: 255, // Brightness for fading effect
        });
      }
    }

    update() {
      this.y += this.speed;

      if (this.y > this.canvasHeight + this.charCount * this.charSize) {
        this.y = p.random(-1000, 0);
        this.speed = p.random(2, 5);
        this.charCount = p.round(p.random(5, 15));
        this.chars = [];
        for (let i = 0; i < this.charCount; i++) {
          this.chars.push({
            charIndex: p.floor(p.random(parsedPaths.length)),
            brightness: 255,
          });
        }
      }

      for (let char of this.chars) {
        char.brightness = Math.max(char.brightness - 5, 50);
      }
    }

    show() {
      for (let i = 0; i < this.charCount; i++) {
        const char = this.chars[i];
        const svgPathsForChar = parsedPaths[char.charIndex]; // All paths for this character
        const y = this.y - i * this.charSize;

        if (!svgPathsForChar || svgPathsForChar.length === 0) {
          console.warn("No paths to render for charIndex:", char.charIndex);
          continue; // Skip invalid paths
        }

        console.log(
          `Rendering charIndex ${char.charIndex} at x=${this.x}, y=${y}`
        );

        p.push();
        p.translate(this.x, y);
        p.scale(0.1); // Adjust scale to fit the character size

        for (let path of svgPathsForChar) {
          console.log(`Rendering path: ${path}`);
          p.beginShape();
          const commands = path.split(/(?=[MmLlHhVvCcSsQqTtAaZz])/); // Split SVG path commands
          for (let cmd of commands) {
            const type = cmd[0];
            const coords = cmd.slice(1).trim().split(/[, ]+/).map(Number);

            switch (type) {
              case "M": // Move to
                p.vertex(coords[0], coords[1]);
                break;
              case "L": // Line to
                p.vertex(coords[0], coords[1]);
                break;
              // Add more cases for other commands (C, Q, etc.) if needed
            }
          }
          p.endShape(p.CLOSE);
        }

        p.pop();
      }
    }
  }

  p.preload = () => {
    // Load all SVG files
    for (let i = 0; i < numChars; i++) {
      let filename = `matrixchars/${String(i).padStart(2, "0")}.svg`;
      svgPaths.push(p.loadXML(filename));
    }
  };

  const getAllPaths = (xml) => {
    const paths = [];
    const traverse = (node) => {
      if (node.getName() === "path") {
        const d = node.getString("d"); // Use getString to get the 'd' attribute
        if (d) paths.push(d);
      }
      const children = node.getChildren();
      if (children) {
        for (let child of children) {
          traverse(child);
        }
      }
    };
    traverse(xml);
    return paths;
  };

  p.setup = () => {
    // Create the canvas (or SVG if needed)
    if (RENDER_SVG) {
      p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, p.SVG);
    } else {
      p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Parse the SVG paths
    for (let svg of svgPaths) {
      const pathDataArray = getAllPaths(svg);
      if (pathDataArray.length > 0) {
        parsedPaths.push(pathDataArray);
      } else {
        console.warn("No valid paths found in SVG:", svg);
        parsedPaths.push([]);
      }
    }

    console.log("Parsed paths:", parsedPaths); // Debug parsed paths

    // Seed randomness
    randomHash = new Random();
    const seed = Math.round(randomHash.random_dec() * 1000000000);
    p.noiseSeed(seed);
    p.randomSeed(seed);

    p.textFont("monospace");
    p.textSize(charSize);

    // Initialize streams
    for (let i = 0; i < cols; i++) {
      const x = i * charSize;
      const stream = new MatrixStream();
      stream.init(x, charSize, CANVAS_HEIGHT);
      streams.push(stream);
    }

    // Disable looping (static image)
    p.noLoop();
  };

  p.draw = () => {
    // Set background for the static image
    p.background(255); // White background for Axidraw

    // Render all streams (characters)
    for (const stream of streams) {
      stream.show();
    }

    // Save the static image if using SVG
    if (RENDER_SVG) {
      p.save("out.svg"); // Save the file for Axidraw
    }
  };
};

new p5(sketch);
