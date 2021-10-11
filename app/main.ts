import "./style.scss";
import { Game } from "./src/game";

const highscore = document.querySelector<HTMLDivElement>("#highscore");
const app = document.querySelector<HTMLDivElement>("#app");
const element = document.querySelector<HTMLCanvasElement>("#element");
const button = document.querySelector<HTMLButtonElement>("#startbutton");

function startGame() {
  app?.classList.remove("d-none");
  highscore?.classList.add("d-none");
  button?.classList.add("d-none");
  if (element) {
    new Game(element);
  }
}

button?.addEventListener("click", startGame);

// startGame();
