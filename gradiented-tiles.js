let griddata = [];
let rSize;

function setup() {
	//createCanvas(500, 707); // A3 paper size
	createCanvas(1000, 1414, SVG);

	gridSize = [24,35];
	rSize = 40;
	maxFillRate = 8;

	for (var i = 0; i < gridSize[0]; i++) {
		griddata[i] = [];
		for (var j = 0; j < gridSize[1]; j++) {
			griddata[i][j] = int(random(1,maxFillRate));
		}
	}
}

function draw() {
	noLoop();
	background(255);
	stroke(0);
	strokeWeight(1);
	noFill();

	for (var i = 0; i < griddata.length; i++) {
		for (var j = 0; j < griddata[i].length; j++) {
			t = new Rectangle(i*rSize,j*rSize,rSize,rSize);
			pathFill(t, griddata[i][j]);
		}
	}
	
	function pathFill(rect, divisions) {
		points = [[0,0]];
		diag = sqrt(2*rect.w**2);
		for (var i = 1; i <= divisions; i++) {
            if (divisions == 1)
              break;
			a = sqrt(2*(i*diag/divisions)**2);
            b = sqrt(2*((divisions-i)*diag/divisions)**2);
			if (i % 2 == 0) {
              if (i < ceil(divisions/2)) {
				points.push([0,a]); 
				points.push([a,0]);
                if (i + 1 == ceil(divisions/2))
				  points.push([rect.w,0]); 
              }
              else {
                points.push([rect.w-b,rect.w]); 
				points.push([rect.w,rect.w-b]);
              }
			}
			else {
              if (i < ceil(divisions/2)) {
				points.push([a,0]);
				points.push([0,a]);
				if (i + 1 == ceil(divisions/2))
					points.push([0,rect.w]);
              }
              else {
                points.push([rect.w,rect.w-b]);
                points.push([rect.w-b,rect.w]); 
				
              }
			}
		}

		for (var i = 0; i < points.length; i++) {
			strokeWeight(2);
			if (i < points.length - 1) {
				line(
					points[i][0] + rect.x, 
					points[i][1] + rect.y, 
					points[i+1][0] + rect.x, 
					points[i+1][1] + rect.y
					);
			}
		}
	}
}

class Rectangle {
	constructor(x, y, h, w) {
		this.x = x;
		this.y = y;
		this.h = h;
		this.w = w;
	}
	// Getter
	get area() {
		return 1; // may not be correct
	}

	// mirror equation: ax + by + c = 0
	static mirrorImage(a, b, c, x1, y1) {
		console.log(a);
        var temp = (-2 * (a * x1 + b * y1 + c)) / (a * a + b * b);
        var x = temp * a + x1;
        var y = temp * b + y1;
        return [x, y];
      }
}