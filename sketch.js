let rows;
let cols;
let margin;
let points;
let subdivs;

function setup() {
	createCanvas(500, 707); // A3 paper size
	randomSeed(14);

	cols = 7;
	rows = 10;
	margin = 5;
	wiggleFactor = 20;
	subdivs = 20;
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
    background(0);
	stroke(255);
	strokeWeight(1);
	
	//setCenter( floor(width/2), floor(height/2) );
	//polarTriangle(30, 100, 50);

	drawMainGrid();

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

function cartesian2Polar(x, y){
    distance = Math.sqrt(x*x + y*y)
    radians = Math.atan2(y,x) //This takes y first
    polarCoor = { distance:distance, radians:radians }
    return polarCoor
}