import {StateMachine} from "./state-machine";
import * as THREE from "three";
import {ENEMY} from "./helper/enemy";
import {randomRange} from "./helper/random";
import enemiesJson from '../public/txt/enemies.json'
import {GLOBAL_Y} from "./helper/const";

export class Enemy {

    /** The Statemachine used for animations */
    private _state: StateMachine;
    /**
     * The actual redered object.
     * Note: THREE.Mesh extends THREE.Object3D which has `position` property
     */
    private _3DElement: THREE.Mesh;

    /**
     *  The type of enemy
     */
    private _type: ENEMY

    /**
     *  The health of the enemy
     */
    private _health: number

    /**
     * The awareness range of the enemy
     */
    private _awarenessRange: number

    /**
     * Whether the enemy is activated
     */
    private _active: boolean


    constructor(x: number, z: number) {
        const enemyCount = Object.keys(ENEMY).length / 2
        this._type = randomRange(0, Math.max(enemyCount - 1))
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const enemyObject = enemiesJson[ENEMY[this._type]]
        this._health = randomRange(enemyObject.health.min, enemyObject.health.max)
        this._awarenessRange = enemyObject.awarenessRange
        this._active = false
        // replace by graphics
        const endObjectGeometry = new THREE.ConeGeometry(0.5, 1, 32);
        const endObjectMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
        this._3DElement = new THREE.Mesh(endObjectGeometry, endObjectMaterial);
        this._3DElement.position.set(x, GLOBAL_Y, z)
        this._3DElement.name = "ENEMY"
        // tbd
        this._state = new StateMachine()
    }

    get Element(): THREE.Mesh {
        return this._3DElement;
    }

    get awarenessRange(): number {
        return this._awarenessRange
    }

    get active(): boolean {
        return this._active
    }

    set active(value: boolean) {
        this._active = value
    }

}
