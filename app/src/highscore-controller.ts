import { HighscoreItem } from "./helper/type";
import {
  highscoreElementFloors,
  highscoreElementNames,
  highscoreElementTimes,
} from "./helper/const";
import { secToHMS } from "./helper/time";
import { GAME_NAME } from './helper/const';

function sortHighscore(highscoreData: HighscoreItem[]): void {
  highscoreData.sort((a: HighscoreItem, b: HighscoreItem): number => {
    if (a.floor === b.floor) {
      return a.time > b.time ? -1 : 1;
    }
    return a.floor > b.floor ? -1 : 1;
  });
}

function loadFromLocalStoryge(): HighscoreItem[] {
  return JSON.parse(localStorage.getItem(GAME_NAME) ?? "[]")
}

/**
 * To be called once per runtime. Adds the saved highscoreData to the HTML.
 */
export function initHighscore(highscoreData: HighscoreItem[]): void {
  const ls = loadFromLocalStoryge();
  const data: HighscoreItem[] = [];

  if (ls.length === 0) { // localstorage does not have any highscores, game has never been played on this browser
    highscoreData.map((e) => data.push(e));
    localStorage.setItem(GAME_NAME, JSON.stringify(highscoreData));
  } else { // localstorage has highscores
    data.push(...ls)
  }

  sortHighscore(ls)

  data.forEach((a, b) => {
    (highscoreElementNames[b] as HTMLElement).innerHTML = a.name;
    (highscoreElementFloors[b] as HTMLElement).innerHTML = a.floor.toString();
    (highscoreElementTimes[b] as HTMLElement).innerHTML = secToHMS(a.time);
  });
}

export function addToHighscore(player: HighscoreItem): void {
  const ls = loadFromLocalStoryge();
  ls.push(player);
  sortHighscore(ls);
  if (ls.length > 10) {
    ls.pop();
  }
  localStorage.setItem(GAME_NAME, JSON.stringify(ls));
  initHighscore(ls);
}
