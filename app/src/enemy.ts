import { StateMachine } from './state-machine';
import { ENEMY, ENEMY_TYPE_LIST } from './helper/enemy';
import { randomRange } from './helper/random';
import { GLOBAL_Y } from './helper/const';
import { CharacterBase } from './character';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationClip, AnimationMixer, Group, Vector3 } from 'three';
import { Animation } from './helper/animated';
import { EnemyFsm } from './enemy-fsm';
import { modelLoader } from './helper/model-loader';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { EnemyFileLoader } from './helper/enemy-file-loader';
import { loadGltf } from './helper/file-loader';
import enemiesJson from '../public/txt/enemies.json';

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

  /**
   * The GLTF element of the enemy
   */
  private _gltf: GLTF;

  /**
   * The position to where the enemy will try to walk and look
   */
  _targetPosition: Vector3;

  _animations: { [key in EnemyAnimationTypes]: Animation } = {};

  /**
   * Whether the enemy is activated
   */
  private _active: boolean;

  public _model: Group;

  // private _enemyObject;

  constructor() {
    const file = EnemyFileLoader.load();
    const selection = calculateRandomSelection(); // const enemyTypeJsonIndex = randomRange(0, Math.max(enemyCount - 1));
    const enemyObject = file[ENEMY_TYPE_LIST[selection]];
    super(
      randomRange(enemyObject.health.min, enemyObject.health.max),
      { min: enemyObject.damage.min, max: enemyObject.damage.max },
      enemyObject.accuracy,
      enemyObject.experience,
      enemyObject.awarenessRange
    );
    this._type = ENEMY_TYPE_LIST[selection];
    this._active = false;
    // this._enemyObject = enemyObject;
  }

  async _init(x: number, z: number): Promise<void> {
    this._gltf = await loadGltf(enemiesJson, this._type);
    // this._gltf = await modelLoader.load(this._type);
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

    this._model.scale.setScalar(0.45);
    this._model.traverse((c) => {
      c.castShadow = true;
    });
    this._model.position.set(x, GLOBAL_Y - 0.5, z);
    this._3DElement = this._model;
    this._3DElement.name = this._type;

    this._state = new EnemyFsm(this);
    this._state.setState('idle');
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

  move(targetPosition: Vector3): void {
    this._targetPosition = targetPosition;
    this.Element.lookAt(targetPosition);
    this._state.setState('walk');
  }

  attack(playerPosition: Vector3): void {
    this.Element.lookAt(playerPosition);
    this._state.setState('attack');
  }

  die(): void {
    this._state.setState('die');
  }
}

function calculateRandomSelection(): number {
  const file = EnemyFileLoader.load();
  const weights = [];
  for (let index = 0; index < Object.keys(file).length; index++) {
    weights.push(file[Object.keys(file)[index]].weight);
  }
  const weightSum = weights.reduce((a, b) => {
    return a + b;
  });
  const distribution = [];
  for (const [index, weight] of weights.entries()) {
    distribution[index] = ((100 / weightSum) * weight) / 100;
  }
  const cumulativeDistribution = distribution.map(
    (
      (sum) => (value) =>
        (sum += value)
    )(0)
  );
  const r = Math.random();
  return cumulativeDistribution.filter((el) => r >= el).length;
}
