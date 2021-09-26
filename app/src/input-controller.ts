import { KEYBOARDMAP } from "./helper/keyboard";
export class InputController {
  private _keys: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    space: boolean;
    shift: boolean;
  };

  constructor() {
    this._keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };
    document.addEventListener(
      "keydown",
      (event: KeyboardEvent) => this._onKey(event, true),
      false
    );
    document.addEventListener(
      "keyup",
      (event: KeyboardEvent) => this._onKey(event, false),
      false
    );
  }

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

  /**
   * Maps the Keyboard input to the _keys.
   * @param event The pressed Key
   * @param pressed If the Key is pressed or released
   */
  _onKey(event: KeyboardEvent, pressed: boolean): void {
    console.log("key");
    switch (event.key) {
      case KEYBOARDMAP.w:
        this._keys.forward = pressed;
        break;
      case KEYBOARDMAP.a:
        this._keys.left = pressed;
        break;
      case KEYBOARDMAP.s:
        this._keys.backward = pressed;
        break;
      case KEYBOARDMAP.d:
        this._keys.right = pressed;
        break;
      case KEYBOARDMAP.space:
        this._keys.space = pressed;
        break;
      case KEYBOARDMAP.shift:
        this._keys.shift = pressed;
        break;
    }
  }
}
