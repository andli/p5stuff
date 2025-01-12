const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 200; // Adjust based on character size and padding
const CHAR_HEIGHT = 100; // Desired character height in pixels
const NUM_CHARS = 16; // Number of SVG files (00.svg to 16.svg)
const SCALE_FACTOR = 1; // Fixed scale factor for all characters

let svgPaths = []; // To store loaded SVG files
let parsedPaths = []; // To store parsed path data

const sketch = (p) => {
  // Preload SVG files
  p.preload = () => {
    for (let i = 0; i < NUM_CHARS; i++) {
      const filename = `matrixchars/${String(i).padStart(2, "0")}.svg`;
      svgPaths.push(p.loadXML(filename));
    }
  };

  // Extract all paths from the loaded SVG
  const getAllPaths = (xml) => {
    const paths = [];
    const traverse = (node) => {
      if (node.getName() === "path") {
        const d = node.getString("d");
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

  // Convert relative SVG path commands to absolute commands
  const convertRelativeToAbsolute = (path) => {
    const commands = path.split(/(?=[MmLlHhVvCcSsQqTtAaZz])/); // Split path commands
    let currentX = 0;
    let currentY = 0;
    let convertedPath = "";

    for (let cmd of commands) {
      const type = cmd[0];
      const coords = cmd.slice(1).trim().split(/[, ]+/).map(Number);

      if (type === "m" || type === "M") {
        currentX += coords[0];
        currentY += coords[1];
        convertedPath += `M ${currentX} ${currentY} `;
      } else if (type === "l" || type === "L") {
        currentX += coords[0];
        currentY += coords[1];
        convertedPath += `L ${currentX} ${currentY} `;
      } else if (type === "c" || type === "C") {
        const [x1, y1, x2, y2, x, y] = coords;
        const absCoords = [
          currentX + x1,
          currentY + y1,
          currentX + x2,
          currentY + y2,
          currentX + x,
          currentY + y,
        ];
        currentX += x;
        currentY += y;
        convertedPath += `C ${absCoords.join(" ")} `;
      }
    }

    return convertedPath.trim();
  };

  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.noLoop(); // Static rendering

    // Parse SVG paths
    for (let svg of svgPaths) {
      const pathData = getAllPaths(svg);
      parsedPaths.push(pathData);
    }

    console.log("Parsed paths:", parsedPaths); // Debug parsed paths
  };

  p.draw = () => {
    p.background(121); // White background
    p.noFill();
    p.stroke(0); // Black stroke
    p.strokeWeight(1);

    const spacing = 10; // Space for each character
    for (let i = 0; i < NUM_CHARS; i++) {
      const x = spacing * i + spacing / 2; // Center each character in its space
      const y = CANVAS_HEIGHT / 2; // Center vertically

      const charPaths = parsedPaths[i];
      if (!charPaths || charPaths.length === 0) {
        console.warn(`No paths for character ${i}`);
        continue;
      }

      console.log(`Rendering character ${i} at x=${x}, y=${y}`);

      p.push();
      p.translate(x, y); // Position the character
      p.scale(SCALE_FACTOR); // Apply fixed scale to all characters

      for (let path of charPaths) {
        const absolutePath = convertRelativeToAbsolute(path); // Convert path to absolute
        console.log(`Rendering path: ${absolutePath}`);
        p.beginShape();
        const commands = absolutePath.split(/(?=[MmLlHhVvCcSsQqTtAaZz])/);
        for (let cmd of commands) {
          const type = cmd[0];
          const coords = cmd.slice(1).trim().split(/[, ]+/).map(Number);

          switch (type) {
            case "M":
              p.vertex(coords[0], coords[1]);
              break;
            case "L":
              p.vertex(coords[0], coords[1]);
              break;
            case "C":
              p.bezierVertex(
                coords[0],
                coords[1],
                coords[2],
                coords[3],
                coords[4],
                coords[5]
              );
              break;
            case "Q": // Quadratic Bézier curve
              p.quadraticVertex(coords[0], coords[1], coords[2], coords[3]);
              break;
            case "Z": // Close path
              p.endShape(p.CLOSE);
              break;
          }
        }
        p.endShape();
      }

      p.pop();
    }
  };
};

new p5(sketch);
