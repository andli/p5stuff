const RENDER_SVG = false;
const A_PAPER_SCALE = 1.414;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = Math.round(1000 * A_PAPER_SCALE);
const NUM_CHARS = 1; // Total number of files to load (from 00 to 15)

let svgPaths = []; // To store parsed SVG path commands

async function localSetup() {
  const loadPromises = [];
  for (let i = 0; i < NUM_CHARS; i++) {
    const filename = `matrixchars/${String(i).padStart(2, "0")}.svg`;
    loadPromises.push(loadSVG(filename));
  }

  // Wait for all SVG files to be loaded
  svgPaths = await Promise.all(loadPromises);
  console.log("SVG files loaded:", svgPaths);
}

function localDraw() {
  if (svgPaths.length > 0) {
    translate(50, 50); // Starting offset
    for (let i = 0; i < svgPaths.length; i++) {
      push();
      translate((i % 10) * 100, Math.floor(i / 10) * 100); // Grid spacing
      drawPath(svgPaths[i]); // Draw each path
      pop();
    }
  }
}

function setup() {
  let params = getURLParams();

  if (RENDER_SVG) {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, SVG);
  } else {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  // Ensure setup waits for SVG loading
  localSetup().then(() => {
    redraw(); // Redraw once SVGs are loaded
  });
}

function draw() {
  noLoop();
  stroke(0);
  background(255);
  strokeWeight(1);
  noFill();

  localDraw();

  if (RENDER_SVG) {
    save("out.svg");
  }
}

// Function to load SVG and extract <path> 'd' attributes
async function loadSVG(filePath) {
  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Failed to fetch SVG file: ${filePath}`);
    }

    const svgText = await response.text();

    // Extract <path> elements with a valid `d` attribute
    const pathRegex = /<path[^>]*\sd="([^"]*)"/g;
    const paths = [];
    let match;
    while ((match = pathRegex.exec(svgText)) !== null) {
      const dAttribute = match[1]; // Extract the `d` attribute value

      console.log("Extracted `d` attribute:", dAttribute);

      // Validate `d` attribute
      if (
        !dAttribute ||
        dAttribute.trim() === "" ||
        !/^[a-zA-Z]/.test(dAttribute)
      ) {
        console.warn("Invalid or unsupported `d` attribute:", dAttribute);
        continue; // Skip this path
      }

      // Parse and convert to absolute commands
      let commands;
      try {
        commands = svgPathParser.makeAbsolute(
          svgPathParser.parseSVG(dAttribute)
        );
        console.log("Parsed commands:", commands);
      } catch (err) {
        console.error("Error parsing `d` attribute:", dAttribute, err);
        continue; // Skip this path if parsing fails
      }

      paths.push(commands); // Add parsed commands to the array
    }

    if (!paths.length) {
      throw new Error(`No valid <path> elements found in file: ${filePath}`);
    }

    return paths;
  } catch (error) {
    console.error(`Error in loadSVG: ${error.message}`);
    return []; // Return empty array for failed SVGs
  }
}

// Function to draw parsed SVG path commands
function drawPath(paths) {
  const scaleFactor = 100; // Adjust for canvas scaling

  paths.forEach((commands) => {
    beginShape();
    commands.forEach((cmd) => {
      if (cmd.command === "M" || cmd.command === "L") {
        vertex(cmd.x * scaleFactor, cmd.y * scaleFactor);
      } else if (cmd.command === "C") {
        bezierVertex(
          cmd.x1 * scaleFactor,
          cmd.y1 * scaleFactor,
          cmd.x2 * scaleFactor,
          cmd.y2 * scaleFactor,
          cmd.x * scaleFactor,
          cmd.y * scaleFactor
        );
      } else if (cmd.command === "Z") {
        endShape(CLOSE);
      }
    });
    endShape();
  });
}
