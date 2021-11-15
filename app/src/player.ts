import { DIRECTION } from './helper/direction';
import { TimeInSeconds } from './helper/time';
import { InputController, KeyBoardInputController } from './input-controller';
import * as THREE from 'three';

import { StateMachine } from './state-machine';
import text from '../public/txt/text.json';
import { AnimationClip, AnimationMixer, Group, Object3D, Vector3 } from 'three';
import { GENDER } from './helper/gender';
import { randomRange } from './helper/random';
import { CharacterBase } from './character';
import initialPlayerStats from '../public/txt/initialPlayerStats.json';
import { ELEMENTS } from './helper/elements';
import {
  displayLevelUpMsg,
  exitOnDeath,
  updateHUDPlayerLevel,
  updateProgressBar,
} from './dom-controller';
import { loadGltf } from './helper/file-loader';
import playerJson from '../public/txt/initialPlayerStats.json';
import { CharacterFsm } from './character-fsm';

export class Player extends CharacterBase {
  /** A InputController for Keyboard or AI Controlled inputs. */
  private _input: InputController;

  /** The Statemachine used for animations */
  _state: StateMachine<Player>;
  /**
   * The actual redered object.
   * Note: THREE.Mesh extends THREE.Object3D which has `position` property
   */
  private _3DElement!: THREE.Group;

  /** The velocity a Charater is moving. Backwards, idle, forwards. */
  private _velocity: -1 | 0 | 1;

  /** A simplified version of that THREE.Object3D would offer. */
  private _direction: DIRECTION;

  /** The gender of the character, used for voice feedback.*/
  private _gender: number;

  /**
   * The player wants to attack.
   */
  private _attacks: boolean;

  /**
   * The required experience to level up to the next level.
   */
  private _requiredExperience: number;

  /**
   * The current level of the player.
   */
  private _level: number;

  /**
   * The camera following the player around.
   */

  // private _camera: PerspectiveCamera;

  /**
   *  Allows player action
   */
  // _allowAction: Array<boolean> = []

  constructor() {
    // character stats
    super(
      initialPlayerStats.health,
      {
        min: initialPlayerStats.damage.min,
        max: initialPlayerStats.damage.max,
      },
      initialPlayerStats.accuracy,
      initialPlayerStats.experience,
      100
    );
    this._gender = randomRange(GENDER.MALE, GENDER.FEMALE); // currently determined randomly
    this._level = initialPlayerStats.level;
    this._requiredExperience = initialPlayerStats.level2experience;

    // threejs parts
    this._input = new KeyBoardInputController();
    this._state = new StateMachine(this);
    this._velocity = 0;
    this._attacks = false;
    this._direction = DIRECTION.NORTH;
  }

  /**
   * This is used like a "late" constructor.
   * Variables what get initialized here should have the be declared as `variable!`.
   */
  async _init(): Promise<void> {
    const gltf = await loadGltf(playerJson);
    gltf.scene.traverse((child) => {
      if (child.type == 'SkinnedMesh') {
        child.frustumCulled = false;
      }
    });
    const model = gltf.scene;
    const mixer = new AnimationMixer(model);
    gltf.animations.forEach((clip: AnimationClip) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      model.animations[clip.name] = {
        clip: clip,
        mixer: mixer,
        mesh: model,
      };
    });
    model.rotation.set(0, -15, 0);
    model.scale.setScalar(0.45);
    model.traverse((c: Object3D) => {
      c.castShadow = true;
    });

    this._3DElement = model;
    this._3DElement.name = ELEMENTS.PLAYER;

    this._state = new CharacterFsm(this);
    this._state.setState('idle');
  }

  get Element(): THREE.Group {
    return <Group>this._3DElement;
  }

  /** This function shall be called after every drawn AnimationFrame. */
  update(delta: TimeInSeconds): void {
    // this._state.update(delta, this._input)

    const keys = { ...this._input.keys };
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
    } else if (keys.action) {
      this._attacks = true;
    } else {
      this._attacks = false;
      this._velocity = 0;
    }

    this._input.resetKeys();
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

  getCharacterMovement(): Vector3 {
    if (this._velocity != 0) {
      switch (this._direction) {
        case DIRECTION.NORTH:
          return new Vector3(
            this.Element.position.x,
            this.Element.position.y,
            this.Element.position.z - this._velocity
          );
        case DIRECTION.EAST:
          return new Vector3(
            this.Element.position.x - this._velocity,
            this.Element.position.y,
            this.Element.position.z
          );
        case DIRECTION.SOUTH:
          return new Vector3(
            this.Element.position.x,
            this.Element.position.y,
            this.Element.position.z + this._velocity
          );
        case DIRECTION.WEST:
          return new Vector3(
            this.Element.position.x + this._velocity,
            this.Element.position.y,
            this.Element.position.z
          );
      }
    }
    return this.Element.position;
  }

  get attacks(): boolean {
    return this._attacks;
  }

  takeHit(damage: number): void {
    this._health -= damage;
    updateProgressBar(this.getMaxHealth(), this._health);
    console.log(`The player has ${this._health} left`);
  }

  get health(): number {
    return this._health;
  }

  get direction(): DIRECTION {
    return this._direction;
  }

  speak(type: string): void {
    try {
      // avoids to build up a queue of utterances, cancels the current utterance if there is one
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      const voices = window.speechSynthesis.getVoices();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const sentences = text[type];
      const sentence = sentences[Math.floor(Math.random() * sentences.length)]; // select a random sentence
      const utterThis = new SpeechSynthesisUtterance(sentence);
      utterThis.voice = voices[this._gender];
      // window.speechSynthesis.speak(utterThis); // <-- commented for now, otherwise this might be annoying
    } catch (error) {
      console.log('Browser not supported for voice output:' + error);
    }
  }

  increaseExperience(exp: number): void {
    this._experience += exp;
    console.log(
      `You've gained ${exp} experience, which is now in total ${this._experience}`
    );
    // level up the player if he gathered enough experience
    if (this._experience >= this._requiredExperience) {
      this._levelUp();
      updateProgressBar(this.getMaxHealth(), this._health);
    }
  }

  private _levelUp(): void {
    this._level += 1;
    updateHUDPlayerLevel(this._level);
    displayLevelUpMsg(2000);
    console.log(`You've leveled up to level ${this._level}`);
    this._experience = this._experience - this._requiredExperience;
    // stats are increased by 5 percent per level up
    // furthermore with each level up the health of the character is replenished
    this._health = Math.ceil(
      initialPlayerStats.health + this._level * 0.05 * initialPlayerStats.health
    );
    this._requiredExperience = this._health;
    this._accuracy = Math.ceil(
      initialPlayerStats.accuracy +
        this._level * 0.05 * initialPlayerStats.accuracy
    );
    this._damage.min = Math.ceil(
      initialPlayerStats.damage.min +
        this._level * 0.05 * initialPlayerStats.damage.min
    );
    this._damage.max = Math.ceil(
      initialPlayerStats.damage.max +
        this._level * 0.05 * initialPlayerStats.damage.max
    );
  }

  getMaxHealth(): number {
    return (
      initialPlayerStats.health +
      (this._level - 1) * 0.05 * initialPlayerStats.health
    );
  }

  die(): void {
    exitOnDeath();
  }
}
