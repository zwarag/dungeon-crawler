import {
  GAME_NAME,
  highscoreElementFloors,
  highscoreElementNames,
  highscoreElementTimes,
} from './helper/const';
import { secToHMS } from './helper/time';
import { HighscoreItem } from './helper/type';

function sortHighscore(highscoreData: HighscoreItem[]): void {
  highscoreData.sort((a: HighscoreItem, b: HighscoreItem): number => {
    if (a.floor === b.floor) {
      return a.time > b.time ? -1 : 1;
    }
    return a.floor > b.floor ? -1 : 1;
  });
}

function loadFromLocalStorage(): HighscoreItem[] {
  return JSON.parse(localStorage.getItem(GAME_NAME) ?? '[]');
}

/**
 * To be called once per runtime. Adds the saved highscoreData to the HTML.
 */
export function initHighscore(highscoreData: HighscoreItem[]): void {
  const ls = loadFromLocalStorage();
  const data: HighscoreItem[] = [];

  if (ls.length === 0) {
    // localstorage does not have any highscores, game has never been played on this browser
    highscoreData.map((dataPoint) => data.push(dataPoint));
    localStorage.setItem(GAME_NAME, JSON.stringify(highscoreData));
  } else {
    // localstorage has highscores
    data.push(...ls);
  }

  sortHighscore(ls);

  data.forEach((a, b) => {
    highscoreElementNames[b].innerHTML = a.name;
    highscoreElementFloors[b].innerHTML = a.floor.toString();
    highscoreElementTimes[b].innerHTML = secToHMS(a.time);
  });
}

export function addToHighscore(player: HighscoreItem): void {
  const ls = loadFromLocalStorage();
  ls.push(player);
  sortHighscore(ls);
  if (ls.length > 10) {
    ls.pop();
  }
  localStorage.setItem(GAME_NAME, JSON.stringify(ls));
  initHighscore(ls);
}
