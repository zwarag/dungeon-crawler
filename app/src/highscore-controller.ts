import { highscoreItem } from "./helper/type";
import {
  highscoreElementFloors,
  highscoreElementNames,
  highscoreElementTimes,
} from "./helper/const";

export class HighscoreController {
  constructor(highscoreJson: highscoreItem[]) {
    this._sortHighscore(highscoreJson);
    this._initHighscore(highscoreJson);
  }

  private _sortHighscore(highscoreData: highscoreItem[]) {
    highscoreData.sort((a: highscoreItem, b: highscoreItem): number => {
      if (a.floor === b.floor) {
        return a.time > b.time ? -1 : 1;
      }
      return a.floor > b.floor ? -1 : 1;
    });
  }

  private _initHighscore(highscoreData: highscoreItem[]) {
    const data: highscoreItem[] = [];
    highscoreData.map((e) => data.push(e));
    data.forEach((a, b) => {
      highscoreElementNames[b]!.innerHTML = a.name;
      highscoreElementFloors[b]!.innerHTML = a.floor.toString();
      highscoreElementTimes[b]!.innerHTML = a.time.toString();
    });
  }

  public addToHighscore(player: highscoreItem, highscoreData: highscoreItem[]) {
    highscoreData.push(player);
    this._sortHighscore(highscoreData);
    if (highscoreData.length > 10) {
      console.log("before pop", highscoreData);
      highscoreData.pop();
      console.log("after pop", highscoreData);
    }
    localStorage.setItem("myStorage", JSON.stringify(highscoreData));
    this._initHighscore(highscoreData);
  }
}
