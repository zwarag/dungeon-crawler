import { GLOBAL_GROUND_Y, GLOBAL_Y, PROPERTIES } from './helper/const';
import * as THREE from 'three';
import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Mesh,
  SpotLight,
  Vector2,
  Vector3,
} from 'three';
import { Player } from './player';
import { millisecondsToSeconds } from './helper/time';
import { Dungeon } from './dungeon';
import { ELEMENTS } from './helper/grid-elements';
import { Enemy } from './enemy';
import { AStarFinder } from 'astar-typescript';
import { DIRECTION } from './helper/direction';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { DamageText } from './damage-text';
import { updateProgressBar } from './dom-controller';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Game {
  private _threejs: THREE.WebGLRenderer;
  private _camera: THREE.PerspectiveCamera;
  private _scene: THREE.Scene;
  private _previousRAF: number | null;
  private _player: Player;
  private _dungeon: Dungeon;
  private _goal: Mesh;
  private _enemies: Array<Enemy> = [];
  private _raycaster: THREE.Raycaster;
  private _mouse: THREE.Vector2;
  private _composer: EffectComposer;
  private _outlinePass: OutlinePass;
  private _animationMixers: AnimationMixer[] = new Set();
  private _damageTextCallback: (
    animationMixer: AnimationMixer,
    animationClip: AnimationClip,
    mesh: Mesh
  ) => void;
  private _clock: THREE.Clock;
  private _spotLight: SpotLight;
  private _stopAnimationFrame = false;

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

    document.addEventListener('mousemove', (ev: MouseEvent) => {
      this._raycast(ev);
    });

    this._scene = new THREE.Scene();
    window._scene = this._scene;
    window._animationMixers = this._animationMixers;

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight.position.set(20, 100, 10);
    // directionalLight.target.position.set(0, 0, 0);
    // directionalLight.castShadow = true;
    // directionalLight.shadow.bias = -0.001;
    // directionalLight.shadow.mapSize.width = 2048;
    // directionalLight.shadow.mapSize.height = 2048;
    // directionalLight.shadow.camera.near = 0.1;
    // directionalLight.shadow.camera.far = 500;
    // directionalLight.shadow.camera.near = 0.5;
    // directionalLight.shadow.camera.far = 500;
    // directionalLight.shadow.camera.left = 100;
    // directionalLight.shadow.camera.right = -100;
    // directionalLight.shadow.camera.top = 100;
    // directionalLight.shadow.camera.bottom = -100;
    // this._scene.add(directionalLight);

    //const ambientLight = new THREE.AmbientLight(0xffffff, 4);
    //this._scene.add(ambientLight);

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
    this._dungeon = new Dungeon();
    this._addDungeonToScene();

    // place an object as placeholder in the end room (symbolizing a ladder or such)
    this._placeEndRoomObject();

    // eslint-disable-next-line unicorn/no-null
    this._previousRAF = null;

    // create a camera, which defines where we're looking at.
    this._camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // set up raycaster
    this._raycaster = new THREE.Raycaster();
    this._mouse = new Vector2();

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

    // set the camera as child of the player element, this ensures that the camera follows the player around
    this._player.Element.add(this._camera);

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
    //const controls = new OrbitControls(this._camera, this._threejs.domElement);
    //controls.target.set(0, 0, 0);
    //controls.update();

    // this._damageTextCallback = (
    //     animationMixer: AnimationMixer,
    //     animationClip: AnimationClip,
    //     mesh: Mesh
    // ): void => {
    //     this._scene.add(mesh);
    //     const action: AnimationAction = animationMixer.clipAction(animationClip);
    //     action.loop = THREE.LoopOnce;
    //     action.clampWhenFinished = true;
    //     action.play();
    //     this._animationMixers.add(animationMixer);
    //     animationMixer.addEventListener('finished', () => {
    //         action.stop();
    //         this._animationMixers.remove(animationMixer)
    //         this._scene.remove(mesh);
    //     });
    // };

    updateProgressBar(100);
    this._requestAnimationFrame();
  }

  async _initGame() {
    // placing enemies
    await this._setEnemies();
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

  private _calculateNextState(timeDeltaMS: number): void {
    const timeDeltaS = millisecondsToSeconds(timeDeltaMS);
    this._player.update(timeDeltaS);
    // this._setSpotlightPosition()

    if (
      !this._player.Element.position.equals(this._player.getCharacterMovement())
    ) {
      this._handleCharacterMovement();
    }
    this._handleCharacterAttacking();
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

  private _handleCharacterAttacking(): void {
    if (this._player.attacks) {
      const playerPosition = this._player.Element.position;
      const playerViewDirection = this._player.direction;
      let enemyPosition: Vector3;
      switch (playerViewDirection) {
        case DIRECTION.NORTH:
          enemyPosition = new Vector3(
            playerPosition.x,
            playerPosition.y - 0.5,
            playerPosition.z - 1
          );
          break;
        case DIRECTION.EAST:
          enemyPosition = new Vector3(
            playerPosition.x - 1,
            playerPosition.y - 0.5,
            playerPosition.z
          );
          break;
        case DIRECTION.SOUTH:
          enemyPosition = new Vector3(
            playerPosition.x,
            playerPosition.y - 0.5,
            playerPosition.z + 1
          );
          break;
        case DIRECTION.WEST:
          enemyPosition = new Vector3(
            playerPosition.x + 1,
            playerPosition.y - 0.5,
            playerPosition.z
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

        new DamageText(
          damage,
          enemy.Element
          // this._player.Element.position,
          // this._player.direction,
          // this._player.Element.rotation,

          // enemy.Element.position,
          // enemy.Element.geometry.parameters.height,
          // this._damageTextCallback
        );

        if (enemy.health <= 0) {
          this._player.increaseExperience(enemy.experience);
          enemy.die();
          this._enemies = this._enemies.filter((child) => child !== enemy);
          // this._scene.remove(enemy.Element);
        }
      }
      this._enemiesMoveOrAttack();
    }
  }

  private _addDungeonToScene(): void {
    const textureLoader = new THREE.TextureLoader();
    const wallTexture = textureLoader.load('./img/wall.jpg');
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
    const endObjectMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    const cone = new THREE.Mesh(endObjectGeometry, endObjectMaterial);
    cone.position.set(endRoomX, GLOBAL_Y, endRoomZ);
    cone.name = 'GOAL';
    // todo place ladder
    this._goal = cone;
    this._scene.add(cone);
  }

  private async _setEnemies(): Promise<void> {
    for (const room of this._dungeon.rooms) {
      if (!room.start) {
        // if (room.start) {
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
                //enemy.Element.scale.set(0.1, 0.1, 0.1)
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
        ELEMENTS.WALL.valueOf(),
        ELEMENTS.ENEMY.valueOf(),
        ELEMENTS.GOAL.valueOf(),
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

    activeEnemies.forEach((enemy) => {
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
          // consoled.log("moved", enemy.Element)

          const newEnemyPosition = new Vector3(
            Game._gridToScene(nextStep[0]),
            GLOBAL_Y - 0.5,
            Game._gridToScene(nextStep[1])
          );

          enemy.move(newEnemyPosition);

          // enemy.Element.position.set(
          //     Game._gridToScene(nextStep[0]),
          //     GLOBAL_Y - 0.5,
          //     Game._gridToScene(nextStep[1])
          // );
        } else {
          //enemy.Element.material.setValues({ color: Math.random() * 0xffffff }); // TODO remove later, just to visualize an enemy attacking

          const lookAt = new Vector3(
            this._player.Element.position.x,
            -0.5,
            this._player.Element.position.z
          );
          enemy.attack(lookAt);
          const damage = enemy.calculateAttackDamage();
          this._player.takeHit(damage);

          console.log('your health:', this._player.health);
          if (this._player.health <= 0) {
            console.log('YOU DIED');
            this.stopGame();
            this._player.die();
          }
        }
      }
    });
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

  private _raycast(event: MouseEvent): void {
    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this._raycaster.setFromCamera(this._mouse, this._camera);
    const intersects = this._raycaster.intersectObjects(this._scene.children);
    if (intersects.length > 0) {
      const enemy = intersects[0].object;
      if (enemy.name === ELEMENTS.ENEMY || enemy.name == 'zombie') {
        this._outlinePass.selectedObjects = [enemy];
      } else {
        this._outlinePass.selectedObjects = [];
      }
    }
  }

  public stopGame(): number {
    this._stopAnimationFrame = true;
    return this._clock.elapsedTime;
  }
}
