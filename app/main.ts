import './styles/main.scss';
import { _startGame, initDom } from './src/dom-controller';
import { initHighscore } from './src/highscore-controller';
import highscoreData from './public/highscore/highscore.json';
import 'three/examples/fonts/helvetiker_regular.typeface.json';

initDom();
initHighscore(highscoreData);
// await _startGame();
