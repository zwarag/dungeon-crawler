import { KEYBOARDMAP } from "./helper/keyboard";

export abstract class InputController {
  constructor(
    private _keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    }
  ) {}

  public get keys(): {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    space: boolean;
    shift: boolean;
  } {
    return this._keys;
  }
}

export class KeyBoardInputController extends InputController {
  constructor(private _released = true) {
    super();
    document.addEventListener(
      "keydown",
      (event: KeyboardEvent) => {
        this._onKey(event, true);
        this._released = false;
      },
      false
    );
    document.addEventListener(
      "keyup",
      (event: KeyboardEvent) => {
        this._onKey(event, false);
        this._released = true;
      },
      false
    );
  }

  /**
   * Maps the Keyboard input to the _keys.
   * @param event The pressed Key
   * @param pressed If the Key is pressed or released
   */
  _onKey(event: KeyboardEvent, pressed: boolean): void {
    //console.log("key", event, pressed);
    switch (event.key) {
      case KEYBOARDMAP.w:
        this._keys.forward = pressed && !this._released;
        break;
      case KEYBOARDMAP.a:
        this._keys.left = pressed && !this._released;
        break;
      case KEYBOARDMAP.s:
        this._keys.backward = pressed && !this._released;
        break;
      case KEYBOARDMAP.d:
        this._keys.right = pressed && !this._released;
        break;
      case KEYBOARDMAP.space:
        this._keys.space = pressed && !this._released;
        break;
      case KEYBOARDMAP.shift:
        this._keys.shift = pressed && !this._released;
        break;
    }
    this._released = false;
  }
}
