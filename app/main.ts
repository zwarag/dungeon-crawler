import "./styles/style.scss";
import { initDom } from "./src/dom-controller";
import { initHighscore, sortHighscore } from "./src/highscore-controller";
import highscoreData from "./public/highscore/highscore.json";

initDom();
sortHighscore(highscoreData);
initHighscore(highscoreData);

// startGame();
