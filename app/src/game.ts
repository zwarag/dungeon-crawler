import {GLOBAL_GROUND_Y, GLOBAL_Y, PROPERTIES} from "./helper/const";
import * as THREE from "three";
import { Material, MaterialParameters, Mesh, Vector3 } from "three";
import { Player } from "./player";
import { millisecondsToSeconds } from "./helper/time";
import { Dungeon } from "./dungeon";
import { ELEMENTS } from "./helper/grid-elements";
import { Enemy } from "./enemy";
import { AStarFinder } from "astar-typescript";
import { DIRECTION } from "./helper/direction";

export class Game {
  private _threejs: THREE.WebGLRenderer;
  private _camera: THREE.PerspectiveCamera;
  private _scene: THREE.Scene;
  private _previousRAF: number | null;
  private _player: Player;
  private _dungeon: Dungeon;
  private _goal: Mesh;
  private _enemies: Array<Enemy> = [];

  constructor(element: HTMLCanvasElement) {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
      canvas: element,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(
      document.body.scrollWidth,
      document.body.scrollHeight
    );

    window.addEventListener(
      "resize",
      () => {
        this._onWindowResize();
      },
      false
    );

    this._scene = new THREE.Scene();

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 100, 10);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.bias = -0.001;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = 100;
    directionalLight.shadow.camera.right = -100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    this._scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 4);
    this._scene.add(ambientLight);

    // Skybox
    const loader = new THREE.CubeTextureLoader();
    this._scene.background = loader.load([
      "./img/cocoa_ft_.jpg",
      "./img/cocoa_bk_.jpg",
      "./img/cocoa_up_.jpg",
      "./img/cocoa_dn_.jpg",
      "./img/cocoa_rt_.jpg",
      "./img/cocoa_lf_.jpg",
    ]);

    // Create the ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(
        PROPERTIES.GRID_WIDTH,
        PROPERTIES.GRID_HEIGHT,
        PROPERTIES.GRID_WIDTH,
        PROPERTIES.GRID_HEIGHT
      ),
      new THREE.MeshStandardMaterial({
        color: 0x202020,
        wireframe: true,
      })
    );
    ground.castShadow = false;
    ground.receiveShadow = true;
    ground.rotation.x = -Math.PI / 2;
    ground.position.setY(GLOBAL_GROUND_Y);
    this._scene.add(ground);

    // initialize the first dungeon
    this._dungeon = new Dungeon();
    this._addDungeonToScene();

    // place an object as placeholder in the end room (symbolizing a ladder or such)
    this._placeEndRoomObject();

    // eslint-disable-next-line unicorn/no-null
    this._previousRAF = null;

    // create a camera, which defines where we're looking at.
    this._camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // create the character
    this._player = new Player(this._camera);

    // set the character into the first room
    const playerX =
      this._dungeon.firstRoom.x +
      Math.floor(this._dungeon.firstRoom.width / 2) -
      PROPERTIES.GRID_WIDTH / 2 -
      0.5;
    const playerZ =
      this._dungeon.firstRoom.z +
      Math.floor(this._dungeon.firstRoom.height / 2) -
      PROPERTIES.GRID_WIDTH / 2 -
      0.5;
    this._player.Element.position.set(playerX, GLOBAL_Y, playerZ);
    this._scene.add(this._player.Element);

    // axes helper
    const axesHelper = new THREE.AxesHelper(10);
    this._scene.add(axesHelper);

    // position the camera
    this._camera.position.x = this._player.Element.position.x;
    this._camera.position.y = this._player.Element.position.y;
    this._camera.position.z = this._player.Element.position.z;
    this._camera.rotateY(-Math.PI / 2); // the camera needs to be turned by 90 degrees initially

    // placing enemies
    this._setEnemies();

    // Temporary Camera
    // TODO: this is only temporary and should be swaped out for the actual implementaiton of the camera
    // const controls = new OrbitControls(this._camera, this._threejs.domElement);
    // controls.target.set(0, 0, 0);
    // controls.update();

    this._requestAnimationFrame();
  }

  private _onWindowResize() {
    this._threejs.setSize(window.innerWidth, window.innerHeight);
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
  }

  private _requestAnimationFrame() {
    requestAnimationFrame((timeElapsedMS) => {
      if (this._previousRAF === null) {
        this._previousRAF = timeElapsedMS;
      }

      this._requestAnimationFrame();

      this._threejs.render(this._scene, this._camera);
      this._calculateNextState(timeElapsedMS - this._previousRAF);
      this._previousRAF = timeElapsedMS;

      // console.log("Time elapsed: " + timeElapsedMS)
      // if (0 < timeElapsedMS % 2000 && timeElapsedMS % 2000 < 20) {
      //     console.log("moving")
      //     this._activateEnemies()
      //     this._enemiesMoveOrAttack()
      // }
    });
  }

  private _calculateNextState(timeDeltaMS: number) {
    const timeDeltaS = millisecondsToSeconds(timeDeltaMS);
    this._player.update(timeDeltaS);
    this._handleCharacterMovement();
    this._handleCharacterAttacking();
  }

  private _handleCharacterMovement() {
    const currentPlayerPosition = new Vector3().copy(
      this._player.Element.position
    );
    const newPlayerPosition = this._player.getCharacterMovement();
    if (!newPlayerPosition.equals(currentPlayerPosition)) {
      // equals -> Wertevergleich, === -> objektvergleich
      if (this._checkFreeSpace(newPlayerPosition.x, newPlayerPosition.z)) {
        this._player.Element.position.set(...newPlayerPosition.toArray());
        this._camera.position.set(...newPlayerPosition.toArray());
        this._activateEnemies();
        this._enemiesMoveOrAttack();
      } else {
        this._player.speak("blocked");
      }
    }
  }

  private _handleCharacterAttacking() {
    if (this._player.attacks) {
      const playerPosition = this._player.Element.position;
      const playerViewDirection = this._player.direction;
      let enemyPosition: Vector3;
      switch (playerViewDirection) {
        case DIRECTION.NORTH:
          enemyPosition = new Vector3(
            playerPosition.x + 1,
            playerPosition.y,
            playerPosition.z
          );
          break;
        case DIRECTION.EAST:
          enemyPosition = new Vector3(
            playerPosition.x,
            playerPosition.y,
            playerPosition.z - 1
          );
          break;
        case DIRECTION.SOUTH:
          enemyPosition = new Vector3(
            playerPosition.x - 1,
            playerPosition.y,
            playerPosition.z
          );
          break;
        case DIRECTION.WEST:
          enemyPosition = new Vector3(
            playerPosition.x,
            playerPosition.y,
            playerPosition.z + 1
          );
          break;
      }

      const enemy = this._enemies
        .filter((value) => value.Element.position.equals(enemyPosition))
        .pop();
      const damage = this._player.attack();

      console.log(`PLAYER ATTACKED FOR ${damage} DAMAGE`);

      if (enemy !== undefined) {
        enemy.takeHit(damage);
        if (enemy.health <= 0) {
          this._player.increaseExperience(enemy.experience);
          this._enemies = this._enemies.filter((child) => child !== enemy);
          this._scene.remove(enemy.Element);
        }
      }
      this._enemiesMoveOrAttack();
    }
  }

  private _addDungeonToScene() {
    const textureLoader = new THREE.TextureLoader();
    const wallTexture = textureLoader.load("./img/wall.jpg");
    const wallGeometry = new THREE.BoxGeometry(1, 1.5, 1);
    const wallMaterial = new THREE.MeshBasicMaterial({
      map: wallTexture,
      opacity: 0.8,
      transparent: true,
    }); // img source: https://www.pinterest.at/pin/376402481328234967/
    for (let height = 0; height < this._dungeon.grid.length; height++) {
      for (let width = 0; width < this._dungeon.grid[height].length; width++) {
        if (this._dungeon.grid[height][width] == ELEMENTS.WALL) {
          const cube = new THREE.Mesh(wallGeometry, wallMaterial);
          cube.name = ELEMENTS.WALL;
          // offset by half the size of the grid, since 0,0,0 is in the center of it. Furthermore offset by 0.5, as otherwise the center of each box is used and not the corner.
          cube.position.set(
            width - (PROPERTIES.GRID_WIDTH / 2 - 0.5),
            GLOBAL_Y + 0.25,
            height - (PROPERTIES.GRID_HEIGHT / 2 - 0.5)
          );
          this._scene.add(cube);
        }
      }
    }
  }

  private _checkFreeSpace(x: number, z: number): boolean {
    const intersections = this._scene.children.filter(
      (value) => value.position.z === z && value.position.x === x
    );
    return intersections.length === 0;
  }

  private _placeEndRoomObject() {
    const endRoomX =
      this._dungeon.rooms[this._dungeon.rooms.length - 1].x +
      Math.floor(
        this._dungeon.rooms[this._dungeon.rooms.length - 1].width / 2
      ) -
      PROPERTIES.GRID_WIDTH / 2 -
      0.5;
    const endRoomZ =
      this._dungeon.rooms[this._dungeon.rooms.length - 1].z +
      Math.floor(
        this._dungeon.rooms[this._dungeon.rooms.length - 1].height / 2
      ) -
      PROPERTIES.GRID_WIDTH / 2 -
      0.5;
    const endObjectGeometry = new THREE.ConeGeometry(0.5, 4, 32);
    const endObjectMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const cone = new THREE.Mesh(endObjectGeometry, endObjectMaterial);
    cone.position.set(endRoomX, GLOBAL_Y, endRoomZ);
    cone.name = "GOAL";
    this._goal = cone;
    this._scene.add(cone);
  }

  private _setEnemies() {
    this._dungeon.rooms.forEach((room) => {
      if (!room.start) {
        for (let height = 1; height < room.height - 1; height++) {
          for (let width = 1; width < room.width - 1; width++) {
            if (Math.random() <= room.enemyChance) {
              const x = room.x + 1 + width - (PROPERTIES.GRID_WIDTH / 2 + 0.5);
              const z =
                room.z + 1 + height - (PROPERTIES.GRID_HEIGHT / 2 + 0.5);
              if (
                !(this._goal.position.x === x && this._goal.position.z === z)
              ) {
                const enemy = new Enemy(x, z);
                this._enemies.push(enemy);
                this._scene.add(enemy.Element);
              }
            }
          }
        }
      }
    });
  }

  private _constructAStarGrid(): number[][] {
    const grid: number[][] = [];
    for (let index = 0; index < PROPERTIES.GRID_HEIGHT; index++) {
      grid.push(new Array(PROPERTIES.GRID_WIDTH).fill(0));
    }

    const relevantElements = this._scene.children.filter((child) => {
      const items = [
        ELEMENTS.WALL.valueOf(),
        ELEMENTS.ENEMY.valueOf(),
        ELEMENTS.GOAL.valueOf(),
      ];
      return items.includes(child.name);
    });

    relevantElements.forEach((child) => {
      const x = Game._sceneToGrid(child.position.x);
      const z = Game._sceneToGrid(child.position.z);
      grid[z][x] = 1;
    });

    return grid;
  }

  private static _sceneToGrid(number_: number) {
    return Math.floor(number_ + PROPERTIES.GRID_HEIGHT / 2 + 0.5);
  }

  private static _gridToScene(number_: number) {
    return number_ - PROPERTIES.GRID_WIDTH / 2 - 0.5;
  }

  private _activateEnemies() {
    this._enemies.forEach((enemy) => {
      const distanceToPlayer = enemy.Element.position.manhattanDistanceTo(
        this._player.Element.position
      );
      if (distanceToPlayer <= enemy.awarenessRange) {
        enemy.active = true;
      } else if (distanceToPlayer >= enemy.awarenessRange * 1.5) {
        enemy.active = false; // allows the player to flee and for enemies to loose interest
      }
    });
  }

  private _enemiesMoveOrAttack() {
    const activeEnemies = this._enemies.filter((enemy) => enemy.active);

    activeEnemies.forEach((enemy) => {
      const playerPosition = {
        x: Game._sceneToGrid(this._player.Element.position.x),
        y: Game._sceneToGrid(this._player.Element.position.z),
      };
      const enemyPosition = {
        x: Game._sceneToGrid(enemy.Element.position.x),
        y: Game._sceneToGrid(enemy.Element.position.z),
      };
      const grid = this._constructAStarGrid();

      grid[enemyPosition.y][enemyPosition.x] = 0; // manipulates the grid to allow movement, otherwise the astar fails right away

      const aStarFinder = new AStarFinder({
        grid: { matrix: grid },
        diagonalAllowed: false,
        heuristic: "Manhattan",
        includeStartNode: false,
      });

      const path: number[][] = aStarFinder.findPath(
        enemyPosition,
        playerPosition
      );
      if (path.length > 0) {
        const nextStep: number[] = path[0];
        if (
          !(
            nextStep[0] === playerPosition.x && nextStep[1] === playerPosition.y
          )
        ) {
          // console.log("moved", enemy.Element)
          enemy.Element.position.set(
            Game._gridToScene(nextStep[0]),
            GLOBAL_Y,
            Game._gridToScene(nextStep[1])
          );
        } else {
          (enemy.Element.material as Material).setValues({
            color: Math.random() * 0xffffff,
          } as Partial<MaterialParameters>); // TODO remove later, just to visualize an enemy attacking
          const damage = enemy.attack();
          this._player.takeHit(damage);
          console.log("your health:", this._player.health);
          if (this._player.health <= 0) {
            console.log("YOU DIED");
            // this._player.die()
            // @Chrono666 / Matthias, death screen?
          }
        }
      }
    });
  }

  private _sceneToGridGridToSceneConversion() {
    const grid = this._constructAStarGrid();

    const geometry = new THREE.BoxGeometry(1, 3, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        console.log(i, j);
        if (grid[i][j] == 1) {
          const x = Game._gridToScene(j);
          const z = Game._gridToScene(i);

          const cube = new THREE.Mesh(geometry, material);
          cube.position.set(x, GLOBAL_Y, z);
          this._scene.add(cube);
        }
      }
    }
  }

  private _positionConversionCheck() {
    const scenePlayerPosition = this._player.Element.position.z;
    const gridPlayerPosition = Game._sceneToGrid(scenePlayerPosition);
    console.log("scene to grid", scenePlayerPosition, gridPlayerPosition);
    console.log("grid to scene", gridPlayerPosition, scenePlayerPosition);
  }
}

