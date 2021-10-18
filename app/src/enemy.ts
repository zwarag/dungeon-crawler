import { StateMachine } from "./state-machine";
import * as THREE from "three";
import { ENEMY } from "./helper/enemy";
import { randomRange } from "./helper/random";
import enemiesJson from "../public/txt/enemies.json";
import { GLOBAL_Y } from "./helper/const";
import { CharacterBase } from "./character";

export class Enemy extends CharacterBase {
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
  private _type: ENEMY;

  /**
   * Whether the enemy is activated
   */
  private _active: boolean;

  constructor(x: number, z: number) {
    const enemyCount = Object.keys(ENEMY).length / 2;
    const temporary_type = randomRange(0, Math.max(enemyCount - 1));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const enemyObject = enemiesJson[ENEMY[temporary_type]];
    super(
      randomRange(enemyObject.health.min, enemyObject.health.max),
      { min: enemyObject.damage.min, max: enemyObject.damage.max },
      enemyObject.accuracy,
      enemyObject.experience,
      enemyObject.awarenessRange
    );
    this._type = temporary_type;
    this._active = false;
    // replace by graphics
    const geometry = new THREE.ConeGeometry(0.5, 1, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this._3DElement = new THREE.Mesh(geometry, material);
    this._3DElement.position.set(x, GLOBAL_Y, z);
    this._3DElement.name = "ENEMY";
    // tbd
    this._state = new StateMachine();
  }

  attack(): number {
    let damage = 0;
    const chance = Math.random() * 100;
    if (chance <= this._accuracy) {
      damage = randomRange(this.damage.min, this.damage.max);
      if (chance > 90) {
        damage *= 2;
      }
    }
    return damage;
  }

  get Element(): THREE.Mesh {
    return this._3DElement;
  }

  get awarenessRange(): number {
    return this._awarenessRange;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

  takeHit(damage: number): void {
    this._health -= damage;
    console.log(`The enemy has ${this._health} left`);
  }

  get health(): number {
    return this._health;
  }
}
