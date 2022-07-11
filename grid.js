let rows;
let cols;
let margin;
let points;

function setup() {
	createCanvas(500, 707); // A3 paper size
	randomSeed(13);

	cols = 5;
	rows = 8;
	margin = 5;
	wiggleFactor = 10;
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
	//line(10,10,200,200);
	
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
		}
	}
}
