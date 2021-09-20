import "./style.scss";
import { createScene } from "./src/scene";

const highscore = document.querySelector<HTMLDivElement>("#highscore");
const app = document.querySelector<HTMLDivElement>("#app");
const element = document.querySelector<HTMLCanvasElement>("#element");
const button = document.querySelector<HTMLButtonElement>("#startbutton");

button?.addEventListener("click", () => {
  console.log("zo");
  app?.classList.remove("d-none");
  highscore?.classList.add("d-none");
  button?.classList.add("d-none");
  if (element) {
    createScene(element);
  }
});
