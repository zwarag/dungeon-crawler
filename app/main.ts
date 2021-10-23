import "./styles/main.scss";
import { initDom } from "./src/dom-controller";
import { initHighscore, sortHighscore } from "./src/highscore-controller";
import highscoreData from "./public/highscore/highscore.json";
import "three/examples/fonts/helvetiker_regular.typeface.json";

initDom();
sortHighscore(highscoreData);
initHighscore(highscoreData);

// startGame();
