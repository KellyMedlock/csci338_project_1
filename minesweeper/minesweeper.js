let difficulty = "hard";
let bombs;

let board;
let cleanCells;

let rows, cols;

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

buildBoard();
