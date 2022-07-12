let rows;
let cols;
let points;
let subdivs;

function setup() {
	createCanvas(1000, 1414, SVG); // A3 paper size
	//randomSeed(99);

	cols = 5;
	rows = 8;
	cellWidth = floor(width/cols);
	cellHeight = floor(height/rows);

	wf = 2;
	wiggleFactorH = cellHeight / wf;
	wiggleFactorW = cellWidth / wf;
	subdivs = 20;
	bFactor = 0.5;
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
					// only wiggle edge points along the Y edges
					points[x][y][1] += random(-wiggleFactorH,0);
			}}
			else {
				points[x][y][0] += random(-wiggleFactorW,wiggleFactorW);

			}
			if (y == 0 || y == rows) {
				if( x != 0 && x != cols) {
					// only wiggle edge points along the X edges
					points[x][y][0] += random(-wiggleFactorW,0);
			}}
			else {
				points[x][y][1] += random(-wiggleFactorH,wiggleFactorH);
			}
		}
	}
}

function draw() {
	noLoop();
	background(255);
	stroke(0);
	strokeWeight(1.5);
	noFill();
	drawMainGrid();

	//save("mySVG.svg");

	function drawMainGrid() {
		for (let colNo = 0; colNo <= cols; colNo++) {
			for (let rowNo = 0; rowNo <= rows; rowNo++) {
				cX = points[colNo][rowNo][0];
				cY = points[colNo][rowNo][1];
				// strokeWeight(10);
				// point(cX,cY);
				// strokeWeight(1);
				
				if (rowNo == 0) {
					beginShape();
        			vertex(cX, cY);	
				}
				if (rowNo < rows) {
					nextX = points[colNo][rowNo+1][0];
					nextY = points[colNo][rowNo+1][1];
					lastHeight = nextY - cY;
					//line(nextX, nextY, nextX, nextY);
					//bezierVertex(cx1, cy1, cx2, cy2, x, y)
					bezierVertex(
						cX, 
						cY+bFactor*lastHeight,
						nextX,
						nextY-bFactor*lastHeight,
						nextX, 
						nextY,
						);
				}
				if (rowNo == rows) {
					endShape();
				}
			}
		}

		for (let rowNo = 0; rowNo <= rows; rowNo++) {
			for (let colNo = 0; colNo <= cols; colNo++) {
				cX = points[colNo][rowNo][0];
				cY = points[colNo][rowNo][1];
				// strokeWeight(10);
				// point(cX,cY);
				// strokeWeight(1);
				
				if (colNo == 0) {
					beginShape();
        			vertex(cX, cY);	
				}
				if (colNo < cols) {
					nextX = points[colNo+1][rowNo][0];
					nextY = points[colNo+1][rowNo][1];
					lastWidth = nextX - cX;
					//line(nextX, nextY, nextX, nextY);
					//bezierVertex(cx1, cy1, cx2, cy2, x, y)
					bezierVertex(
						cX+bFactor*lastWidth, 
						cY,
						nextX-bFactor*lastWidth,
						nextY,
						nextX, 
						nextY,
						);
				}
				if (colNo == cols) {
					endShape();
				}
			}
		}
		
	}

	
}