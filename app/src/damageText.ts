import * as THREE from 'three';
import { DIRECTION } from './helper/direction';
import {
  AnimationClip,
  AnimationMixer,
  Euler,
  FontLoader,
  Mesh,
  MeshBasicMaterial,
  Scene,
  TextGeometry,
  Vector3,
} from 'three';

export class DamageText {
  private _fontLoader: FontLoader;

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
    this._fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
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
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      // The Box3 is a helper object to get the exact dimensions of the placed text object to deal with the needed offset
      const box = new THREE.Box3().setFromObject(textMesh);

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
      const yDelta = box.getSize(textMesh.position).y;
      const xDelta = (xModifier * (box.max.x - box.min.x)) / 2;
      const zDelta = (zModifier * (box.max.z - box.min.z)) / 2;
      textMesh.position.set(
        enemyPosition.x + xDelta,
        enemyPosition.y + enemyHeight / 2 + yDelta,
        enemyPosition.z + zDelta
      );

      // Set the text rotation to face the player
      textMesh.rotation.set(
        playerRotation.x,
        playerRotation.y,
        playerRotation.z
      );
      textMesh.name = 'TEXT';
      textMesh.lookAt(playerPosition);
      // sceneCallback(textMesh)

      // Animation
      // TODO: statemaschine
      const liftTrack4 = new THREE.NumberKeyframeTrack(
        '.material.opacity',
        [0, 1],
        [1, 0]
      );
      // textMesh.material.opacity = 1
      const animationClip = new AnimationClip('fadeOut', 2, [liftTrack4]);
      const animationMixer = new AnimationMixer(textMesh);
      animationMixerCallback(animationMixer, animationClip, textMesh);
    });
  }
}
