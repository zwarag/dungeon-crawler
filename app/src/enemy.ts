import {StateMachine} from "./state-machine";
import * as THREE from "three";
import {ENEMY} from "./helper/enemy";
import {randomRange} from "./helper/random";

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


    constructor() {
        this._state = new StateMachine()



    }


}
