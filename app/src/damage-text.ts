import * as THREE from 'three';
import {
  AnimationClip,
  AnimationMixer,
  FontLoader,
  Group,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  TextGeometry,
} from 'three';
import { StateMachine } from './state-machine';
import { DamageTextFsm } from './damage-text-fsm';
import { Animated, Animation } from './helper/animated';

type DamageTextAnimationTypes = 'fadeOut';

export class DamageText implements Animated {
  /** The Statemachine used for animations */
  private _state: StateMachine<any> | undefined;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  _animations: { [key in DamageTextAnimationTypes]: Animation } = {};

  private _fontLoader: FontLoader;

  private _textMesh: Mesh<TextGeometry, MeshBasicMaterial> | undefined;

  _enemy: Object3D;

  constructor(damage: number, _enemy: Group) {
    this._fontLoader = new FontLoader();
    this._enemy = _enemy;
    this._fontLoader
      .loadAsync('fonts/helvetiker_regular.typeface.json', (font) => {
        return font;
      })
      .then((font) => {
        const textGeometry = new THREE.TextGeometry(damage.toString(), {
          font: font,
          size: 0.1,
          height: 0.1,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 0,
          bevelSize: 0,
          bevelOffset: 0,
          bevelSegments: 0,
        });

        const textMaterial = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          transparent: true,
        });
        this._textMesh = new THREE.Mesh(textGeometry, textMaterial);
        this._textMesh.position.set(0, 2.2, 0);
        this._textMesh.name = 'TEXT';
        this._textMesh.rotation.set(0.7, 0, 0); // hardcoded to face the player

        // Animation
        const fadeOutTrack = new THREE.NumberKeyframeTrack(
          '.material.opacity',
          [0, 1],
          [1, 0]
        );
        const animationClip = new AnimationClip('fadeOut', 2, [fadeOutTrack]);
        const animationMixer = new AnimationMixer(this._textMesh);

        this._animations.fadeOut = {
          clip: animationClip,
          mixer: animationMixer,
          mesh: this._textMesh,
        };

        this._state = new DamageTextFsm(this);
        this._state.setState('shown');
      });
  }
}
