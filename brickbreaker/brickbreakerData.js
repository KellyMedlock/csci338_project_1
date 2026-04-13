// brickbreakerData.js
let playerName = "";

function getPlayerName() {
  playerName = document.querySelector(".playerName").value;

  if (playerName.trim() === "") {
    playerName = "Anonymous";
  }
}

function startGame() {
  getPlayerName();

  document.querySelector(".startScreen").style.display = "none";
  document.querySelector(".gameScreen").style.display = "flex";

  requestAnimationFrame(() => {
    init();
    Text.draw(`Hello, ${playerName}! Click to play!`);
  });
}

document.querySelector(".startButton").addEventListener("click", startGame);
