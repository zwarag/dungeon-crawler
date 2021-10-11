import "./style.scss";
import { Game } from "./src/game";

const app = document.querySelector<HTMLDivElement>("#app");
const highscore = document.querySelector<HTMLDivElement>("#highscore");
const startScreen = document.querySelector<HTMLDivElement>("#start-screen");
const element = document.querySelector<HTMLCanvasElement>("#element");
const startButton = document.querySelector<HTMLButtonElement>("#startbutton");
const highscoreButton =
  document.querySelector<HTMLButtonElement>("#highscoreButton");
const backButton = document.querySelector<HTMLButtonElement>("#backbutton");

function startGame() {
  app?.classList.remove("d-none");
  highscore?.classList.add("d-none");
  startButton?.classList.add("d-none");
  highscoreButton?.classList.add("d-none");
  if (element) {
    new Game(element);
  }
}

function displayHighscore() {
  startScreen?.classList.add("d-none");
  highscore?.classList.remove("d-none");
}

function backToStartScreen() {
  startScreen?.classList.remove("d-none");
  highscore?.classList.add("d-none");
}

startButton?.addEventListener("click", startGame);
highscoreButton?.addEventListener("click", displayHighscore);
backButton?.addEventListener("click", backToStartScreen);

// startGame();
