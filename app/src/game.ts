import {
  GLOBAL_GROUND_Y,
  GLOBAL_Y,
  PLAYER_Y,
  PROPERTIES,
} from './helper/const';
import * as THREE from 'three';
import { AnimationMixer, Group, SpotLight, Vector3 } from 'three';
import { Player } from './player';
import { millisecondsToSeconds } from './helper/time';
import { Dungeon } from './dungeon';
import { ELEMENTS } from './helper/elements';
import { Enemy } from './enemy';
import { AStarFinder } from 'astar-typescript';
import { DIRECTION } from './helper/direction';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { DamageText } from './damage-text';
import { updateProgressBar } from './dom-controller';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ENEMY_TYPE_LIST } from './helper/enemy';
import { EnemyFileLoader } from './helper/enemy-file-loader';

export class Game {
  private _threejs: THREE.WebGLRenderer;
  private _camera: THREE.PerspectiveCamera;
  private _scene: THREE.Scene;
  private _previousRAF: number | null;
  private _player: Player;
  private _dungeon!: Dungeon;
  private _goal!: Group;
  private _enemies: Array<Enemy> = [];
  private _composer: EffectComposer;
  private _outlinePass: OutlinePass;
  private _animationMixers: AnimationMixer[] = new Set();
  private _clock: THREE.Clock;
  private _spotLight: SpotLight;
  private _stopAnimationFrame = false;
  _level = 1;

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
    this._clock = new THREE.Clock();

    window.addEventListener(
      'resize',
      () => {
        this._onWindowResize();
      },
      false
    );

    this._scene = new THREE.Scene();
    window._scene = this._scene;
    window._animationMixers = this._animationMixers;

    // Skybox
    const loader = new THREE.CubeTextureLoader();
    this._scene.background = loader.load([
      './img/cocoa_ft_.jpg',
      './img/cocoa_bk_.jpg',
      './img/cocoa_up_.jpg',
      './img/cocoa_dn_.jpg',
      './img/cocoa_rt_.jpg',
      './img/cocoa_lf_.jpg',
    ]);
    // this._scene.background = new THREE.Color("black")

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
    this._addDungeonToScene();

    // eslint-disable-next-line unicorn/no-null
    this._previousRAF = null;

    // create a camera, which defines where we're looking at.
    this._camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    this._camera.rotation.set(0, 15, 0);
    this._camera.position.y = 1;

    this._player = new Player();

    // set up composer and outline pass
    this._composer = new EffectComposer(this._threejs);

    const renderPass = new RenderPass(this._scene, this._camera);
    this._composer.addPass(renderPass);

    this._outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this._scene,
      this._camera,
      []
    );
    this._outlinePass.edgeStrength = 20;
    this._outlinePass.edgeGlow = 2;
    this._outlinePass.edgeThickness = 1;
    this._outlinePass.pulsePeriod = 2;
    this._composer.addPass(this._outlinePass);

    // axes helper
    const axesHelper = new THREE.AxesHelper(10);
    this._scene.add(axesHelper);

    // Spotlight symbolizing a torch carried by the player
    this._spotLight = new THREE.SpotLight(
      '#f9d97b',
      1,
      15,
      Math.PI / 2,
      0.5,
      1
    );
    this._spotLight.castShadow = true;
    this._camera.add(this._spotLight);
    this._spotLight.position.set(0, 0, 1);
    this._spotLight.target = this._camera;

    // Temporary Camera
    // TODO: this is only temporary and should be swaped out for the actual implementaiton of the camera
    // const controls = new OrbitControls(this._camera, this._threejs.domElement);
    // controls.target.set(0, 0, 0);
    // controls.update();

    updateProgressBar(100);
  }

  async _initPlayer() {
    await this._player._init();
    this._setPlayerPosition();
    this._scene.add(this._player.Element);
    this._player.Element.add(this._camera);
  }

  async _initGame(): Promise<void> {
    // place an object as placeholder in the end room (symbolizing a ladder or such)
    await this._placeEndRoomObject();
    // init the player
    await this._initPlayer();
    // placing enemies
    await this._setEnemies();
    this._requestAnimationFrame();
  }

  private _onWindowResize(): void {
    this._threejs.setSize(window.innerWidth, window.innerHeight);
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
  }

  private _requestAnimationFrame(): void {
    if (this._stopAnimationFrame) {
      return;
    }
    requestAnimationFrame((timeElapsedMS) => {
      if (this._previousRAF === null) {
        this._previousRAF = timeElapsedMS;
      }

      const delta = this._clock.getDelta();
      this._requestAnimationFrame();
      this._animationMixers.forEach((mixer) => {
        mixer.update(delta);
      });
      this._calculateNextState(timeElapsedMS - this._previousRAF);
      this._composer.render();
      this._previousRAF = timeElapsedMS;
    });
  }

  private async _calculateNextState(timeDeltaMS: number): Promise<void> {
    const timeDeltaS = millisecondsToSeconds(timeDeltaMS);
    this._player.update(timeDeltaS);

    if (
      !this._player.Element.position.equals(this._player.getCharacterMovement())
    ) {
      this._handleCharacterMovement();
    }
    await this._handleCharacterAttacking();
  }

  private _handleCharacterMovement(): void {
    const newPlayerPosition = this._player.getCharacterMovement();

    // equals -> Wertevergleich, === -> objektvergleich
    if (this._checkFreeSpace(newPlayerPosition.x, newPlayerPosition.z)) {
      this._player.Element.position.set(...newPlayerPosition.toArray());
      // this._camera.position.set(...newPlayerPosition.toArray());
      this._activateEnemies();
      this._enemiesMoveOrAttack();
    } else {
      this._player.speak('blocked');
    }
  }

  private async _handleCharacterAttacking() {
    if (this._player.attacks) {
      const playerPosition = this._player.Element.position;
      console.log(this._player.direction);
      const playerViewDirection = this._player.direction;
      let positionUpFront: Vector3;
      switch (playerViewDirection) {
        case DIRECTION.NORTH:
          positionUpFront = new Vector3(
            playerPosition.x,
            playerPosition.y,
            playerPosition.z - 1
          );
          break;
        case DIRECTION.EAST:
          positionUpFront = new Vector3(
            playerPosition.x - 1,
            playerPosition.y,
            playerPosition.z
          );
          break;
        case DIRECTION.SOUTH:
          positionUpFront = new Vector3(
            playerPosition.x,
            playerPosition.y,
            playerPosition.z + 1
          );
          break;
        case DIRECTION.WEST:
          positionUpFront = new Vector3(
            playerPosition.x + 1,
            playerPosition.y,
            playerPosition.z
          );
          break;
      }

      const enemy = this._enemies
        .filter((enemy) => enemy.Element.position.equals(positionUpFront))
        .pop();

      console.log('enemy', enemy);
      if (enemy !== undefined) {
        const damage = this._player.attack();
        enemy.takeHit(damage);

        new DamageText(damage, enemy.Element);

        if (enemy.health <= 0) {
          this._player.increaseExperience(enemy.experience);
          enemy.die();
          this._enemies = this._enemies.filter((child) => child !== enemy);
        }
      } else if (
        positionUpFront.x === this._goal.position.x &&
        positionUpFront.z === this._goal.position.z
      ) {
        this._player.increaseExperience(this._player.getMaxHealth() / 3);
        await this._generateNewLevel();
      }
      this._enemiesMoveOrAttack();
    }
  }

  private async _generateNewLevel(): Promise<void> {
    this._level += 1;
    this._updateEnemyDistribution();
    this._cleanScene();
    this._addDungeonToScene();
    await this._initGame();
  }

  private _updateEnemyDistribution() {
    const file = EnemyFileLoader.load();
    for (let index = 0; index < Object.keys(file).length; index++) {
      const weight = file[Object.keys(file)[index]].weight;
      file[Object.keys(file)[index]].weight = weight + index;
    }
    EnemyFileLoader.update(file);
  }

  private _cleanScene() {
    while (this._scene.children.length > 0) {
      this._scene.remove(this._scene.children[0]);
    }
    this._scene.add(this._player.Element);
    this._enemies = [];
  }

  private _addDungeonToScene(): void {
    this._dungeon = new Dungeon();
    const textureLoader = new THREE.TextureLoader();
    const wallTexture = textureLoader.load(
      'https://threejsfundamentals.org/threejs/resources/images/wall.jpg'
    );
    const wallGeometry = new THREE.BoxGeometry(1, 1.5, 1);
    const wallMaterial = new THREE.MeshPhongMaterial({
      map: wallTexture,
      // opacity: 0.6,
      transparent: true,
    }); // img source: https://www.pinterest.at/pin/376402481328234967/
    for (let height = 0; height < this._dungeon.grid.length; height++) {
      for (let width = 0; width < this._dungeon.grid[height].length; width++) {
        if (this._dungeon.grid[height][width] == ELEMENTS.WALL) {
          const cube = new THREE.Mesh(wallGeometry, wallMaterial);
          cube.receiveShadow = true;
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
      (object) => object.position.z === z && object.position.x === x
    );
    return intersections.length === 0;
  }

  private async _placeEndRoomObject() {
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

    //"Ladder" (https://skfb.ly/6RKqO) by Avelina is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    const ladderGltf = await new GLTFLoader().loadAsync('assets/Ladder.glb');
    ladderGltf.scene.position.set(endRoomX, -1, endRoomZ);

    // Alternatively set the ladder directly under the player to test the levelling
    // ladderGltf.scene.position.set(
    //     this._player.Element.position.x,
    //     -1,
    //     this._player.Element.position.z
    // );

    ladderGltf.scene.name = ELEMENTS.GOAL;
    this._goal = ladderGltf.scene;
    this._scene.add(ladderGltf.scene);
  }

  private async _setEnemies(): Promise<void> {
    for (const room of this._dungeon.rooms) {
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
                const enemy = new Enemy();
                await enemy._init(x, z);
                this._enemies.push(enemy);
                this._scene.add(enemy.Element);
              }
            }
          }
        }
      }
    }
  }

  private _constructAStarGrid(): number[][] {
    const grid: number[][] = [];
    for (let index = 0; index < PROPERTIES.GRID_HEIGHT; index++) {
      grid.push(new Array(PROPERTIES.GRID_WIDTH).fill(0));
    }

    const relevantElements = this._scene.children.filter((child) => {
      const items = [
        ELEMENTS.WALL.toString(),
        ELEMENTS.GOAL.toString(),
        ...ENEMY_TYPE_LIST,
      ];
      return items.includes(child.name);
    });

    relevantElements.forEach((child) => {
      const x = Math.min(
        Game._sceneToGrid(child.position.x),
        PROPERTIES.GRID_WIDTH - 1
      );
      const z = Math.min(
        Game._sceneToGrid(child.position.z),
        PROPERTIES.GRID_HEIGHT - 1
      );
      grid[z][x] = 1;
    });

    return grid;
  }

  private static _sceneToGrid(number_: number): number {
    return Math.floor(number_ + PROPERTIES.GRID_HEIGHT / 2 + 0.5);
  }

  private static _gridToScene(number_: number): number {
    return number_ - PROPERTIES.GRID_WIDTH / 2 - 0.5;
  }

  private _activateEnemies(): void {
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

  private _enemiesMoveOrAttack(): void {
    const activeEnemies = this._enemies.filter((enemy) => enemy.active);

    for (const enemy of activeEnemies) {
      const playerPosition = {
        x: Game._sceneToGrid(this._player.Element.position.x),
        y: Game._sceneToGrid(this._player.Element.position.z),
      };
      // TODO turn animation?
      const lookAt = new Vector3(
        this._player.Element.position.x,
        -0.5,
        this._player.Element.position.z
      );
      enemy.Element.lookAt(lookAt);
      const enemyPosition = {
        x: Game._sceneToGrid(enemy.Element.position.x),
        y: Game._sceneToGrid(enemy.Element.position.z),
      };
      const grid = this._constructAStarGrid();

      grid[enemyPosition.y][enemyPosition.x] = 0; // manipulates the grid to allow movement, otherwise the astar fails right away

      const aStarFinder = new AStarFinder({
        grid: { matrix: grid },
        diagonalAllowed: false,
        heuristic: 'Manhattan',
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
          const newEnemyPosition = new Vector3(
            Game._gridToScene(nextStep[0]),
            GLOBAL_Y - 0.5,
            Game._gridToScene(nextStep[1])
          );

          if (
            this._scene.children.filter(
              (object) => object.position === newEnemyPosition
            ).length === 0
          ) {
            enemy.move(newEnemyPosition);
          }
        } else {
          const lookAt = new Vector3(
            this._player.Element.position.x,
            -0.5,
            this._player.Element.position.z
          );
          enemy.attack(lookAt);
          const damage = enemy.calculateAttackDamage();
          this._player.takeHit(damage);

          if (this._player.health <= 0) {
            this.stopGame();
            this._player.die();
          }
        }
      }
    }
  }

  private _sceneToGridGridToSceneConversion(): void {
    const grid = this._constructAStarGrid();

    const geometry = new THREE.BoxGeometry(1, 3, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

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

  public stopGame(): number {
    this._stopAnimationFrame = true;
    return this._clock.elapsedTime;
  }

  private _setPlayerPosition() {
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
    this._player.Element.position.set(playerX, PLAYER_Y, playerZ);
  }
}
