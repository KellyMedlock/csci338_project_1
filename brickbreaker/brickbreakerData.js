// data.js
let playerName = "";

function getPlayerName() {
  playerName = document.querySelector(".playerName").value;
  if (playerName.trim() === "") {
    // Set a default name if
    // none provided
    playerName = "Anonymous";
  }
}

function startGame() {
  getPlayerName();
  document.querySelector(".startScreen").style.display = "none";
  document.querySelector(".gameScreen").style.display = "block";
  Text.draw(`Hello, ${playerName}!
                       Click to play!`);
  canvas.removeEventListener("click", startGame);
  canvas.addEventListener("click", x);
}

document.querySelector(".startButton").addEventListener("click", startGame);
