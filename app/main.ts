import "./styles/style.scss";
// import { Game } from "./src/game";
// import { HTMLELEMENTS } from "./src/helper/const";
// import {highscoreItem} from './src/helper/type';
// import {highscoreElementFloors, highscoreElementNames, highscoreElementTimes, HTMLELEMENTS} from './src/helper/const';
// import highscoreJson from './public/highscore/highscore.json';
// import {Game} from './src/game';
import { DomController } from "./src/dom-controller";
import { HighscoreController } from "./src/highscore-controller";
import highscoreJson from "./public/highscore/highscore.json";
import { highscoreItem } from "./src/helper/type";

// function startGame() {
//     HTMLELEMENTS.app?.classList.remove('d-none');
//     HTMLELEMENTS.startScreen?.classList.add('d-none');
//     HTMLELEMENTS.highscore?.classList.add('d-none');
//     HTMLELEMENTS.nameInput?.classList.add('d-none');
//     if (HTMLELEMENTS.element) {
//         new Game(HTMLELEMENTS.element);
//     }
// }
//
// function displayNameInput() {
//     HTMLELEMENTS.startScreen?.classList.add('d-none');
//     HTMLELEMENTS.highscore?.classList.add('d-none');
//     HTMLELEMENTS.nameInput?.classList.remove('d-none');
// }
//
// function displayHighscore() {
//     HTMLELEMENTS.startScreen?.classList.add('d-none');
//     HTMLELEMENTS.highscore?.classList.remove('d-none');
//     HTMLELEMENTS.highscoreBackButton?.classList.remove('d-none');
// }
//
// function backToStartScreen() {
//     if (!HTMLELEMENTS.app?.classList.contains('d-none')) {
//         exitGame();
//         HTMLELEMENTS.overlay?.classList.add('d-none');
//         HTMLELEMENTS.app?.classList.add('d-none');
//         HTMLELEMENTS.highscore?.classList.remove('d-none');
//     } else if (!HTMLELEMENTS.highscore?.classList.contains('d-none')) {
//         HTMLELEMENTS.highscore?.classList.add('d-none');
//         HTMLELEMENTS.startScreen?.classList.remove('d-none');
//     } else if (!HTMLELEMENTS.nameInput?.classList.contains('d-none')) {
//         HTMLELEMENTS.nameInput?.classList.add('d-none');
//         HTMLELEMENTS.startScreen?.classList.remove('d-none');
//     }
// }
//
// function displayExitOverlay() {
//     //TODO: logic to freeze game
//     if (!HTMLELEMENTS.app?.classList.contains('d-none')) {
//         if (HTMLELEMENTS.element) {
//             HTMLELEMENTS.element.style.opacity = '80%';
//             HTMLELEMENTS.overlay?.classList.remove('d-none');
//         }
//     }
// }
//
// function exitGame() {
//     //TODO: some logic to end the game (i.e. destroy scene, create highscore, etc)
// }
//
// function continueGame() {
//     //TODO: logic to "unfreeze" game
//     HTMLELEMENTS.overlay?.classList.add('d-none');
//     if (HTMLELEMENTS.element) {
//         HTMLELEMENTS.element.style.opacity = '100%';
//     }
// }
//
// function getPlayerName() {
//     console.log('inside getPlayerName', HTMLELEMENTS.formInput?.value);
//     return HTMLELEMENTS.formInput?.value;
// }
//
// function enableButton() {
//     if (
//         HTMLELEMENTS.nameInputOkButton &&
//         HTMLELEMENTS.formInput?.value !== undefined
//     ) {
//         if (HTMLELEMENTS.formInput?.value.length >= 1) {
//             HTMLELEMENTS.nameInputOkButton.disabled = false;
//         } else {
//             HTMLELEMENTS.nameInputOkButton.disabled = true;
//         }
//     }
// }
//
// HTMLELEMENTS.startButton?.addEventListener('click', displayNameInput);
// HTMLELEMENTS.highscoreButton?.addEventListener('click', displayHighscore);
// HTMLELEMENTS.highscoreBackButton?.addEventListener('click', backToStartScreen);
// HTMLELEMENTS.exitButton?.addEventListener('click', backToStartScreen);
// HTMLELEMENTS.continueButton?.addEventListener('click', continueGame);
// HTMLELEMENTS.nameInputBackButton?.addEventListener('click', backToStartScreen);
// HTMLELEMENTS.nameInputOkButton?.addEventListener('click', startGame);
// HTMLELEMENTS.formInput?.addEventListener('input', enableButton);
// document.addEventListener('keydown', (event) => {
//     if (event.key === 'Escape') {
//         displayExitOverlay();
//     }
// });

// function sortHighscore(highscoreData: highscoreItem[]) {
//     highscoreData.sort((a: highscoreItem, b: highscoreItem): number => {
//         if (a.floor === b.floor) {
//             return a.time > b.time ? -1 : 1;
//         }
//         return a.floor > b.floor ? -1 : 1;
//     });
// }
//
// function initHighscore(highscoreData: highscoreItem[]) {
//     const data: highscoreItem[] = [];
//     highscoreData.map((e) => data.push(e));
//     data.forEach((a, b) => {
//         highscoreElementNames[b]!.innerHTML = a.name;
//         highscoreElementFloors[b]!.innerHTML = a.floor;
//         highscoreElementTimes[b]!.innerHTML = a.time;
//     });
// }
//
//
// function updateHighscore() {
//     //
//
// }
//
// sortHighscore(highscoreJson);
// initHighscore(highscoreJson);

function initDom() {
  new DomController();
}

const highscoreController = new HighscoreController(highscoreJson);

function initHighscore() {
  return highscoreController;
}

class Player {
  createNewPlayer() {
    // return { name: "me", floor: Math.floor(Math.random() * 10) + 1, time: 0 };
    return { name: "me", floor: 100, time: 0 };
  }
}

const player = new Player();

initDom();
initHighscore();

//
// const addBtn = document.querySelector<HTMLButtonElement>("#btn");
// addBtn?.addEventListener("click", () => {
//   highscoreController.addToHighscore(player.createNewPlayer(), highscoreJson);
// });
// startGame();
