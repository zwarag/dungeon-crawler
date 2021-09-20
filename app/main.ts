import { createScene } from "./src/scene";

const element = document.querySelector<HTMLCanvasElement>("element");

if (element) {
  createScene(element);
}
