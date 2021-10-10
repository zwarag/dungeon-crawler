import {GLOBAL_Y, PROPERTIES} from "./helper/const";
import {DIRECTION} from "./helper/direction";
import {TimeInSeconds} from "./helper/time";
import * as THREE from "three";
import {InputController, KeyBoardInputController} from "./input-controller";
import {StateMachine} from "./state-machine";
import {Grid} from "./helper/type";
import {ELEMENTS} from "./helper/grid-elements";
import {Scene} from "three";

export class Character {
    /** A InputController for Keyboard or AI Controlled inputs. */
    private _input: InputController;

    /** The Statemachine used for animations */
    private _state: StateMachine;
    /**
     * The actual redered object.
     * Note: THREE.Mesh extends THREE.Object3D which has `position` property
     */
    private _3DElement: THREE.Mesh;

    /** The velocity a Charater is moving. Backwards, idle, forwards. */
    private _velocity: -1 | 0 | 1;

    /** A simplified version of that THREE.Object3D would offer. */
    private _direction: DIRECTION;

    constructor() {
        this._input = new KeyBoardInputController();
        this._state = new StateMachine();
        this._velocity = 0;
        this._direction = DIRECTION.NORTH;
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const loader = new THREE.TextureLoader();
        const material = [
            new THREE.MeshBasicMaterial({map: loader.load("./img/player_ft.jpg")}),
            new THREE.MeshBasicMaterial({map: loader.load("./img/player_bk.jpg")}),
            new THREE.MeshBasicMaterial({map: loader.load("./img/player_up.jpg")}),
            new THREE.MeshBasicMaterial({map: loader.load("./img/player_dn.jpg")}),
            new THREE.MeshBasicMaterial({map: loader.load("./img/player_rt.jpg")}),
            new THREE.MeshBasicMaterial({map: loader.load("./img/player_lf.jpg")}),
        ];
        this._3DElement = new THREE.Mesh(geometry, material);
        const startPosition = new THREE.Vector3(-4.5, GLOBAL_Y, -4.5);
        this._3DElement.position.set(...startPosition.toArray());
    }

    get Element(): THREE.Mesh {
        return this._3DElement;
    }

    /** This function shall be called after every drawn AnimationFrame. */
    update(delta: TimeInSeconds): void {
        // this._state.update(delta, this._input)

        const keys = {...this._input.keys};
        if (keys.forward) {
            this._velocity = 1;
        } else if (keys.backward) {
            this._velocity = -1;
        } else if (keys.left) {
            this._direction = (4 + this._direction - 1) % 4;
            this.Element.rotateY(Math.PI / 2);
        } else if (keys.right) {
            this._direction = (this._direction + 1) % 4;
            this.Element.rotateY(-Math.PI / 2);
        } else {
            this._velocity = 0;
        }
    }

    moveCharacter(scene: Scene): void {
        if (this._velocity != 0) {
            let newPosition: number
            switch (this._direction) {
                case DIRECTION.NORTH:
                    newPosition = this.Element.position.x + this._velocity
                    if (this.checkFreeSpace(newPosition, this.Element.position.z, scene)) {
                        this.Element.position.setX(newPosition);
                    }
                    break;
                case DIRECTION.EAST:
                    newPosition = this.Element.position.z - this._velocity
                    if (this.checkFreeSpace(this.Element.position.x, newPosition, scene)) {
                        this.Element.position.setZ(newPosition);
                    }
                    break;
                case DIRECTION.SOUTH:
                    newPosition = this.Element.position.x - this._velocity
                    if (this.checkFreeSpace(newPosition, this.Element.position.z, scene)) {
                        this.Element.position.setX(newPosition);
                    }
                    break;
                case DIRECTION.WEST:
                    newPosition = this.Element.position.z + this._velocity
                    if (this.checkFreeSpace(this.Element.position.x, newPosition, scene)) {
                        this.Element.position.setZ(newPosition);
                    }
                    break;
            }
        }
    }

    checkFreeSpace(x: number, z: number, scene: Scene): boolean {
        const intersections = scene.children.filter(value =>
            value.position.z === z && value.position.x === x
        )
        return intersections.length === 0
    }
}
