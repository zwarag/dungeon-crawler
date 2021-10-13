import {GLOBAL_GROUND_Y, GLOBAL_Y, PROPERTIES} from "./helper/const";
import * as THREE from "three";
import {Mesh} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls";
import {Character} from "./character";
import {millisecondsToSeconds} from "./helper/time";
import {Dungeon} from "./dungeon";
import {ELEMENTS} from "./helper/grid-elements";
import {Enemy} from "./enemy";
import {AStarFinder} from "astar-typescript";

export class Game {
    private _threejs: THREE.WebGLRenderer;
    private _camera: THREE.PerspectiveCamera;
    private _scene: THREE.Scene;
    private _previousRAF: number | null;
    private _objects: Array<any>;
    private _player: Character;
    private _dungeon: Dungeon;
    private _camControls: FirstPersonControls;
    private _goal: Mesh;
    private _enemies: Array<Enemy> = []

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
            new THREE.PlaneGeometry(PROPERTIES.GRID_WIDTH, PROPERTIES.GRID_HEIGHT, PROPERTIES.GRID_WIDTH, PROPERTIES.GRID_HEIGHT),
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
        this._dungeon = new Dungeon()
        this._addDungeonToScene()

        // place an object as placeholder in the end room (symbolizing a ladder or such)
        this._placeEndRoomObject()

        // eslint-disable-next-line unicorn/no-null
        this._previousRAF = null;

        // create a camera, which defines where we're looking at.
        this._camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);

        // create the character
        this._objects = [];
        this._player = new Character(this._camera);

        // set the character into the first room
        const playerX = this._dungeon.firstRoom.x + Math.floor(this._dungeon.firstRoom.width / 2) - PROPERTIES.GRID_WIDTH / 2 - 0.5
        const playerZ = this._dungeon.firstRoom.z + Math.floor(this._dungeon.firstRoom.height / 2) - PROPERTIES.GRID_WIDTH / 2 - 0.5
        this._player.Element.position.set(playerX, GLOBAL_Y, playerZ)
        this._scene.add(this._player.Element);

        // axes helper
        const axesHelper = new THREE.AxesHelper(10);
        this._scene.add(axesHelper);

        // position and point the camera to the center of the scene
        this._camera.position.x = this._player.Element.position.x;
        this._camera.position.y = this._player.Element.position.y;
        this._camera.position.z = this._player.Element.position.z;
        this._camera.rotateY(-Math.PI / 2) // the camera needs to be turned by 90 degrees initially


        // placing enemies
        this._setEnemies()

        // TODO move the following blocks to game loop
        // activate and deactivate enemies
        this._enemies.forEach(enemy => {
            const distanceToPlayer = enemy.Element.position.manhattanDistanceTo(this._player.Element.position)
            if (distanceToPlayer <= enemy.awarenessRange * 10) {
                enemy.active = true
            } else if (distanceToPlayer >= Math.floor(enemy.awarenessRange * 1.5)) {
                enemy.active = false // allows the player to flee and for enemies to loose interest
            }
        })

        this._constructAStarGrid()

        // move enemy or attack player
        this._moveOrAttack()

        // Camera
        // TODO: this is only temporary and should be swaped out for the actual implementaiton of the camera
        const controls = new OrbitControls(this._camera, this._threejs.domElement);
        controls.target.set(0, 0, 0);
        controls.update();

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
        });
    }

    private _calculateNextState(timeDeltaMS: number) {
        const timeDeltaS = millisecondsToSeconds(timeDeltaMS);
        this._objects.map((object) => object.update(timeDeltaS));
        this._player.update(timeDeltaS);
        this._player.moveCharacter(this._scene)
    }

    private _addDungeonToScene() {

        const textureLoader = new THREE.TextureLoader();
        const wallTexture = textureLoader.load("./img/wall.jpg")
        const wallGeometry = new THREE.BoxGeometry(1, 1.5, 1);
        const wallMaterial = new THREE.MeshBasicMaterial({map: wallTexture}) // img source: https://www.pinterest.at/pin/376402481328234967/
        for (let height = 0; height < this._dungeon.grid.length; height++) {
            for (let width = 0; width < this._dungeon.grid[height].length; width++) {
                if (this._dungeon.grid[height][width] == ELEMENTS.WALL) {
                    const cube = new THREE.Mesh(wallGeometry, wallMaterial);
                    cube.name = ELEMENTS.WALL
                    // offset by half the size of the grid, since 0,0,0 is in the center of it. Furthermore offset by 0.5, as otherwise the center of each box is used and not the corner.
                    cube.position.set(width - (PROPERTIES.GRID_WIDTH / 2 - 0.5), GLOBAL_Y + 0.25, height - (PROPERTIES.GRID_HEIGHT / 2 - 0.5))
                    this._scene.add(cube);
                }
            }
        }

    }

    private _placeEndRoomObject() {
        const endRoomX = this._dungeon.rooms[this._dungeon.rooms.length - 1].x + Math.floor(this._dungeon.rooms[this._dungeon.rooms.length - 1].width / 2) - PROPERTIES.GRID_WIDTH / 2 - 0.5
        const endRoomZ = this._dungeon.rooms[this._dungeon.rooms.length - 1].z + Math.floor(this._dungeon.rooms[this._dungeon.rooms.length - 1].height / 2) - PROPERTIES.GRID_WIDTH / 2 - 0.5
        const endObjectGeometry = new THREE.ConeGeometry(0.5, 4, 32);
        const endObjectMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
        const cone = new THREE.Mesh(endObjectGeometry, endObjectMaterial);
        cone.position.set(endRoomX, GLOBAL_Y, endRoomZ)
        cone.name = "GOAL"
        this._goal = cone
        this._scene.add(cone);
    }


    private _setEnemies() {
        this._dungeon.rooms.forEach(room => {
            if (!room.start) {
                for (let height = 0; height < room.height - 1; height++) {
                    for (let width = 0; width < room.width - 1; width++) {
                        if (Math.random() <= room.enemyChance) {
                            const x = (room.x + 1 + width) - (PROPERTIES.GRID_WIDTH / 2 + 0.5)
                            const z = (room.z + 1 + height) - (PROPERTIES.GRID_HEIGHT / 2 + 0.5)
                            if (!(this._goal.position.x === x && this._goal.position.z === z)) {
                                const enemy = new Enemy(x, z)
                                this._enemies.push(enemy)
                                this._scene.add(enemy.Element)
                            }
                        }
                    }
                }
            }
        })
    }

    private _constructAStarGrid(): number[][] {

        const grid: number[][] = [];
        for (let index = 0; index < PROPERTIES.GRID_HEIGHT; index++) {
            grid.push(new Array(PROPERTIES.GRID_WIDTH).fill(0))
        }

        const relevantElements =  this._scene.children.filter(child => {
            const items = [ELEMENTS.WALL.valueOf(), ELEMENTS.ENEMY.valueOf(), ELEMENTS.GOAL.valueOf()]
            return items.includes(child.name)
        })

        relevantElements.forEach(child => {
            const x = Game._sceneToGrid(child.position.x)
            const z = Game._sceneToGrid(child.position.z)
            grid[x][z] = 1
        })
        return grid
    }

    private static _sceneToGrid(number_: number) {
        return Math.floor(number_) + Math.floor(PROPERTIES.GRID_HEIGHT / 2)
    }

    private static _gridToScene(number_: number) {
        return number_ - (PROPERTIES.GRID_WIDTH / 2) - 0.5
    }


    private _moveOrAttack() {

        this._enemies.filter(enemy => enemy.active).forEach(enemy => {
            setTimeout(() => {
                console.log("checking if enemy is in reach")
                const grid = this._constructAStarGrid()
                const aStarFinder = new AStarFinder({grid: {matrix: grid}, diagonalAllowed: false})
                const enemyPosition = {
                    x: Game._sceneToGrid(enemy.Element.position.x),
                    y: Game._sceneToGrid(enemy.Element.position.z)
                }
                const playerPosition = {
                    x: Game._sceneToGrid(this._player.Element.position.x),
                    y: Game._sceneToGrid(this._player.Element.position.z)
                }

                const path: number[][] = aStarFinder.findPath(enemyPosition, playerPosition);
                console.log(path)
                if (path.length > 0) {
                    const nextStep: number[] = path[0]
                    console.log("nextstepgrid", nextStep)
                    console.log("nextstepscene", Game._gridToScene(nextStep[0]), Game._gridToScene(nextStep[1]))
                    enemy.Element.position.set(Game._gridToScene(nextStep[0]), GLOBAL_Y, Game._gridToScene(nextStep[1]))

                }
            }, 3000)
        })

    }


}

