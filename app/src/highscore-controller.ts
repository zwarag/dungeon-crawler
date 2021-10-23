import { highscoreItem } from "./helper/type";
import {
  highscoreElementFloors,
  highscoreElementNames,
  highscoreElementTimes,
} from "./helper/const";
import { secToHMS } from "./helper/time";

export function sortHighscore(highscoreData: highscoreItem[]): void {
  highscoreData.sort((a: highscoreItem, b: highscoreItem): number => {
    if (a.floor === b.floor) {
      return a.time > b.time ? -1 : 1;
    }
    return a.floor > b.floor ? -1 : 1;
  });
}

export function initHighscore(highscoreData: highscoreItem[]): void {
  const data: highscoreItem[] = [];
  highscoreData.map((e) => data.push(e));
  data.forEach((a, b) => {
    (highscoreElementNames[b] as HTMLElement).innerHTML = a.name;
    (highscoreElementFloors[b] as HTMLElement).innerHTML = a.floor.toString();
    (highscoreElementTimes[b] as HTMLElement).innerHTML = secToHMS(a.time);
  });
}

export function addToHighscore(
  player: highscoreItem,
  highscoreData: highscoreItem[]
): void {
  highscoreData.push(player);
  sortHighscore(highscoreData);
  if (highscoreData.length > 10) {
    highscoreData.pop();
  }
  localStorage.setItem("myStorage", JSON.stringify(highscoreData));
  initHighscore(highscoreData);
}
