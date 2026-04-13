// brickbreakerMain.js
let elem = document.documentElement;
if (elem.requestFullscreen) {
  elem.requestFullscreen();
}

const canvas = document.querySelector(".canvas");
const canvas1 = document.querySelector(".canvas1");
const ctx = canvas.getContext("2d");
const ctx1 = canvas1.getContext("2d");

// Location of paddle
let X = 0;
let Y = 0;

// Location of all the obstacles
let LOC = [];

let BALL_RADIUS = 15;
let BALL_VX = 8;
let BALL_VY = 3;
let PADDLE_WIDTH = 150;
let PADDLE_HEIGHT = 10;
let CANVAS_WIDTH = 0;
let CANVAS_HEIGHT = 0;
let OBSTACLE_ROW_COUNT = 6;
let OBSTACLE_COL_COUNT = 10;
let OBSTACLE_START_X = 2;
let OBSTACLE_START_Y = 2;
let OBSTACLE_PADDING = 5;
let OBSTACLE_HEIGHT = 30;
let OBSTACLE_WIDTH = 0;

let CURRENT_SCORE = 0;
let HIGH_SCORE = 0;
let FLAG = 0;
let PLAYGAME = null;
let CONTROLLER_LOOP = null;
let gameStarted = false;

const Text = {
  text: "Click to start Playing",
  draw: function (str = "") {
    ctx.clearRect(0, CANVAS_HEIGHT / 2 + 20, canvas.width, 100);
    ctx.font = "2em Roboto sans-serif";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const message = str === "" ? this.text : str;
    ctx.fillText(message, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
  },
};

const controller = {
  x: 0,
  y: 0,
  radius: BALL_RADIUS,
  draw: function () {
    ctx1.fillStyle = "#000000";

    ctx1.beginPath();
    ctx1.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx1.fill();
    ctx1.closePath();

    ctx1.beginPath();
    ctx1.moveTo(this.x - this.radius - 20, this.y);
    ctx1.lineTo(this.x - this.radius - 10, this.y + this.radius);
    ctx1.lineTo(this.x - this.radius - 10, this.y - this.radius);
    ctx1.fill();
    ctx1.closePath();

    ctx1.beginPath();
    ctx1.moveTo(this.x + this.radius + 20, this.y);
    ctx1.lineTo(this.x + this.radius + 10, this.y + this.radius);
    ctx1.lineTo(this.x + this.radius + 10, this.y - this.radius);
    ctx1.fill();
    ctx1.closePath();
  },
  move: function (e) {
    const touchX = e.touches[0].clientX;

    if (touchX < canvas1.width && touchX > 0) {
      this.x = touchX;
    } else if (touchX >= canvas1.width) {
      this.x = canvas1.width - 20 - this.radius;
    } else if (touchX <= 0) {
      this.x = 20 + this.radius;
    }

    paddle.move({ offsetX: this.x });
  },
};

const obstacle = {
  height: OBSTACLE_HEIGHT,
  width: OBSTACLE_WIDTH,
  x: OBSTACLE_START_X,
  y: OBSTACLE_START_Y,

  draw: function (x, y) {
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.fillRect(x, y, this.width, this.height);
    ctx.closePath();
  },

  create: function () {
    for (let i = 0; i < LOC.length; i++) {
      this.draw(LOC[i][0], LOC[i][1]);
    }
  },

  destroy: function (x, y) {
    ctx.clearRect(x, y, this.width, this.height);
  },

  createGrid: function () {
    LOC = [];
    this.x = OBSTACLE_START_X;
    this.y = OBSTACLE_START_Y;
    this.width = OBSTACLE_WIDTH;
    this.height = OBSTACLE_HEIGHT;

    for (let row = 0; row < OBSTACLE_ROW_COUNT; row++) {
      this.x = OBSTACLE_START_X;

      for (let col = 0; col < OBSTACLE_COL_COUNT; col++) {
        LOC.push([this.x, this.y]);
        this.x = this.x + this.width + OBSTACLE_PADDING;
      }

      this.y = this.y + this.height + OBSTACLE_PADDING;
    }

    this.y = OBSTACLE_START_Y;
  },
};

const ball = {
  x: 0,
  y: 0,
  radius: BALL_RADIUS,
  vx: BALL_VX,
  vy: BALL_VY,

  draw: function () {
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();
  },

  move: function () {
    this.x += this.vx;
    this.y += this.vy;

    // Canvas left and right limit
    if (this.x + this.radius >= CANVAS_WIDTH || this.x - this.radius <= 0) {
      this.vx = -this.vx;
    }

    // Canvas bottom
    if (this.y + this.radius >= CANVAS_HEIGHT) {
      this.vx = 0;
      this.vy = 0;
      FLAG = 1;
    }

    // Canvas top
    if (this.y - this.radius <= 0) {
      this.vy = -this.vy;
    }

    // Detect collision with paddle
    if (
      this.x >= paddle.x &&
      this.x <= paddle.x + paddle.width &&
      this.y + this.radius >= paddle.y &&
      this.y + this.radius <= paddle.y + paddle.height
    ) {
      this.vy = -this.vy;
    }

    // Detect collision with obstacle
    for (let i = 0; i < LOC.length; i++) {
      if (
        this.x >= LOC[i][0] &&
        this.x <= LOC[i][0] + OBSTACLE_WIDTH &&
        this.y - this.radius >= LOC[i][1] &&
        this.y - this.radius <= LOC[i][1] + OBSTACLE_HEIGHT
      ) {
        obstacle.destroy(LOC[i][0], LOC[i][1]);
        LOC.splice(i, 1);
        this.vy = -this.vy;
        CURRENT_SCORE += 1;

        document.querySelector(".currentScore").innerText =
          `YOUR SCORE : ${CURRENT_SCORE}`;

        this.vy *= 1.005;
        this.vx *= 1.005;
        break;
      }
    }
  },
};

const paddle = {
  x: 0,
  y: 0,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,

  draw: function () {
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();
  },

  move: function (e) {
    if (e.offsetX <= 0) {
      this.x = 0;
    } else if (e.offsetX >= canvas.width) {
      this.x = canvas.width - this.width;
    } else {
      this.x = e.offsetX - this.width / 2;
    }

    X = this.x;
    Y = this.y;
  },
};

function setupCanvas() {
  if (window.screen.width < 800) {
    CANVAS_WIDTH = window.innerWidth * 0.95;
    CANVAS_HEIGHT = window.innerHeight * 0.6;

    OBSTACLE_ROW_COUNT = 6;
    OBSTACLE_COL_COUNT = 6;
    OBSTACLE_HEIGHT = 15;
    BALL_RADIUS = 10;
    PADDLE_WIDTH = 100;
    BALL_VX = 3;
    BALL_VY = 2;

    canvas1.style.display = "block";
    canvas1.width = window.innerWidth * 0.95;
    canvas1.height = 50;
  } else {
    const rect = canvas.getBoundingClientRect();
    CANVAS_WIDTH = rect.width;
    CANVAS_HEIGHT = rect.height;
    canvas1.style.display = "none";
  }

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  OBSTACLE_WIDTH = Math.floor(
    (CANVAS_WIDTH - OBSTACLE_COL_COUNT * 4) / OBSTACLE_COL_COUNT,
  );

  obstacle.width = OBSTACLE_WIDTH;
  obstacle.height = OBSTACLE_HEIGHT;

  ball.radius = BALL_RADIUS;
  ball.vx = BALL_VX;
  ball.vy = BALL_VY;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  paddle.width = PADDLE_WIDTH;
  paddle.height = PADDLE_HEIGHT;
  paddle.x = canvas.width / 2 - paddle.width / 2;
  paddle.y = canvas.height - paddle.height - 2;

  X = paddle.x;
  Y = paddle.y;

  controller.radius = BALL_RADIUS;
  controller.x = canvas1.width / 2;
  controller.y = canvas1.height / 2;
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_on_canvas() {
  if (LOC.length === 0 || FLAG === 1) {
    FLAG = 0;

    if (PLAYGAME) {
      clearInterval(PLAYGAME);
      PLAYGAME = null;
    }

    gameStarted = false;

    if (CURRENT_SCORE > HIGH_SCORE) {
      HIGH_SCORE = CURRENT_SCORE;
    }

    CURRENT_SCORE = 0;
    init();
    return;
  }

  clear();
  ball.draw();
  paddle.draw();
  obstacle.create();
  ball.move();
}

function init() {
  clear();
  setupCanvas();
  obstacle.createGrid();

  document.querySelector(".currentScore").innerText =
    `YOUR SCORE : ${CURRENT_SCORE}`;
  document.querySelector(".currentScore").style.marginLeft = "20px";
  document.querySelector(".highScore").innerText = `HIGH SCORE : ${HIGH_SCORE}`;
  document.querySelector(".highScore").style.marginLeft = "20px";

  ball.draw();
  paddle.draw();
  obstacle.create();

  if (window.screen.width < 800) {
    drawController();
  }
}

function drawController() {
  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  controller.draw();
}

function x() {
  if (gameStarted) return;

  gameStarted = true;

  let countdown = 3;

  Text.draw(`Game starts in ${countdown}...`);

  const countdownInterval = setInterval(() => {
    countdown--;

    if (countdown > 0) {
      Text.draw(`Game starts in ${countdown}...`);
    } else {
      clearInterval(countdownInterval);

      Text.draw("GO!");

      setTimeout(() => {
        if (PLAYGAME) clearInterval(PLAYGAME);
        PLAYGAME = setInterval(draw_on_canvas, 10);

        if (window.screen.width < 800 && !CONTROLLER_LOOP) {
          CONTROLLER_LOOP = setInterval(drawController, 10);
        }
      }, 500); // small pause after "GO!"
    }
  }, 1000);
}

if (window.screen.width < 800) {
  canvas1.addEventListener("touchmove", (e) => {
    controller.move(e);
  });
}

canvas.addEventListener("click", x);

canvas.addEventListener("mousemove", (e) => {
  paddle.move(e);
});
