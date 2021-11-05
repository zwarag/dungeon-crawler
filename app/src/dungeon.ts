import { randomRange } from './helper/random';
import { ELEMENTS } from './helper/elements';
import { PROPERTIES } from './helper/const';
import { Grid } from './helper/type';

class Dungeon {
  grid: Grid;
  firstRoom: Room;
  rooms: Room[];

  constructor() {
    this.grid = this.createGrid();
    this.firstRoom = new Room();
    this.firstRoom.start = true;
    this.rooms = [];
    this.rooms.push(this.firstRoom);
    this.placeRoom(this.grid, this.firstRoom);
    this.createRoomsFromSeed(this.grid, this.firstRoom);
    this.rooms[this.rooms.length - 1].end = true;
  }

  placeRoom(grid: Grid, room: Room): void {
    for (let index_z = room.z; index_z < room.z + room.height; index_z++) {
      for (let index_x = room.x; index_x < room.x + room.width; index_x++) {
        // check if the selected cell is a border cell, if so, place the wall
        if (
          index_z == room.z ||
          index_z == room.z + room.height - 1 ||
          index_x == room.x ||
          index_x == room.x + room.width - 1
        ) {
          grid[index_z][index_x] = room.id;
        }

        if (room.doorx && room.doorz) {
          grid[room.doorz][room.doorx] = ELEMENTS.DOOR;
        }
      }
    }
  }

  createRoomsFromSeed(grid: Grid, room: Room): void {
    // generate room values for each edge of the seed room
    const roomValues: Room[] = [];

    const north = new Room();
    //dont get confused about the height and width property when declaring a room.

    //the x,y,height and width we use from now on are the ones
    //we pass in the initial function declaration createRoomsFromSeed()
    north.x = randomRange(room.x, room.x + room.width - 3);
    north.z = room.z - north.height - 1;
    north.doorx = randomRange(
      north.x + 1,
      Math.min(north.x + north.width, room.x + room.width) - 2
    );
    north.doorz = room.z - 1;
    north.id = ELEMENTS.WALL;
    roomValues.push(north);

    const east = new Room();
    east.x = room.x + room.width + 1;
    east.z = randomRange(room.z, room.height + room.z - 3);
    east.doorx = east.x - 1;
    east.doorz = randomRange(
      east.z + 1,
      Math.min(east.z + east.height, room.z + room.height) - 2
    );
    east.id = ELEMENTS.WALL;
    roomValues.push(east);

    const south = new Room();
    south.x = randomRange(room.x, room.width + room.x - 3);
    south.z = room.z + room.height + 1;
    south.doorx = randomRange(
      south.x + 1,
      Math.min(south.x + south.width, room.x + room.width) - 2
    );
    south.doorz = room.z + room.height;
    south.id = ELEMENTS.WALL;
    roomValues.push(south);

    const west = new Room();
    west.x = room.x - west.width - 1;
    west.z = randomRange(room.z, room.height + room.z - 3);
    west.doorx = room.x - 1;
    west.doorz = randomRange(
      west.z + 1,
      Math.min(west.z + west.height, room.z + room.height) - 2
    );
    west.id = ELEMENTS.WALL;
    roomValues.push(west);

    const placedRooms: Room[] = [];
    roomValues.forEach((room) => {
      if (
        this.isValidRoomPlacement(grid, room) &&
        this.rooms.length < PROPERTIES.MAX_ROOMS
      ) {
        // place room
        this.placeRoom(grid, room);
        // need placed room values for the next seeds
        placedRooms.push(room);
        this.rooms.push(room);
      }
    });
    this.firstRoom.seeded = true;
    placedRooms.forEach((room) => {
      if (!room.seeded) {
        this.createRoomsFromSeed(grid, room);
      }
    });

    placedRooms.forEach((x) => {
      this.setHallways(x, grid);
    });
  }

  setHallways(room: Room, grid: Grid): void {
    // switch walls and empty space to generate a hallway between two rooms
    if (room.doorx != undefined && room.doorz != undefined) {
      [
        grid[room.doorz + 1][room.doorx],
        grid[room.doorz][room.doorx - 1],
        grid[room.doorz - 1][room.doorx],
        grid[room.doorz][room.doorx + 1],
      ] = [
        grid[room.doorz][room.doorx + 1],
        grid[room.doorz - 1][room.doorx],
        grid[room.doorz][room.doorx + 1],
        grid[room.doorz - 1][room.doorx],
      ];
    }
  }

  isValidRoomPlacement(grid: Grid, room: Room): boolean {
    // check if on the edge of or outside of the grid
    if (room.z < 1 || room.z + room.height > grid.length - 1) {
      return false;
    }
    if (room.x < 1 || room.x + room.width > grid[0].length - 1) {
      return false;
    }

    // here you go from y-1 to y+height+1 and check id they are any floors
    for (
      let index_z = room.z - 1;
      index_z < room.z + room.height + 1;
      index_z++
    ) {
      for (
        let index_x = room.x - 1;
        index_x < room.x + room.width + 1;
        index_x++
      ) {
        if (grid[index_z][index_x] !== ELEMENTS.AIR) {
          return false;
        }
      }
    }
    // all grid cells are clear
    return true;
  }

  createGrid(): Grid {
    // 1. make a grid of 'empty' cells
    const grid: Grid = [];
    for (let index = 0; index < PROPERTIES.GRID_HEIGHT; index++) {
      grid.push([]);
      for (let index_ = 0; index_ < PROPERTIES.GRID_WIDTH; index_++) {
        grid[index].push(ELEMENTS.AIR);
      }
    }
    return grid;
  }

  printDungeon(): void {
    for (const element of this.grid) {
      console.log(element.join(' '));
    }
  }
}

class Room {
  x: number;
  z: number;
  height: number;
  width: number;
  id: string = ELEMENTS.WALL;
  seeded = false;
  doorx?: number;
  doorz?: number;
  enemyChance = 0.1;
  _start = false;
  _end = false;

  constructor() {
    this.height = randomRange(PROPERTIES.MIN, PROPERTIES.MAX);
    this.width = randomRange(PROPERTIES.MIN, PROPERTIES.MAX);
    this.x = randomRange(1, PROPERTIES.GRID_WIDTH - this.width);
    this.z = randomRange(1, PROPERTIES.GRID_HEIGHT - this.height);
  }

  set end(endBool: boolean) {
    this._end = endBool;
    this.enemyChance = 0.2;
  }

  set start(startBool: boolean) {
    this._start = startBool;
    this.enemyChance = 0;
  }
}

export { Dungeon };
