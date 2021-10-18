import * as THREE from "three";
import {DIRECTION} from "./helper/direction";
import {
    AnimationAction, AnimationClip,
    AnimationMixer,
    Euler,
    Font,
    FontLoader,
    Mesh,
    MeshBasicMaterial,
    Scene,
    TextGeometry,
    Vector3
} from "three";


export class DamageText {

    private _fontLoader: FontLoader
    private _textMesh!: THREE.Mesh<TextGeometry, MeshBasicMaterial> // exclamation mark guarantees the existance
    private _animationMixer!: AnimationMixer
    private _animationAction!: AnimationAction

    constructor(damage: number, playerPosition: Vector3, playerDirection: DIRECTION, playerRotation: Euler, enemyPosition: Vector3, scene: Scene, enemyHeight: number) {
        this._fontLoader = new FontLoader()
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
                bevelSegments: 0
            })
            // textGeometry.scale(0.1, 0.1, 0.1)
            const textMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});
            this._textMesh = new THREE.Mesh(textGeometry, textMaterial);

            // The Box3 is a helper object to get the exact dimensions of the placed text object to deal with the needed offset
            const box = new THREE.Box3().setFromObject(this._textMesh);

            // Set the modifiers for the
            let zModifier = 1
            let xModifier = 1

            switch (playerDirection) {
                case DIRECTION.NORTH:
                    xModifier = -1
                    break;
                case DIRECTION.EAST:
                    zModifier = -1
                    break;
                case DIRECTION.WEST:
                    zModifier = 1
                    break;
                case DIRECTION.SOUTH:
                    xModifier = 1
            }

            // Place the text above the enemy
            // TODO does not work properly yet, the offset isn't fully correct
            const yDelta = box.getSize(this._textMesh.position).y
            const xDelta = xModifier * (box.max.x - box.min.x) / 2
            const zDelta = zModifier * (box.max.z - box.min.z) / 2
            this._textMesh.position.set(enemyPosition.x + xDelta, enemyPosition.y + enemyHeight / 2 + yDelta, enemyPosition.z + zDelta);

            // Set the text rotation to face the player
            this._textMesh.rotation.set(playerRotation.x, playerRotation.y, playerRotation.z)
            this._textMesh.name = "TEXT"
            this._textMesh.lookAt(playerPosition)

            scene.add(this._textMesh)

            // Animation
            const liftTrack3 = new THREE.BooleanKeyframeTrack('this._textMesh.material.transparent', [5, 6], [false, true])
            const liftTrack4 = new THREE.NumberKeyframeTrack(
                'this._textMesh.material.opacity',
                [6, 8],
                [1, 0])

            const animationClip = new AnimationClip("fadeOut", 10, [liftTrack3, liftTrack4])
            this._animationMixer = new AnimationMixer(this._textMesh)
            this._animationAction = this._animationMixer.clipAction(animationClip)

        })

    }

    get animationMixer(): AnimationMixer {
        return this._animationMixer
    }

    get animationAction(): AnimationAction {
        return this._animationAction
    }

}
