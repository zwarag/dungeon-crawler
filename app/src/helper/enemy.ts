// The order of the enemies needs to be the same as in the enemies.json file
export const ENEMY_TYPE_LIST = [
  'ZOMBIE',
  'SKELETONZOMBIE',
  'VAMPIRE',
  'WARROK',
] as const;
export type ENEMY = typeof ENEMY_TYPE_LIST[number];
