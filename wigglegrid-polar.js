let rows;
let cols;
let margin;
let points;
let subdivs;

function setup() {
	createCanvas(1000, 1000); // A3 paper size
	//createCanvas(1000, 1414, SVG);

	randomSeed(3);

	cols = 8;
	rows = 19;
	wiggleR = 24;
	wiggleT = .1;
	subdivs = 5;
	innerMargin = 70;

	cellWidth = (0.48*width-innerMargin)/cols;
	cellHeight = Math.PI*2/rows;
	totalHeight = cellHeight * rows;
	points = [];

	points = [];
	for (let c = 0; c < cols + 1; c++) {
		points[c] = [];
		for (let r = 0; r < rows + 1; r++) {
			points[c][r] = [cellWidth*c+innerMargin, cellHeight*r];
		} 
	}

	// wiggle points
	wiggle();
	//TODO: wiggle edges to the same points

	function wiggle() {
		for (let c = 0; c <= cols; c++) {
			for (let r = 0; r < rows; r++) {
				if (c==0 || c == cols) {
					points[c][r][1] += random(-wiggleT,wiggleT);
				}
				else {
					points[c][r][1] += random(-wiggleT,wiggleT);
					points[c][r][0] += random(-wiggleR,wiggleR);
				}
			}
			// marry the two "ends" of the matrix
			for (let x = 0; x <= cols; x++) {
				points[x][rows][0] = points[x][0][0];
				points[x][rows][1] = points[x][0][1]+totalHeight;
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
			for (let rowNo = 0; rowNo <= rows-1; rowNo++) {
				currentX = points[colNo][rowNo][0];
				currentY = points[colNo][rowNo][1];
				if (colNo < cols) {
					pline(currentX, currentY, points[colNo + 1][rowNo][0], points[colNo + 1][rowNo][1]);
				}

				if (rowNo < rows) {
					pline(currentX, currentY, points[colNo][rowNo + 1][0], points[colNo][rowNo + 1][1]);
				}

			}
		}
	}
	for (let colNo = 1; colNo <= cols; colNo++) {
		for (let rowNo = 1; rowNo <= rows; rowNo++) {
			drawColSubdivs(colNo, rowNo);
			drawRowSubdivs(colNo, rowNo);
		}
	}

	function drawColSubdivs(colNo, rowNo) {
		for (let subdiv = 1; subdiv < subdivs; subdiv++) {
			let lastX1 = points[colNo - 1][rowNo - 1][0];
			let lastY1 = points[colNo - 1][rowNo - 1][1];
			let lastX2 = points[colNo][rowNo - 1][0];
			let lastY2 = points[colNo][rowNo - 1][1];
			let deltaLastX = (lastX2 - lastX1) / subdivs;
			let deltaLastY = (lastY2 - lastY1) / subdivs;

			let currentX1 = points[colNo - 1][rowNo][0];
			let currentY1 = points[colNo - 1][rowNo][1];
			let currentX2 = points[colNo][rowNo][0];
			let currentY2 = points[colNo][rowNo][1];
			let deltaCurrentX = (currentX2 - currentX1) / subdivs;
			let deltaCurrentY = (currentY2 - currentY1) / subdivs;

			pline(lastX1 + deltaLastX * subdiv,
				lastY1 + deltaLastY * subdiv,
				currentX1 + deltaCurrentX * subdiv,
				currentY1 + deltaCurrentY * subdiv);
		}
	}

	function drawRowSubdivs(colNo, rowNo) {
		for (let subdiv = 1; subdiv < subdivs; subdiv++) {
			let lastX1 = points[colNo - 1][rowNo - 1][0];
			let lastY1 = points[colNo - 1][rowNo - 1][1];
			let lastX2 = points[colNo - 1][rowNo][0];
			let lastY2 = points[colNo - 1][rowNo][1];
			let deltaLastX = (lastX2 - lastX1) / subdivs;
			let deltaLastY = (lastY2 - lastY1) / subdivs;
			
			let currentX1 = points[colNo][rowNo - 1][0];
			let currentY1 = points[colNo][rowNo - 1][1];
			let currentX2 = points[colNo][rowNo][0];
			let currentY2 = points[colNo][rowNo][1];
			let deltaCurrentX = (currentX2 - currentX1) / subdivs;
			let deltaCurrentY = (currentY2 - currentY1) / subdivs;
			
			// console.log(points[colNo][rowNo - 1]);
			// if (rowNo == rows)
			// 	break;
			pline(lastX1 + deltaLastX * subdiv,
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


