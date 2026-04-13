// declaring and initializing variables
let playerX, playerY;
let enemyX = new Array(10).fill(0);
let enemyY = new Array(10).fill(0);

let bossPosTimer = 0,
  hitCounter = 0,
  attackNumber = 0,
  score = 0,
  highscore = 0,
  timer = 3600,
  enemyMovement = 0,
  enemySwitch = 0,
  levelNumber = 0,
  level = 0;

let bossX = new Array(10).fill(0);
let bossY = new Array(10).fill(0);

let r = 0,
  q = 0,
  bossTracker = 0,
  bossChallenge = 0;

let bossLaserX = 0,
  bossLaserY = 0;

// pause support
let paused = false;

// hit boxes
function isInsideArea(locX, locY, left, right, top, bottom) {
  return locX >= left && locX <= right && locY >= top && locY <= bottom;
}

function isInsideAreaAttack(locX, locY, left, right, top, bottom) {
  return locX >= left && locX <= right && locY >= top && locY <= bottom;
}

function setup() {
  const container = document.getElementById("game-container");
  const canvas = createCanvas(container.clientWidth, container.clientHeight);
  canvas.parent("game-container");

  frameRate(120);

  playerX = -10;
  playerY = height - 300;

  enemyplacement();
  bosslocation();
  bossChallenge = int(random(30, 60));
}

function windowResized() {
  const container = document.getElementById("game-container");
  resizeCanvas(container.clientWidth, container.clientHeight);
}

function draw() {
  if (paused) return;

  switch (level) {
    case 0:
      mainmenu();
      break;
    case 1:
      firstlevel();
      creatingEnemys();
      break;
    case 2:
      secondLevel();
      creatingEnemys();
      break;
    case 3:
      level3();
      creatingEnemys();
      break;
    case 4:
      bossLevel();
      break;
    case 5:
      winScreen();
      break;
    case 10:
      gameoverScreen();
      break;
  }

  if (level > 0 && level < 5) {
    hitCounter = 0;
  }

  player();

  // crosshair
  if (level > 0 && level !== 5 && level !== 10) {
    noCursor();
    rectMode(CORNER);
    stroke(255);
    strokeWeight(2);
    noFill();
    ellipse(mouseX, mouseY, 30, 30);
    line(mouseX - 15, mouseY, mouseX + 15, mouseY);
    line(mouseX, mouseY - 15, mouseX, mouseY + 15);
  } else {
    cursor();
  }
}

// main menu
function mainmenu() {
  frameRate(1);
  background(100);
  fill(255);
  textFont("Arial");
  textSize(35);
  text("welcome to alien attack a side Scroller game", 10, 70);
  text(
    "movements are D and A for forward and back and W and S to move up and down",
    10,
    140,
  );
  text(
    "mouse movement controls the crosshairs and the left mouse button to shoot",
    10,
    210,
  );
  text("shoot the spaceships to win, get hit and lose points", 10, 280);

  fill(240, 30, 30);
  textSize(100);
  text("ALIEN ATTACK!!!!", width / 2 - 450, height / 1.5);

  fill(255);
  textSize(40);
  text("Press ENTER to start", width / 2 - 180, height / 1.5 + 100);

  timer = 3600;
}

// level 1
function firstlevel() {
  frameRate(120);
  enemySwitch = 0;

  background(10, 232, 250);
  fill(25, 157, 79);
  ellipse(width / 2, height - 300, 2000, 500);

  fill(76, 77, 77);
  rect(-40, height - 300, width + 40, 300);

  fill(163, 165, 164);
  rect(-40, height - 320, width + 40, 95);

  fill(131, 131, 131);
  rect(-40, height - 225, width + 40, 10);

  fill(250, 232, 28);
  rect(-40, height - 20, width + 40, 40);

  // trees
  fill(20, 111, 31);
  noStroke();

  triangle(
    width / 2 + 280,
    height / 2 + 50,
    width / 2 + 155,
    height / 2 + 50,
    width / 2 + 218,
    height / 2 - 75,
  );
  triangle(
    width / 2 + 268,
    height / 2,
    width / 2 + 165,
    height / 2,
    width / 2 + 218,
    height / 2 - 150,
  );
  triangle(
    width / 2 + 248,
    height / 2 - 75,
    width / 2 + 185,
    height / 2 - 75,
    width / 2 + 218,
    height / 2 - 225,
  );

  triangle(
    width / 2 - 280,
    height / 2 + 50,
    width / 2 - 155,
    height / 2 + 50,
    width / 2 - 218,
    height / 2 - 75,
  );
  triangle(
    width / 2 - 270,
    height / 2,
    width / 2 - 165,
    height / 2,
    width / 2 - 218,
    height / 2 - 150,
  );
  triangle(
    width / 2 - 255,
    height / 2 - 75,
    width / 2 - 185,
    height / 2 - 75,
    width / 2 - 218,
    height / 2 - 225,
  );

  triangle(
    width / 2 - 80,
    height / 2 + 50,
    width / 2 + 85,
    height / 2 + 50,
    width / 2,
    height / 2 - 75,
  );
  triangle(
    width / 2 - 70,
    height / 2,
    width / 2 + 65,
    height / 2,
    width / 2,
    height / 2 - 150,
  );
  triangle(
    width / 2 - 55,
    height / 2 - 75,
    width / 2 + 55,
    height / 2 - 75,
    width / 2,
    height / 2 - 225,
  );

  stroke(0);
  strokeWeight(1);
  fill(222, 221, 219);
  rect(width - 20, height - 900, 400, 580);

  // sun
  fill(243, 250, 68);
  ellipse(width / 2 + 500, height / 2 - 355, 60, 60);

  fill(220, 100, 100);
  textSize(50);
  text("score: " + score, width / 2 + 200, 50);
  text("time: " + int(timer / 120), width / 2, 50);
  text("highScore: " + highscore, 100, 50);

  if (playerX > width + 10 && level === 1) {
    level = 2;
    playerX = -10;
    enemySwitch = 2;
    enemyplacement();
    timer = 3600;
  }

  if (playerX < -5) playerX = 3;
  if (playerY < height - 350) playerY = height - 350;
  if (playerY > height + 5) playerY = height;

  timer--;
  if (timer <= 0) {
    level = 10;
  }
}

// level 2
function secondLevel() {
  frameRate(120);
  enemySwitch = 0;

  background(10, 232, 250);

  fill(25, 157, 79);
  ellipse(width / 2, height - 300, 2000, 500);

  fill(76, 77, 77);
  rect(-40, height - 300, width + 40, 300);

  fill(163, 165, 164);
  rect(-40, height - 320, width + 40, 95);

  fill(131, 131, 131);
  rect(-40, height - 225, width + 40, 10);

  fill(250, 232, 28);
  rect(-40, height - 20, width + 40, 40);

  // buildings
  fill(222, 221, 219);
  rect(0, height - 900, 400, 580);
  rect(width - 400, height - 900, 400, 580);

  // windows
  fill(183, 223, 229);

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 6; col++) {
      rect(col * 65, height - 850 + row * 90, 60, 80);
      rect(width - 390 + col * 65, height - 850 + row * 90, 60, 80);
    }
  }

  // sun
  fill(243, 250, 68);
  ellipse(width / 2 + 400, height / 2 - 355, 60, 60);

  fill(220, 100, 100);
  textSize(50);
  text(score, width / 2 + 200, 50);
  text(int(timer / 120), width / 2, 50);
  text("highScore: " + highscore, 100, 50);

  if (playerX > width + 10 && level === 2) {
    level = 3;
    playerX = -10;
    enemySwitch = 2;
    enemyplacement();
    timer = 3600;
  }

  if (playerX <= -20) {
    level = 1;
    playerX = width;
    enemySwitch = 2;
    enemyplacement();
  }

  if (playerY < height - 350) playerY = height - 350;
  if (playerY > height + 5) playerY = height;

  timer--;
  if (timer <= 0) {
    level = 10;
  }
}

// level 3
function level3() {
  frameRate(120);
  enemySwitch = 0;

  background(10, 232, 250);

  fill(25, 157, 79);
  ellipse(width / 2, height - 300, 2000, 500);

  fill(76, 77, 77);
  rect(-40, height - 300, width + 40, 300);

  fill(163, 165, 164);
  rect(-40, height - 320, width + 40, 95);

  fill(131, 131, 131);
  rect(-40, height - 225, width + 40, 10);

  fill(250, 232, 28);
  rect(-40, height - 20, width + 40, 40);

  // billboard poles
  strokeWeight(20);
  stroke(80);
  line(200, height / 2 - 150, 200, height / 2 + 150);
  line(width - 250, height / 2 - 150, width - 250, height / 2 + 150);

  // billboard 1 placeholder
  fill(255);
  rect(50, height / 2 - 200, 300, 100);
  fill(30);
  textSize(28);
  text("BILLBOARD 1", 110, height / 2 - 140);

  // billboard 2 placeholder
  fill(255);
  rect(width - 400, height / 2 - 200, 300, 100);
  fill(30);
  text("BILLBOARD 2", width - 340, height / 2 - 140);

  strokeWeight(1);

  fill(243, 250, 68);
  ellipse(width / 2, height / 2 - 355, 60, 60);

  fill(220, 100, 100);
  textSize(50);
  text(score, width / 2 + 200, 50);
  text(int(timer / 120), width / 2, 50);
  text("highScore: " + highscore, 100, 50);

  if (playerX > width + 10 && level === 3) {
    level = 4;
    playerX = -10;
    enemySwitch = 2;
    timer = 5400;
  }

  if (playerX <= -20) {
    level = 2;
    playerX = width;
    enemySwitch = 2;
    enemyplacement();
  }

  if (playerY < height - 350) playerY = height - 350;
  if (playerY > height + 5) playerY = height;

  timer--;
  if (timer <= 0) {
    level = 10;
  }
}

// boss level
function bossLevel() {
  frameRate(120);
  timer--;

  enemySwitch = 0;

  background(10, 232, 250);

  fill(25, 157, 79);
  ellipse(width / 2, height - 300, 2000, 500);

  fill(76, 77, 77);
  rect(-40, height - 300, width + 40, 300);

  fill(163, 165, 164);
  rect(-40, height - 320, width + 40, 95);

  fill(131, 131, 131);
  rect(-40, height - 225, width + 40, 10);

  fill(250, 232, 28);
  rect(-40, height - 20, width + 40, 40);

  bossPosTimer++;

  if (bossTracker <= bossChallenge) {
    boss();
  }

  if (bossTracker > bossChallenge) {
    level = 5;
    bossTracker = 0;
  }

  fill(220, 100, 100);
  textSize(50);
  text("score: " + score, width / 2 + 200, 50);
  text("time: " + int(timer / 120), width / 2, 50);
  text("highScore: " + highscore, 100, 50);

  if (timer <= 0) {
    level = 10;
  }
}

// controls
function keyPressed() {
  if ((keyCode === ENTER || keyCode === RETURN) && level === 0) {
    level = 1;
    frameRate(120);
    timer = 3600;
    score = 0;
    playerX = -10;
    playerY = height - 300;
    enemyplacement();
    bosslocation();
    bossChallenge = int(random(30, 60));
  }

  if (key === "p" || key === "P") {
    paused = true;
  }

  if (key === "r" || key === "R") {
    paused = false;
  }

  if ((key == "d" || key == "D") && level > 0) {
    playerX += 40;
  }

  if ((key == "a" || key == "A") && level > 0) {
    playerX -= 40;
  }

  if ((key == "w" || key == "W") && level > 0) {
    playerY -= 10;
  }

  if ((key == "s" || key == "S") && level > 0) {
    playerY += 10;
  }

  if ((keyCode === ENTER || keyCode === RETURN) && level === 5) {
    level = 0;
    playerX = -10;
    playerY = height - 300;
    score = 0;
  }

  if ((keyCode === ENTER || keyCode === RETURN) && level === 10) {
    score = 0;
    level = 0;
    playerX = -10;
    playerY = height - 300;
  }
}

// player
function player() {
  rectMode(CENTER);

  fill(76, 125, 209);
  rect(playerX, playerY + 20, 10, 35);

  fill(25, 152, 38);
  rect(playerX, playerY, 20, 30);

  fill(252, 218, 176);
  ellipse(playerX, playerY - 25, 20, 20);

  if (mouseIsPressed && mouseButton == LEFT) {
    stroke(255, 80, 80);
    strokeWeight(5);
    line(playerX, playerY, mouseX, mouseY);
  }

  stroke(0);
}

// enemy placement
function enemyplacement() {
  for (let i = 0; i < enemyX.length; i++) {
    enemyX[i] = random(width / 2, width);
    enemyY[i] = random(height / 2, height - 50);
  }
}

// create enemies
function creatingEnemys() {
  if (enemySwitch === 2) {
    enemyplacement();
  }

  rectMode(CENTER);

  for (let c = 0; c < enemyX.length; c++) {
    fill(150, 147, 160);
    ellipse(enemyX[c], enemyY[c], 50, 20);
    arc(enemyX[c], enemyY[c], 25, 30, PI, TWO_PI);
    fill(100, 150, 200);
    arc(enemyX[c], enemyY[c], 15, 20, PI, TWO_PI);

    addToElements(enemyX);

    if (mouseIsPressed && mouseButton === LEFT) {
      if (
        isInsideArea(
          mouseX,
          mouseY,
          enemyX[c] - 10,
          enemyX[c] + 10,
          enemyY[c] - 10,
          enemyY[c] + 10,
        )
      ) {
        enemyX[c] = random(width, width + 50);
        enemyY[c] = random(100, height - 100);
        score += 100;
        hitCounter++;
      }
    }

    if (
      isInsideAreaAttack(
        enemyX[c],
        enemyY[c],
        playerX - 20,
        playerX + 20,
        playerY - 20,
        playerY + 20,
      ) &&
      attackNumber < 1
    ) {
      score -= 50;
      attackNumber++;
      playerX += random(-10, 0);
      enemyX[c] = random(width + 10, width + 80);
    }

    if (hitCounter >= 25) {
      enemyX[c] = -255;
      enemyY[c] = -255;
    }
  }

  attackNumber = 0;
}

// small enemy movement
function addToElements(enemy) {
  for (let i = 0; i < enemy.length; i++) {
    enemy[i] -= random(0, 0.25);
  }
}

// boss location
function bosslocation() {
  for (let i = 0; i < bossX.length; i++) {
    bossX[i] = random(40, width - 60);
  }
  for (let i = 0; i < bossY.length; i++) {
    bossY[i] = random(50, height / 2);
  }
}

// boss
function boss() {
  addToElementsBoss(bossX);

  bossLaserX = int(playerX + random(0, 100));
  bossLaserY = int(playerY + random(0, 100));

  if (bossPosTimer % 360 === 0) {
    r = int(random(bossX.length));
    q = int(random(bossY.length));
  }

  fill(150, 147, 160);
  ellipse(bossX[r], bossY[q], 400, 100);
  arc(bossX[r], bossY[q], 230, 190, PI, TWO_PI);

  fill(105, 216, 242);
  arc(bossX[r], bossY[q], 180, 170, PI, TWO_PI);

  if (bossPosTimer % 120 === 0) {
    strokeWeight(10);
    stroke(240, 100, 100);
    line(bossX[r], bossY[q], bossLaserX, bossLaserY);
  }

  if (
    isInsideArea(
      bossLaserX,
      bossLaserY,
      playerX - 10,
      playerX + 10,
      playerY - 10,
      playerY + 10,
    )
  ) {
    score -= 50;
  }

  stroke(0);
}

// boss movement
function addToElementsBoss(bossArr) {
  for (let i = 0; i < bossArr.length - 1; i++) {
    bossArr[i] -= random(-2, 2);
  }
}

// shooting boss
function mouseReleased() {
  if (
    mouseButton === LEFT &&
    isInsideArea(
      mouseX,
      mouseY,
      bossX[r] - 40,
      bossX[r] + 40,
      bossY[q] - 40,
      bossY[q] + 40,
    ) &&
    level === 4
  ) {
    score += 100;
    bossTracker++;
  }
}

// win screen
function winScreen() {
  background(204);
  fill(34, 134, 131);
  textSize(50);
  text("You Won!!!", width / 2 - 100, height / 2 - 50);
  text("Your score: " + score, width / 2 - 100, height / 2 + 25);
  text("Press Enter to return to main menu", width / 2 - 250, height / 2 + 100);

  if (score > highscore) highscore = score;
}

// game over
function gameoverScreen() {
  background(0);
  fill(200, 50, 80);
  textSize(75);
  text("GAME OVER, YOU LOST.", 100, height / 2 - 50);
  textSize(50);
  text("Press Enter to return to home screen", 100, height / 2 + 40);

  if (score > highscore) highscore = score;
}
