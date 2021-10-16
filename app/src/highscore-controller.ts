import { highscoreItem } from "./helper/type";
import { HIGHSCOREELEMENTS } from "./helper/const";

export class HighscoreController {
  highscore: highscoreItem[] = [
    {
      name: "aa",
      floor: "1",
      time: "11:25:30",
    },
    {
      name: "bb",
      floor: "4",
      time: "10:59:12",
    },
    {
      name: "ee",
      floor: "1",
      time: "10:59:12",
    },
    {
      name: "cc",
      floor: "3",
      time: "10",
    },
    {
      name: "dd",
      floor: "2",
      time: "10",
    },
  ];

  sortHighscore(array: any) {
    array.sort((a: highscoreItem, b: highscoreItem): number => {
      if (a.floor === b.floor) {
        return a.time > b.time ? -1 : 1;
      }
      return a.floor > b.floor ? -1 : 1;
    });
  }

  setHighscore() {
    const array: any = [];
    HIGHSCOREELEMENTS.forEach((e) => array.push(e?.innerHTML));
    this.sortHighscore(array);
  }
}
