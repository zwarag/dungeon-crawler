import * as THREE from 'three';
import { DIRECTION } from './helper/direction';
import {
  AnimationClip,
  AnimationMixer,
  Euler,
  FontLoader,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  TextGeometry,
  Vector3,
} from 'three';
import { IdleState, StateMachine } from './state-machine';
import { DamageTextState } from './damage-text-state';

export class DamageText implements Animated {
  /** The Statemachine used for animations */
  private _state: StateMachine;

  _animations = {};

  private _fontLoader: FontLoader;

  private _textMesh: Mesh<TextGeometry, MeshBasicMaterial>;

  constructor(
    damage: number,
    playerPosition: Vector3,
    playerDirection: DIRECTION,
    playerRotation: Euler,
    enemyPosition: Vector3,
    enemyHeight: number,
    animationMixerCallback: (
      mixer: AnimationMixer,
      clip: AnimationClip,
      mesh: Mesh
    ) => void
  ) {
    this._fontLoader = new FontLoader();

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

        // textGeometry.scale(0.1, 0.1, 0.1)
        const textMaterial = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          transparent: true,
        });
        this._textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // The Box3 is a helper object to get the exact dimensions of the placed text object to deal with the needed offset
        const box = new THREE.Box3().setFromObject(this._textMesh);

        // Set the modifiers for the
        let zModifier = 1;
        let xModifier = 1;

        switch (playerDirection) {
          case DIRECTION.NORTH:
            xModifier = -1;
            break;
          case DIRECTION.EAST:
            zModifier = -1;
            break;
          case DIRECTION.WEST:
            zModifier = 1;
            break;
          case DIRECTION.SOUTH:
            xModifier = 1;
        }

        // Place the text above the enemy
        // TODO does not work properly yet, the offset isn't fully correct
        const yDelta = box.getSize(this._textMesh.position).y;
        const xDelta = (xModifier * (box.max.x - box.min.x)) / 2;
        const zDelta = (zModifier * (box.max.z - box.min.z)) / 2;
        this._textMesh.position.set(
          enemyPosition.x + xDelta,
          enemyPosition.y + enemyHeight / 2 + yDelta,
          enemyPosition.z + zDelta
        );

        // Set the text rotation to face the player
        this._textMesh.rotation.set(
          playerRotation.x,
          playerRotation.y,
          playerRotation.z
        );

        this._textMesh.name = 'TEXT';
        this._textMesh.lookAt(playerPosition);

        // Animation
        // TODO: statemaschine
        const liftTrack4 = new THREE.NumberKeyframeTrack(
          '.material.opacity',
          [0, 1],
          [1, 0]
        );

        const animationClip = new AnimationClip('fadeOut', 2, [liftTrack4]);
        const animationMixer = new AnimationMixer(this._textMesh);

        this._animations.fadeOut = {
          clip: animationClip,
          mixer: animationMixer,
          mesh: this._textMesh,
        };

        this._state = new DamageTextState(this);

        // animationMixerCallback(animationMixer, animationClip, this._textMesh);
      });
  }
}
