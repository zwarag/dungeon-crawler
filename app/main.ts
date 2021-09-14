import { createScene } from "./src/scene";

const app = document.querySelector<HTMLDivElement>("#app");
const el = document.getElementById("el") as HTMLCanvasElement;

createScene(el);
