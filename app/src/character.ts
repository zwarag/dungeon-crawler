import { InputController } from "./input-controller";
import { StateMachine } from "./state-machine";

export class Character {
  private _input: InputController;
  private _state: StateMachine;
  constructor() {
    this._input = new InputController();
    this._state = new StateMachine();
  }
}
