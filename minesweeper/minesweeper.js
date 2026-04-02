let difficulty = "easy";
let bombs;

let board;
let cleanCells;

let rows, cols;

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

  for (let row = 0; row < board.length; row++) {
    console.table(board);
  }
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
