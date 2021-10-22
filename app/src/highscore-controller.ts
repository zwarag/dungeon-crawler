import { highscoreItem } from "./helper/type";
import {
  highscoreElementFloors,
  highscoreElementNames,
  highscoreElementTimes,
} from "./helper/const";
import { millisToHoursMinutesAndSeconds } from "./helper/time";

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
    highscoreElementNames[b]!.innerHTML = a.name;
    highscoreElementFloors[b]!.innerHTML = a.floor.toString();
    console.log(millisToHoursMinutesAndSeconds(a.time));
    highscoreElementTimes[b]!.innerHTML = millisToHoursMinutesAndSeconds(
      a.time
    );
  });
}

export function addToHighscore(
  player: highscoreItem,
  highscoreData: highscoreItem[]
): void {
  console.log(player);
  highscoreData.push(player);
  sortHighscore(highscoreData);
  if (highscoreData.length > 10) {
    highscoreData.pop();
  }
  localStorage.setItem("myStorage", JSON.stringify(highscoreData));
  initHighscore(highscoreData);
}
