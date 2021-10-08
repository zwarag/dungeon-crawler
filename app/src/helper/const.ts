export const GLOBAL_Y = 0;
export const GLOBAL_GROUND_Y = -0.5;

// grid settings used for the dungeon generation
const GRID_HEIGHT = 40;
const GRID_WIDTH = 40;
const MAX_ROOMS = 15;
const ROOM_SIZE_RANGE = [5, 8];
const [ROOM_SIZE_MIN, ROOM_SIZE_MAX] = ROOM_SIZE_RANGE;
export const PROPERTIES = {GRID_HEIGHT, GRID_WIDTH, MAX_ROOMS, ROOM_SIZE_RANGE, MIN: ROOM_SIZE_MIN, MAX: ROOM_SIZE_MAX};
