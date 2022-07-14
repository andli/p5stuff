let rows;
let cols;
let margin;
let points;
let subdivs;

function setup() {
	createCanvas(1000, 1000); // A3 paper size
	//createCanvas(1000, 1414, SVG);

	randomSeed(11);

	cols = 6;
	rows = 22;
	wiggleDistanceR = 25;
	wiggleDistanceT = .1;
	subdivs = 25;

	cellWidth = 0.5*width/cols;
	cellHeight = Math.PI*2/rows;
	points = [];

	points = [];
	for (let x = 0; x < cols + 1; x++) {
		points[x] = [];
		for (let y = 0; y < rows + 1; y++) {
			points[x][y] = [cellWidth*x, cellHeight*y];
		} 
	}

	// wiggle points
	wiggle();
	//TODO: wiggle edges to the same points

	function wiggle() {
		for (let x = 0; x <= cols; x++) {
			for (let y = 0; y <= rows; y++) {
				if (x == 0 || x == cols) {
					if (y != 0 && y != rows) {
						// only wiggle edge points along the edge
						points[x][y][1] += random(-wiggleDistanceT,wiggleDistanceT);
				}}
				else {
					if (y == 0) {
						points[x][y][0] += random(-wiggleDistanceR,wiggleDistanceR);
						console.log(points[x][y][0]);
						
					}
					if (y == cols) {
						console.log(points[x][0][1]);
						points[x][y][0] == points[x][0][1];

					}

				}
				// "radius"
				if (y == 0 || y == rows) {
					if( x != 0 && x != cols) {
						// only wiggle edge points along the edge
						points[x][y][0] += random(-wiggleDistanceR,wiggleDistanceR);
				}}
				else {
					points[x][y][1] += random(-wiggleDistanceT,wiggleDistanceT);
	

				}
			}
		}
	}
}

function draw() {
	noLoop();
	background(255);
	stroke(0);
	strokeWeight(0.8);
	noFill();
	translate(width/2,height/2);

	drawMainGrid();

	function drawMainGrid() {
		for (let colNo = 0; colNo <= cols; colNo++) {
			for (let rowNo = 0; rowNo <= rows; rowNo++) {
				currentX = points[colNo][rowNo][0];
				currentY = points[colNo][rowNo][1];
				if (colNo < cols) {
					pline(currentX, currentY, points[colNo + 1][rowNo][0], points[colNo + 1][rowNo][1]);
				}

				if (rowNo < rows) {
					pline(currentX, currentY, points[colNo][rowNo + 1][0], points[colNo][rowNo + 1][1]);
				}

				if (colNo > 0 && rowNo > 0) {
					// drawColSubdivs(colNo, rowNo);
					// drawRowSubdivs(colNo, rowNo);
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

function pline(r1,t1,r2,t2) {
	let c1 = polar2Cartesian(r1,t1);
	let c2 = polar2Cartesian(r2,t2);
	line(c1.x,c1.y,c2.x,c2.y);
}

function polar2Cartesian(r, theta) {
	let x = r * cos(theta);
	let y = r * sin(theta);
	let cart = { x:x, y:y };
	return cart;
}

function cartesian2Polar(x, y) {
    var distance = Math.sqrt(x*x + y*y);
    var radians = Math.atan2(y,x); // Note: Takes y first
    var polarCoor = { distance:distance, radians:radians };
    return polarCoor;
}


