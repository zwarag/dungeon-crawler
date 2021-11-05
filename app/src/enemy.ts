import { StateMachine } from './state-machine';
import { ENEMY, ENEMY_TYPE_LIST } from './helper/enemy';
import { randomRange } from './helper/random';
import enemiesJson from '../public/txt/enemies.json';
import { GLOBAL_Y } from './helper/const';
import { CharacterBase } from './character';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationClip, AnimationMixer, Group, Vector3 } from 'three';
import { Animation } from './helper/animated';
import { EnemyFsm } from './enemy-fsm';
import { modelLoader } from './helper/model-loader';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';

type EnemyAnimationTypes = 'idle' | 'walk' | 'die' | 'attack';

export class Enemy extends CharacterBase {
  /** The Statemachine used for animations */
  private _state: StateMachine;
  /**
   * The actual redered object.
   * Note: THREE.Mesh extends THREE.Object3D which has `position` property
   */
  private _3DElement: Group;

  /**
   *  The type of enemy
   */
  private _type: ENEMY;

  private _gltf: GLTF;

  _targetPosition: Vector3;

  _animations: { [key in EnemyAnimationTypes]: Animation } = {};

  /**
   * Whether the enemy is activated
   */
  private _active: boolean;

  public _model: Group;

  private _enemyObject;

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
    this._enemyObject = enemyObject;
  }

  async _init(x: number, z: number): Promise<void> {
    this._gltf = await modelLoader.load(this._type);
    this._model = SkeletonUtils.clone(this._gltf.scene);

    const mixer = new AnimationMixer(this._model);
    for (let i = 0; i < this._gltf.animations.length; i++) {
      const animationClip: AnimationClip = this._gltf.animations[i];
      this._model.animations[animationClip.name] = {
        clip: animationClip,
        mixer: mixer,
        mesh: this._model,
      };
    }

    // todo
    this._model.traverse((item: any) => {
      if (item.isMaterial) {
        item.transparent = false;
        item.opacity = 1;
      }
    });

    this._model.scale.setScalar(0.45);
    this._model.traverse((c) => {
      c.castShadow = true;
    });
    this._model.position.set(x, GLOBAL_Y - 0.5, z);
    this._3DElement = this._model;
    this._3DElement.name = this._type;

    this._state = new EnemyFsm(this);
    this._state.setState('idle');

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

  calculateAttackDamage(): number {
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

  get Element(): Group {
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

  move(targetPosition: Vector3) {
    this._targetPosition = targetPosition;
    this.Element.lookAt(targetPosition);
    this._state.setState('walk');
  }

  attack(playerPosition: Vector3) {
    this.Element.lookAt(playerPosition);
    this._state.setState('attack');
  }

  die() {
    this._state.setState('die');
  }
}
