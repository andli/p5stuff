//Potential Flow Around a Disc
let u = [];
let x = [];
let y = [];
let N = 50;
let M = 8;
let dt;
let h;
let t = 0;
let width = 800;

function setup() {
  createCanvas(width, width);
  for (var i = 0; i < N; i++) {
    u[i] = [];
    x[i] = [];
    y[i] = [];
    for (var j = 0; j < N; j++) {
      u[i][j] = 0;
      x[i][j] = (width * i) / (N - 1);
      y[i][j] = (width * j) / (N - 1);
    }
  }

  h = 1 / N;
  dt = 0.3 * pow(h, 2);
}

function draw() {
  background(255, 255, 255, 20);
  t = t + 1;
  if (t > 20) {
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        x[i][j] = (width * i) / (N - 1);
        y[i][j] = (width * j) / (N - 1);
      }
    }
    t = 0;
  }

  // Solve Laplace u = 0 by time stepping interior equations
  for (var i = 1; i < N - 1; i++) {
    for (var j = 1; j < N - 1; j++) {
      u[i][j] =
        u[i][j] +
        (dt *
          (u[i + 1][j] -
            4 * u[i][j] +
            u[i - 1][j] +
            u[i][j + 1] +
            u[i][j - 1])) /
          pow(h, 2);
      //update flow
      x[i][j] = x[i][j] + (u[i][j + 1] - u[i][j]) / h;
      y[i][j] = y[i][j] + (u[i][j] - u[i + 1][j]) / h;
    }
  }
  //Update boundary equations
  for (var j = 0; j < N; j++) {
    u[0][j] = u[1][j];
    u[N - 1][j] = u[N - 2][j];
  }
  for (var i = 0; i < N; i++) {
    u[i][0] = u[i][1] - h;
    u[i][N - 1] = u[i][N - 2] + h;
  }
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      if (
        (i * M - 200) * (i * M - 200) + (j * M - 200) * (j * M - 200) <
        10000
      ) {
        u[i][j] = 0;
      }
    }
  }
  //Plot flow
  noStroke();
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      //fill(0,255,255*abs(u[i][j]));
      //rect(i*400/N,j*400/N,10,10);
      ellipse(x[i][j], y[i][j], 1, 1);
    }
  }
  ellipse(width / 2, width / 2, width / 2);
  fill(0);
}
