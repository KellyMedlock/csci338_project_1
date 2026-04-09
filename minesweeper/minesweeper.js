let difficulty = "easy";
let gameOver = false;
let bombs;

let board;
let cleanCells;
let revealedCount = 0;

let rows, cols;

let revealed, flagged;

let flagsPlaced = 0;

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function createBoard(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function buildBoard() {
  if (difficulty == "easy") {
    rows = 8;
    cols = 10;
    cleanCells = 70;
  } else if (difficulty == "medium") {
    rows = 14;
    cols = 18;
    cleanCells = 212;
  } else if (difficulty == "hard") {
    rows = 20;
    cols = 24;
    cleanCells = 381;
  }

  board = createBoard(rows, cols);

  revealed = Array.from({ length: rows }, () => Array(cols).fill(false));
  flagged = Array.from({ length: rows }, () => Array(cols).fill(false));
  placeBombs();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] !== "X") {
        let count = 0;

        for (let [dx, dy] of directions) {
          let x = i + dx;
          let y = j + dy;

          if (x >= 0 && x < rows && y >= 0 && y < cols) {
            if (board[x][y] === "X") {
              count++;
            }
          }
        }

        board[i][j] = count;
      }
    }
  }

  console.table(board);
}

function placeBombs() {
  if (difficulty == "easy") {
    bombs = 10;
  } else if (difficulty == "medium") {
    bombs = 40;
  } else if (difficulty == "hard") {
    bombs = 99;
  }

  let x;
  let y;
  let placed = false;

  for (let i = 0; i < bombs; i++) {
    x = Math.floor(Math.random() * rows);
    y = Math.floor(Math.random() * cols);
    while (placed === false) {
      if (board[x][y] === 0) {
        placed = true;
        board[x][y] = "X";
      } else {
        x = Math.floor(Math.random() * rows);
        y = Math.floor(Math.random() * cols);
      }
    }
    placed = false;
  }
}

function revealAllBombs() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] === "X") {
        const button = document.querySelector(
          `[data-row="${i}"][data-col="${j}"]`,
        );

        if (button) {
          button.textContent = "💣";
          button.style.backgroundColor = "red";
        }
      }
    }
  }
}

function floodFill(row, col) {
  if (row < 0 || row >= rows || col < 0 || col >= cols) return;

  if (revealed[row][col]) return;

  revealed[row][col] = true;

  const value = board[row][col];

  const button = document.querySelector(
    `[data-row="${row}"][data-col="${col}"]`,
  );

  if (!button) {
    return;
  }

  button.disabled = true;

  if (value === "X") return;

  button.textContent = value;
  revealedCount++;

  if (revealedCount === cleanCells) {
    gameOver = true;
    alert("You Win! 🎉");
    revealAllBombs();
    return;
  }

  if (value !== 0) {
    return;
  }

  for (let [dx, dy] of directions) {
    floodFill(row + dx, col + dy);
  }
}

function handleClick(event) {
  if (gameOver) return;
  const button = event.target;

  const row = parseInt(button.dataset.row);
  const col = parseInt(button.dataset.col);

  if (flagged[row][col]) return;

  const value = board[row][col];

  if (value === "X") {
    button.textContent = "💣";
    button.style.backgroundColor = "red";
    gameOver = true;
    revealAllBombs();
    alert("Game Over!");

    return;
  }
  floodFill(row, col);
}

function handleRightClick(event) {
  if (gameOver) return;
  event.preventDefault();

  const button = event.target;

  const row = parseInt(button.dataset.row);
  const col = parseInt(button.dataset.col);

  if (revealed[row][col]) return;

  if (!flagged[row][col]) {
    if (flagsPlaced >= bombs) return;

    flagged[row][col] = true;
    button.textContent = "🚩";
    flagsPlaced++;
  } else {
    flagged[row][col] = false;
    button.textContent = "";
    flagsPlaced--;
  }
}

//const flagsLeft = bombs - flagsPlaced;
//document.getElementById("flagCount").textContent = flagsLeft;
function renderBoard() {
  const boardElement = document.getElementById("board");

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const button = document.createElement("button");
      button.dataset.row = i;
      button.dataset.col = j;

      button.addEventListener("click", handleClick);
      button.addEventListener("contextmenu", handleRightClick);

      boardElement.appendChild(button);
    }

    boardElement.appendChild(document.createElement("br"));
  }
}

function newGame() {
  gameOver = false;
  revealedCount = 0;
  flagsPlaced = 0;
  revealed = new Array();
  flagged = new Array();

  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";

  buildBoard();
  renderBoard();
}

buildBoard();
renderBoard();
document.getElementById("newGameBtn").addEventListener("click", newGame);
document.querySelectorAll(".difficulty button").forEach((button) => {
  button.addEventListener("click", () => {
    difficulty = button.dataset.difficulty;
    newGame();
  });
});
