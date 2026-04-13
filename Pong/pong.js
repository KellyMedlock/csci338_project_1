class PongGame {
  constructor() {
    // Should work like an OnStart
    this.canvas = document.getElementById("pongCanvas");
    this.ctx = this.canvas.getContext("2d"); // This lets me draw

    // Game dimensions - Remember to change if I decide to change html canvas width/hieght
    this.width = 1000;
    this.height = 600;

    // Paddle stuff
    this.paddleWidth = 15;
    this.paddleHeight = 100;
    this.playerPaddle = {
      x: 20,
      y: this.height / 2 - this.paddleHeight / 2, // Parentheses are autoremoved, that's fun and cool and what I want that to do.
    };
    this.aiPaddle = {
      x: this.width - 35,
      y: this.height / 2 - this.paddleHeight / 2, // Middle of canvas  minus  middle of paddle
    };

    // Ball stuff
    this.ball = {
      x: this.width / 2,
      y: this.height / 2,
      radius: 8,
      vx: 5,
      vy: 5,
      speed: 5,
    };

    // Score
    this.playerScore = 0;
    this.aiScore = 0;
    this.winningScore = 7;
    this.gameOver = false;
    this.winner = null;

    // Game state
    this.gameRunning = false;
    this.animationId = null;

    // Grab html elements
    this.playerScoreElement = document.getElementById("playerScore");
    this.aiScoreElement = document.getElementById("aiScore");
    this.startBtn = document.getElementById("startBtn");
    this.resetBtn = document.getElementById("resetBtn");

    // Bind methods
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.draw = this.draw.bind(this);
    this.startGame = this.startGame.bind(this);
    this.resetGame = this.resetGame.bind(this);

    // Add event listeners
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.startBtn.addEventListener("click", this.startGame);
    this.resetBtn.addEventListener("click", this.resetGame);

    // Initial draw
    this.draw();
  }

  handleMouseMove(e) {
    if (!this.gameRunning || this.gameOver) return;

    const rect = this.canvas.getBoundingClientRect();
    const scaleY = this.canvas.height / rect.height;
    let mouseY = (e.clientY - rect.top) * scaleY;

    // Clamp paddle position
    mouseY = Math.max(0, Math.min(mouseY, this.height - this.paddleHeight));
    this.playerPaddle.y = mouseY;
  }

  startGame() {
    if (this.gameRunning) return;

    this.gameRunning = true;
    this.gameOver = false;
    this.winner = null;

    // Reset positions
    this.resetBall();
    this.playerPaddle.y = this.height / 2 - this.paddleHeight / 2;
    this.aiPaddle.y = this.height / 2 - this.paddleHeight / 2;

    // Start game loop
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.updateGame();
  }

  resetGame() {
    this.gameRunning = false;
    this.gameOver = false;
    this.winner = null;
    this.playerScore = 0;
    this.aiScore = 0;
    this.updateScoreDisplay();

    // Reset positions
    this.resetBall();
    this.playerPaddle.y = this.height / 2 - this.paddleHeight / 2;
    this.aiPaddle.y = this.height / 2 - this.paddleHeight / 2;

    // Reset ball speed
    this.ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
    this.ball.vy = 5 * (Math.random() > 0.5 ? 1 : -1);
    this.ball.speed = 5;

    // Stop game loop
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.draw();
  }

  resetBall() {
    this.ball.x = this.width / 2;
    this.ball.y = this.height / 2;
  }

  updateScoreDisplay() {
    this.playerScoreElement.textContent = this.playerScore;
    this.aiScoreElement.textContent = this.aiScore;
  }

  checkWin() {
    if (this.playerScore >= this.winningScore) {
      this.gameOver = true;
      this.gameRunning = false;
      this.winner = "PLAYER";
      return true;
    } else if (this.aiScore >= this.winningScore) {
      this.gameOver = true;
      this.gameRunning = false;
      this.winner = "AI";
      return true;
    }
    return false;
  }

  updateAI() {
    if (!this.gameRunning) return;

    // AI difficulty based on score difference and current score
    const scoreDiff = Math.abs(this.playerScore - this.aiScore);
    let difficulty = 0.4 + this.aiScore * 0.02 + scoreDiff * 0.03;
    difficulty = Math.min(difficulty, 0.35); // Cap maximum difficulty

    // AI follows the ball with margin of error based on difficulty
    const targetY = this.ball.y - this.paddleHeight / 2;
    const errorMargin = (1 - difficulty) * 60; // Higher difficulty = less error

    let aiTargetY = targetY;

    // Add some random to the AI
    if (Math.random() < 0.3) {
      aiTargetY += (Math.random() - 0.5) * errorMargin;
    }

    // Smooth AI movement
    const aiSpeed = 8 + difficulty * 5;
    const diff = aiTargetY - this.aiPaddle.y;
    this.aiPaddle.y += Math.min(Math.max(diff * 0.15, -aiSpeed), aiSpeed);

    // Clamp AI paddle position
    this.aiPaddle.y = Math.max(
      0,
      Math.min(this.aiPaddle.y, this.height - this.paddleHeight),
    );
  }

  updateBall() {
    if (!this.gameRunning) return;

    // Update ball position
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    // Top and bottom collision
    if (this.ball.y - this.ball.radius <= 0) {
      this.ball.y = this.ball.radius;
      this.ball.vy = -this.ball.vy;
    }
    if (this.ball.y + this.ball.radius >= this.height) {
      this.ball.y = this.height - this.ball.radius;
      this.ball.vy = -this.ball.vy;
    }

    // Player paddle collision
    if (
      this.ball.vx < 0 &&
      this.ball.x - this.ball.radius <=
        this.playerPaddle.x + this.paddleWidth &&
      this.ball.x + this.ball.radius >= this.playerPaddle.x &&
      this.ball.y + this.ball.radius >= this.playerPaddle.y &&
      this.ball.y - this.ball.radius <= this.playerPaddle.y + this.paddleHeight
    ) {
      // Calculate hit position relative to paddle center
      const hitPos = (this.ball.y - this.playerPaddle.y) / this.paddleHeight;
      const angle = ((hitPos - 0.5) * Math.PI) / 2.5; // Max 72 degrees angle

      // Increase speed slightly on each hit (capped)
      this.ball.speed = Math.min(this.ball.speed + 0.2, 12);

      // Set new direction
      const direction = 1; // Ball goes right
      this.ball.vx = direction * this.ball.speed * Math.cos(angle);
      this.ball.vy = this.ball.speed * Math.sin(angle);

      // Make sure ball doesn't get stuck
      this.ball.x = this.playerPaddle.x + this.paddleWidth + this.ball.radius;
    }

    // AI paddle collision
    if (
      this.ball.vx > 0 &&
      this.ball.x + this.ball.radius >= this.aiPaddle.x &&
      this.ball.x - this.ball.radius <= this.aiPaddle.x + this.paddleWidth &&
      this.ball.y + this.ball.radius >= this.aiPaddle.y &&
      this.ball.y - this.ball.radius <= this.aiPaddle.y + this.paddleHeight
    ) {
      // Calculate hit position relative to paddle center
      const hitPos = (this.ball.y - this.aiPaddle.y) / this.paddleHeight;
      const angle = ((hitPos - 0.5) * Math.PI) / 2.5;

      // Increase speed slightly on each hit (capped)
      this.ball.speed = Math.min(this.ball.speed + 0.2, 12);

      // Set new direction
      const direction = -1; // Ball goes left
      this.ball.vx = direction * this.ball.speed * Math.cos(angle);
      this.ball.vy = this.ball.speed * Math.sin(angle);

      // Ensure ball doesn't get stuck
      this.ball.x = this.aiPaddle.x - this.ball.radius;
    }

    // Score points
    if (this.ball.x - this.ball.radius <= 0) {
      // AI scores
      this.aiScore++;
      this.updateScoreDisplay();
      this.resetBall();
      this.ball.vx = 5;
      this.ball.vy = 5 * (Math.random() > 0.5 ? 1 : -1);
      this.ball.speed = 5;
      this.playerPaddle.y = this.height / 2 - this.paddleHeight / 2;
      this.aiPaddle.y = this.height / 2 - this.paddleHeight / 2;

      if (this.checkWin()) {
        this.gameRunning = false;
      }
    } else if (this.ball.x + this.ball.radius >= this.width) {
      // Player scores
      this.playerScore++;
      this.updateScoreDisplay();
      this.resetBall();
      this.ball.vx = -5;
      this.ball.vy = 5 * (Math.random() > 0.5 ? 1 : -1);
      this.ball.speed = 5;
      this.playerPaddle.y = this.height / 2 - this.paddleHeight / 2;
      this.aiPaddle.y = this.height / 2 - this.paddleHeight / 2;

      if (this.checkWin()) {
        this.gameRunning = false;
      }
    }
  }

  updateGame() {
    if (!this.gameRunning) {
      this.draw();
      return;
    }

    this.updateAI();
    this.updateBall();
    this.draw();

    this.animationId = requestAnimationFrame(this.updateGame);
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw center line
    this.ctx.beginPath();
    this.ctx.setLineDash([10, 15]);
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.width / 2, this.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw center circle
    this.ctx.beginPath();
    this.ctx.arc(this.width / 2, this.height / 2, 50, 0, Math.PI * 2);
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.stroke();

    // Draw paddles with glow effect
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = "#00ffff";

    // Player paddle (left)
    this.ctx.fillStyle = "#00ff88ff";
    this.ctx.fillRect(
      this.playerPaddle.x,
      this.playerPaddle.y,
      this.paddleWidth,
      this.paddleHeight,
    );

    // AI paddle (right)
    this.ctx.fillStyle = "#ff00bfff";
    this.ctx.fillRect(
      this.aiPaddle.x,
      this.aiPaddle.y,
      this.paddleWidth,
      this.paddleHeight,
    );

    // Draw ball with glow
    this.ctx.fillStyle = "#ffffff";
    this.ctx.shadowBlur = 15;
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Reset shadow
    this.ctx.shadowBlur = 0;

    // Draw particle trail for ball
    this.ctx.beginPath();
    this.ctx.arc(
      this.ball.x - this.ball.vx * 2,
      this.ball.y - this.ball.vy * 2,
      this.ball.radius / 2,
      0,
      Math.PI * 2,
    );
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    this.ctx.fill();

    // Draw game over message
    if (this.gameOver && this.winner) {
      this.ctx.font = 'bold 48px "Courier New", monospace';
      this.ctx.fillStyle = "#ffffff";
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = "#00ffff";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        `${this.winner} WINS!`,
        this.width / 2,
        this.height / 3,
      );
      this.ctx.font = '24px "Courier New", monospace';
      this.ctx.fillStyle = "#aaaaaa";
      this.ctx.fillText(
        "Click RESET to play again",
        this.width / 2,
        this.height / 2,
      );
      this.ctx.textAlign = "left";
    }

    // Draw instructions on canvas
    if (!this.gameRunning && !this.gameOver) {
      this.ctx.font = '20px "Courier New", monospace';
      this.ctx.fillStyle = "#ffffff";
      this.ctx.shadowBlur = 5;
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "Click START GAME to begin",
        this.width / 2,
        this.height / 2,
      );
      this.ctx.textAlign = "left";
    }

    // Draw score glow effect
    this.ctx.shadowBlur = 0;
  }
}

// Initialize game when page loads
window.addEventListener("DOMContentLoaded", () => {
  new PongGame();
});
