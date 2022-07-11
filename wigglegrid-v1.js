let rows;
let cols;
let points;
let subdivs;

function setup() {
	createCanvas(1000, 1414, SVG); // A3 paper size
	randomSeed(15);

	cols = 7;
	rows = 10;
	wiggleFactor = 45;
	subdivs = 25;

	cellWidth = floor(width/cols);
	cellHeight = floor(height/rows);
	points = [];

    // main grid
	for (let x = 0; x < cols + 1; x++) {
		points[x] = [];
		for (let y = 0; y < rows + 1; y++) {
			points[x][y] = [cellWidth*x, cellHeight*y];
		}
	}

	// wiggle points
	for (let x = 0; x <= cols; x++) {
		for (let y = 0; y <= rows; y++) {
			if (x == 0 || x == cols) {
				if (y != 0 && y != rows) {
					// only wiggle edge points along the edge
					points[x][y][1] += random(-wiggleFactor,wiggleFactor);
			}}
			else {
				points[x][y][0] += random(-wiggleFactor,wiggleFactor);
			}
			if (y == 0 || y == rows) {
				if( x != 0 && x != cols) {
          // only wiggle edge points along the edge
					points[x][y][0] += random(-wiggleFactor,wiggleFactor);
			}}
			else {
				points[x][y][1] += random(-wiggleFactor,wiggleFactor);
			}
		}
	}
}

function draw() {
	noLoop();
	background(255);
	stroke(0);
	strokeWeight(.8);
	
	drawMainGrid();

	//save("mySVG.svg");

	function drawMainGrid() {
		for (let colNo = 0; colNo <= cols; colNo++) {
			for (let rowNo = 0; rowNo <= rows; rowNo++) {
				currentX = points[colNo][rowNo][0];
				currentY = points[colNo][rowNo][1];
				if (colNo < cols) {
					line(currentX, currentY, points[colNo + 1][rowNo][0], points[colNo + 1][rowNo][1]);
				}

				if (rowNo < rows) {
					line(currentX, currentY, points[colNo][rowNo + 1][0], points[colNo][rowNo + 1][1]);
				}

				if (colNo > 0 && rowNo > 0) {
					drawColSubdivs(colNo, rowNo);
					drawRowSubdivs(colNo, rowNo);
				}


			}
		}
	}

	function drawColSubdivs(colNo, rowNo) {
		for (let subdiv = 1; subdiv < subdivs; subdiv++) {
			lastX1 = points[colNo - 1][rowNo - 1][0];
			lastY1 = points[colNo - 1][rowNo - 1][1];
			lastX2 = points[colNo][rowNo - 1][0];
			lastY2 = points[colNo][rowNo - 1][1];
			deltaLastX = (lastX2 - lastX1) / subdivs;
			deltaLastY = (lastY2 - lastY1) / subdivs;

			currentX1 = points[colNo - 1][rowNo][0];
			currentY1 = points[colNo - 1][rowNo][1];
			currentX2 = points[colNo][rowNo][0];
			currentY2 = points[colNo][rowNo][1];
			deltaCurrentX = (currentX2 - currentX1) / subdivs;
			deltaCurrentY = (currentY2 - currentY1) / subdivs;

			line(lastX1 + deltaLastX * subdiv,
				lastY1 + deltaLastY * subdiv,
				currentX1 + deltaCurrentX * subdiv,
				currentY1 + deltaCurrentY * subdiv);
		}
	}

	function drawRowSubdivs(colNo, rowNo) {
		for (let subdiv = 1; subdiv < subdivs; subdiv++) {
			lastX1 = points[colNo - 1][rowNo - 1][0];
			lastY1 = points[colNo - 1][rowNo - 1][1];
			lastX2 = points[colNo - 1][rowNo][0];
			lastY2 = points[colNo - 1][rowNo][1];
			deltaLastX = (lastX2 - lastX1) / subdivs;
			deltaLastY = (lastY2 - lastY1) / subdivs;

			currentX1 = points[colNo][rowNo - 1][0];
			currentY1 = points[colNo][rowNo - 1][1];
			currentX2 = points[colNo][rowNo][0];
			currentY2 = points[colNo][rowNo][1];
			deltaCurrentX = (currentX2 - currentX1) / subdivs;
			deltaCurrentY = (currentY2 - currentY1) / subdivs;

			line(lastX1 + deltaLastX * subdiv,
				lastY1 + deltaLastY * subdiv,
				currentX1 + deltaCurrentX * subdiv,
				currentY1 + deltaCurrentY * subdiv);

		}
	}
}