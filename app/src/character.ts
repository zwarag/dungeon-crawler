import { GLOBAL_Y } from "./helper/const";
import { DIRECTION } from "./helper/direction";
import { TimeInSeconds } from "./helper/time";
import * as THREE from "three";
import { InputController, KeyBoardInputController } from "./input-controller";
import { StateMachine } from "./state-machine";

export class Character {
  private _input: InputController;
  private _state: StateMachine;
  private _position: THREE.Vector3;
  private _velocity: -1 | 0 | 1;
  private _direction: DIRECTION;
  private _3DElement: THREE.Mesh;
  constructor() {
    this._input = new KeyBoardInputController();
    this._state = new StateMachine();
    this._position = new THREE.Vector3(-4.5, GLOBAL_Y, -4.5);
    this._velocity = 0;
    this._direction = DIRECTION.NORTH;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0x00ff00,
    //   wireframe: true,
    //   wireframeLinewidth: 2,
    // });
    const loader = new THREE.TextureLoader();
    const material = [
      new THREE.MeshBasicMaterial({ map: loader.load("./img/player_ft.jpg") }),
      new THREE.MeshBasicMaterial({ map: loader.load("./img/player_bk.jpg") }),
      new THREE.MeshBasicMaterial({ map: loader.load("./img/player_up.jpg") }),
      new THREE.MeshBasicMaterial({ map: loader.load("./img/player_dn.jpg") }),
      new THREE.MeshBasicMaterial({ map: loader.load("./img/player_rt.jpg") }),
      new THREE.MeshBasicMaterial({ map: loader.load("./img/player_lf.jpg") }),
    ];
    this._3DElement = new THREE.Mesh(geometry, material);
    this._3DElement.position.set(...this._position.toArray());
  }

  get Element(): THREE.Mesh {
    return this._3DElement;
  }

  update(delta: TimeInSeconds): void {
    //console.log(this);
    // this._state.update(delta, this._input)
    // console.log(this._position);
    const position = this._position;

    if (this._input.keys.forward) {
      this._velocity = 1;
    } else if (this._input.keys.backward) {
      this._velocity = 1;
    } else if (this._input.keys.left) {
      this._direction = (this._direction - 1) % 4;
      this.Element.rotateY(Math.PI / 2);
    } else if (this._input.keys.right) {
      this._direction = (this._direction + 1) % 4;
      this.Element.rotateY(-Math.PI / 2);
    } else {
      this._velocity = 0;
    }

    if (this._velocity != 0) {
      console.log("direction", this._direction, "velocity", this._velocity);
      switch (this._direction) {
        case DIRECTION.NORTH:
          console.log("north");
          this.Element.position.setX(this.Element.position.x + this._velocity);
          //this.Element.translateOnAxis(
          //  new THREE.Vector3(1, 0, 0),
          //  this._velocity
          //);
          break;
        case DIRECTION.EAST:
          console.log("east");
          this.Element.position.setZ(this.Element.position.z - this._velocity);
          //this.Element.translateOnAxis(
          //  new THREE.Vector3(0, 0, 1),
          //  this._velocity
          //);
          break;
        case DIRECTION.SOUTH:
          console.log("south");
          this.Element.position.setX(this.Element.position.x - this._velocity);
          //this.Element.translateOnAxis(
          //  new THREE.Vector3(-1, 0, 0),
          //  this._velocity
          //);
          break;
        case DIRECTION.WEST:
          console.log("west");
          this.Element.position.setZ(this.Element.position.z + this._velocity);
          //this.Element.translateOnAxis(
          //  new THREE.Vector3(0, 0, -1),
          //  this._velocity
          //);
          break;
      }
    }
  }
}
