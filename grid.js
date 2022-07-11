let rows;
let cols;
let margin;
let points;
let subdivs;

function setup() {
	createCanvas(500, 707); // A3 paper size
	randomSeed(13);

	cols = 5;
	rows = 8;
	margin = 5;
	wiggleFactor = 20;
	subdivs = 4;
	cellWidth = floor(width/cols - margin);
	
	cellHeight = floor(height/rows - margin);
	points = [];
	for (let x = 0; x < cols + 1; x++) {
		points[x] = [];
		for (let y = 0; y < rows + 1; y++) {
			points[x][y] = [cellWidth*x, cellHeight*y];
		}
	}

	// wiggle points
	for (let x = 1; x < cols; x++) {
		for (let y = 1; y < rows; y++) {
			points[x][y][0] += random(-wiggleFactor,wiggleFactor);
			points[x][y][1] += random(-wiggleFactor,wiggleFactor);
		}
	}
}

function draw() {
	background(0);
	stroke(255);
	strokeWeight(1);
	
	for (let colNo = 0; colNo < cols; colNo++) {
		for (let rowNo = 0; rowNo < rows; rowNo++) {
			currentX = points[colNo][rowNo][0];
			currentY = points[colNo][rowNo][1];
			line(currentX, currentY, points[colNo+1][rowNo][0],points[colNo+1][rowNo][1]);
			line(currentX, currentY, points[colNo][rowNo+1][0],points[colNo][rowNo+1][1]);

			// if we are the last row, draw one final edge to complete the grid
			if (colNo == cols-1) {
				line(points[colNo+1][rowNo][0], points[colNo+1][rowNo][1], points[colNo+1][rowNo+1][0], points[colNo+1][rowNo+1][1]);
			}
			if (rowNo == rows-1) { 
				line(points[colNo][rowNo+1][0], points[colNo][rowNo+1][1], points[colNo+1][rowNo+1][0], points[colNo+1][rowNo+1][1]);
			} 

			if (colNo > 0 && rowNo > 0) {
				drawSubdivs(colNo, rowNo);
			}
			

		}
	}

	function drawSubdivs(colNo, rowNo) {
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
