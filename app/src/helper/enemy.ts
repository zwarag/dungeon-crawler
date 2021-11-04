// placeholder enemies
export const ENEMY_TYPE_LIST = ['ZOMBIE', 'WARROK', 'VAMPIRE'] as const;
export type ENEMY = typeof ENEMY_TYPE_LIST[number];
