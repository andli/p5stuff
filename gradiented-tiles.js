function setup() {
	//createCanvas(500, 707); // A3 paper size
	createCanvas(1000, 1414, SVG);
}

function draw() {
	noLoop();
	background(255);
	stroke(0);
	strokeWeight(1);
	noFill();

	rSize = 400;
	
	t = new Rectangle(0,0,rSize,rSize);
	strokeWeight(0.2);
	rect(t.x, t.y, t.w, t.h);

	pathFill(t, 4);
	
	function pathFill(rect, divisions) {
		points = [[0,0]];
		diag = sqrt(2*rect.w**2);
		for (var i = 1; i <= divisions/2; i++) {
			a = sqrt(2*(i*diag/divisions)**2);
			if (i % 2 == 0) {
				points.push([0,a]); 
				points.push([a,0]);
				if (i + 1 >= divisions/2)
					points.push([rect.w,0]);
			}
			else {
				points.push([a,0]);
				points.push([0,a]);
				if (i + 1 >= divisions/2)
					points.push([0,rect.w]);
			}
		}
		points_copy = [...points];
		while (points_copy.length > 0) {
			mp = points_copy.pop();
			points.push(Rectangle.mirrorImage(-1,-1,rect.h,mp[0], mp[1]));
		}


		for (var i = 0; i < points.length; i++) {
			strokeWeight(8);
			point(points[i][0],points[i][1]);
			strokeWeight(2);
			if (i < points.length -1) {
				line(points[i][0], points[i][1], points[i+1][0], points[i+1][1]);
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
		return this.calcArea();
	}

	// mirror equation: ax + by + c = 0
	static mirrorImage(a, b, c, x1, y1) {
		console.log(a);
        var temp = (-2 * (a * x1 + b * y1 + c)) / (a * a + b * b);
        var x = temp * a + x1;
        var y = temp * b + y1;
		//console.log([x, y]);
        return [x, y];
      }
}