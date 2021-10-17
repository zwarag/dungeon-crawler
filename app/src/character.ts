import {GLOBAL_Y} from "./helper/const";
import {DIRECTION} from "./helper/direction";
import {TimeInSeconds} from "./helper/time";
import * as THREE from "three";
import {InputController, KeyBoardInputController} from "./input-controller";
import {StateMachine} from "./state-machine";
import text from '../public/txt/text.json'
import {Camera, PerspectiveCamera, Scene, Vector3} from "three";
import {GENDER} from "./helper/gender";
import {randomRange} from "./helper/random";

export class Character {
    /** A InputController for Keyboard or AI Controlled inputs. */
    private _input: InputController;

    /** The Statemachine used for animations */
    private _state: StateMachine;
    /**
     * The actual redered object.
     * Note: THREE.Mesh extends THREE.Object3D which has `position` property
     */
    private _3DElement: THREE.Mesh;

    /** The velocity a Charater is moving. Backwards, idle, forwards. */
    private _velocity: -1 | 0 | 1;

    /** A simplified version of that THREE.Object3D would offer. */
    private _direction: DIRECTION;

    /** The gender of the character, used for voice feedback.*/
    private _gender: number;

    /** The health a character has. */
    private _health: number;

    /**
     * How accurate the character attacks
     */
    private _accuracy: number

    /**
     * The minimum number a character does if it hits.
     */
    private _minDamage: number

    /**
     * The maximum number a character does if it hits, besides crits.
     */
    private _maxDamage: number

    /**
     * The player wants to attack.
     */
    private _attacks: boolean

    /**
     * The current experience of the character.
     */

    private _experience: number




    private _camera: PerspectiveCamera;


    constructor(camera: PerspectiveCamera) {
        // game parts
        this._gender = randomRange(GENDER.MALE, GENDER.FEMALE) // currently determined randomly
        this._health = 100
        this._minDamage = 10
        this._maxDamage = 18
        this._accuracy = 80
        this._experience = 0

        // threejs parts
        this._input = new KeyBoardInputController();
        this._state = new StateMachine();
        this._velocity = 0;
        this._attacks = false
        this._direction = DIRECTION.NORTH;
        this._camera = camera
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const loader = new THREE.TextureLoader();
        const material = [
            new THREE.MeshBasicMaterial({map: loader.load("./img/player_ft.jpg")}),
            new THREE.MeshBasicMaterial({map: loader.load("./img/player_bk.jpg")}),
            new THREE.MeshBasicMaterial({map: loader.load("./img/player_up.jpg")}),
            new THREE.MeshBasicMaterial({map: loader.load("./img/player_dn.jpg")}),
            new THREE.MeshBasicMaterial({map: loader.load("./img/player_rt.jpg")}),
            new THREE.MeshBasicMaterial({map: loader.load("./img/player_lf.jpg")}),
        ];
        this._3DElement = new THREE.Mesh(geometry, material);
        // const startPosition = new THREE.Vector3(-4.5, GLOBAL_Y, -4.5);
        // this._3DElement.position.set(...startPosition.toArray());
    }

    get Element(): THREE.Mesh {
        return this._3DElement;
    }

    /** This function shall be called after every drawn AnimationFrame. */
    update(delta: TimeInSeconds): void {
        // this._state.update(delta, this._input)

        const keys = {...this._input.keys};
        if (keys.forward) {
            this._velocity = 1;
        } else if (keys.backward) {
            this._velocity = -1;
        } else if (keys.left) {
            this._direction = (4 + this._direction - 1) % 4;
            this.Element.rotateY(Math.PI / 2);
            this._camera.rotateY(Math.PI / 2);
        } else if (keys.right) {
            this._direction = (this._direction + 1) % 4;
            this.Element.rotateY(-Math.PI / 2);
            this._camera.rotateY(-Math.PI / 2);
        } else if (keys.action) {
            this._attacks = true
        } else {
            this._attacks = false
            this._velocity = 0;
        }

        this._input.resetKeys()

    }

    attack(): number {
        let damage = 0;
        const chance = Math.random() * 100
        if (chance <= this._accuracy) {
            damage = randomRange(this._minDamage, this._maxDamage)
            if (chance > 90) {
                damage *= 2
            }
        }
        return damage
    }



    getCharacterMovement(): Vector3 {
        if (this._velocity != 0) {
            switch (this._direction) {
                case DIRECTION.NORTH:
                    return new Vector3(this.Element.position.x + this._velocity, this.Element.position.y, this.Element.position.z)
                case DIRECTION.EAST:
                    return new Vector3(this.Element.position.x, this.Element.position.y, this.Element.position.z - this._velocity)
                case DIRECTION.SOUTH:
                    return new Vector3(this.Element.position.x - this._velocity, this.Element.position.y, this.Element.position.z)
                case DIRECTION.WEST:
                    return new Vector3(this.Element.position.x, this.Element.position.y, this.Element.position.z + this._velocity)
            }
        }
        return this.Element.position
    }

    get attacks(): boolean {
        return this._attacks
    }


    takeHit(damage: number): void {
        this._health -= damage
        console.log(`The player has ${this._health} left`)
    }

    get health(): number {
        return this._health
    }

    get direction(): DIRECTION {
        return this._direction
    }


    speak(type: string): void {

        try {
            // avoids to build up a queue of utterances, cancels the current utterance if there is one
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel()
            }
            const voices = window.speechSynthesis.getVoices()
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const sentences = text[type] // <-- @harrys, eventuell hast du dazu eine Idee, typescript meckert beim dynamsichen Zugriff mittels string, da das json file nicht getyped ist.
            const sentence = sentences[Math.floor(Math.random() * sentences.length)] // select a random sentence
            const utterThis = new SpeechSynthesisUtterance(sentence)
            utterThis.voice = voices[this._gender]
            window.speechSynthesis.speak(utterThis) // <-- commented for now, otherwise this might be annoying
        } catch (error) {
            console.log("Browser not supported for voice output:" + error)
        }
    }





    /**
     * Removed from the character logic, moved to the game loop.
     * @deprecated
     */
    moveCharacter(scene: Scene): void {
        if (this._velocity != 0) {

            let newPosition: number
            switch (this._direction) {
                case DIRECTION.NORTH:
                    newPosition = this.Element.position.x + this._velocity
                    if (this.checkFreeSpace(newPosition, this.Element.position.z, scene)) {
                        this.Element.position.setX(newPosition);
                        this._camera.position.setX(newPosition)
                    } else {
                        this.speak("blocked")
                    }
                    break;
                case DIRECTION.EAST:
                    newPosition = this.Element.position.z - this._velocity
                    if (this.checkFreeSpace(this.Element.position.x, newPosition, scene)) {
                        this.Element.position.setZ(newPosition);
                        this._camera.position.setZ(newPosition);
                    } else {
                        this.speak("blocked")
                    }
                    break;
                case DIRECTION.SOUTH:
                    newPosition = this.Element.position.x - this._velocity
                    if (this.checkFreeSpace(newPosition, this.Element.position.z, scene)) {
                        this.Element.position.setX(newPosition);
                        this._camera.position.setX(newPosition)
                    } else {
                        this.speak("blocked")
                    }
                    break;
                case DIRECTION.WEST:
                    newPosition = this.Element.position.z + this._velocity
                    if (this.checkFreeSpace(this.Element.position.x, newPosition, scene)) {
                        this.Element.position.setZ(newPosition);
                        this._camera.position.setZ(newPosition)
                    } else {
                        this.speak("blocked")
                    }
                    break;
            }
        }
    }

    /**
     * @deprecated
     */
    checkFreeSpace(x: number, z: number, scene: Scene): boolean {
        const intersections = scene.children.filter(value =>
            value.position.z === z && value.position.x === x
        )
        return intersections.length === 0
    }


}
