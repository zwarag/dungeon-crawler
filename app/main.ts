import "./styles/style.scss";
import { Game } from "./src/game";

const app = document.querySelector<HTMLDivElement>("#app");
const highscore = document.querySelector<HTMLDivElement>("#highscore");
const startScreen = document.querySelector<HTMLDivElement>("#start-screen");
const element = document.querySelector<HTMLCanvasElement>("#element");
const startButton = document.querySelector<HTMLButtonElement>("#startbutton");
const highscoreButton =
  document.querySelector<HTMLButtonElement>("#highscoreButton");
const backButton = document.querySelector<HTMLButtonElement>("#backbutton");
const overlay = document.querySelector<HTMLDivElement>("#overlay");
const continueButton =
  document.querySelector<HTMLButtonElement>("#continueButton");
const exitButton = document.querySelector<HTMLButtonElement>("#exitButton");

function startGame() {
  app?.classList.remove("d-none");
  startScreen?.classList.add("d-none");
  highscore?.classList.add("d-none");
  if (element) {
    new Game(element);
  }
}

function displayHighscore() {
  startScreen?.classList.add("d-none");
  highscore?.classList.remove("d-none");
  backButton?.classList.remove("d-none");
}

function backToStartScreen() {
  if (!app?.classList.contains("d-none")) {
    exitGame();
    overlay?.classList.add("d-none");
    app?.classList.add("d-none");
  } else {
    highscore?.classList.add("d-none");
  }
  startScreen?.classList.remove("d-none");
}

function displayExitOverlay() {
  //TODO: logic to freeze game
  if (!app?.classList.contains("d-none")) {
    if (element) {
      element.style.opacity = "80%";
      overlay?.classList.remove("d-none");
    }
  }
}

function exitGame() {
  //TODO: some logic to end the game (i.e. destroy scene, create highscore, etc)
}

function continueGame() {
  //TODO: logic to "unfreeze" game
  overlay?.classList.add("d-none");
  if (element) {
    element.style.opacity = "100%";
  }
}

startButton?.addEventListener("click", startGame);
highscoreButton?.addEventListener("click", displayHighscore);
backButton?.addEventListener("click", backToStartScreen);
exitButton?.addEventListener("click", backToStartScreen);
continueButton?.addEventListener("click", continueGame);
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    displayExitOverlay();
  }
});

// startGame();
