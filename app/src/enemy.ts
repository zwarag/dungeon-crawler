import { StateMachine } from './state-machine';
import * as THREE from 'three';
import { ENEMY, ENEMY_TYPE_LIST } from './helper/enemy';
import { randomRange } from './helper/random';
import enemiesJson from '../public/txt/enemies.json';
import { GLOBAL_Y } from './helper/const';
import { CharacterBase } from './character';
import {
  GLTF,
  GLTFLoader,
  GLTFReference,
} from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Group } from 'three';

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

  private _gltf: GLTF;

  /**
   * Whether the enemy is activated
   */
  private _active: boolean;

  public _model: Group;

  constructor() {
    const enemyCount = ENEMY_TYPE_LIST.length;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const enemyTypeJsonIndex = randomRange(0, Math.max(enemyCount - 1));
    const enemyObject = enemiesJson[ENEMY_TYPE_LIST[enemyTypeJsonIndex]];
    super(
      randomRange(enemyObject.health.min, enemyObject.health.max),
      { min: enemyObject.damage.min, max: enemyObject.damage.max },
      enemyObject.accuracy,
      enemyObject.experience,
      enemyObject.awarenessRange
    );
    this._type = ENEMY_TYPE_LIST[enemyTypeJsonIndex];
    this._active = false;
    // replace by graphics

    // const geometry = new THREE.ConeGeometry(0.5, 1, 32);
    // const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    // this._3DElement = new THREE.Mesh(geometry, material);
    // this._3DElement.position.set(x, GLOBAL_Y, z);
    // this._3DElement.name = 'ENEMY';
    // this._3DElement.castShadow = true;

    // tbd
    this._state = new StateMachine(this);
  }

  async _init(x: number, z: number): Promise<void> {
    this._gltf = await new GLTFLoader().loadAsync('assets/Warrok_complete.glb');
    this._model = this._gltf.scene;

    this._model.scale.setScalar(0.5);
    this._model.traverse((c) => {
      c.castShadow = true;
    });
    this._model.position.set(x, GLOBAL_Y - 0.5, z);
    this._3DElement = this._model;
    this._3DElement.name = 'zombie';

    // const anim = new FBXLoader().loadAsync('assets/')
    //this._something = await new GLTFLoader().loadAsync('assets/goblin_d_shareyko.gltf')
    //const model = this._something.scene;
    //model.children[2].scale.multiplyScalar(0.0000001)
    //model.traverse((object: any) => {
    //    if (object.isMesh) {
    //        object.position.set(x, 0, z
    //        );
    //        //object.scale.setSize(THREE.Vector3(0.1, 0.1, 0.1))
    //        object.name = 'ENEMY';
    //        object.castShadow = true;
    //        this._3DElement = object;
    //    }
    //});
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

  get experience(): number {
    return this._experience;
  }
}
