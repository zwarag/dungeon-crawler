export type Grid = string[][];

export type HighscoreItem = {
  name: string;
  floor: number;
  time: number;
};
export type Health = number;
export type Experience = number;
export type Damage = number;
export type Accuracy = number;
export type Range = number;
export type Model = {
  name: {
    health: number;
    damage: {
      min: number;
      max: number;
    };
    level?: number;
    accuracy: number;
    awarenessRange?: number;
    experience: number;
    level2experience: number;
    model: string;
    weight?: number;
  };
};
