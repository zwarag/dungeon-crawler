import { KEYBOARDMAP } from "./helper/keyboard";

export interface ActionKeys {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  action: boolean;
  modulator: boolean;
}

export abstract class InputController {
  private readonly _ro_keys: ActionKeys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    action: false,
    modulator: false,
  };

  /** The keys available to  */
  protected _keys: ActionKeys = { ...this._ro_keys };

  public get keys(): ActionKeys {
    return this._keys;
  }

  constructor() {
    this.resetKeys();
  }

  /** Resets the keys to the initial state. */
  resetKeys(): void {
    this._keys = { ...this._ro_keys };
  }
}

export class KeyBoardInputController extends InputController {
  /** Wheter the keyboard input has been debounced. */
  private _debounced = true;

  /** A reference to the KeyDownEvent that we add to the document. */
  private _keyDownEventReferece = (event: KeyboardEvent) => {
    this._onKey(event, true);
  };

  constructor() {
    super();
    this.setKeyDownEvent();
  }

  public get keys(): ActionKeys {
    const returnValue = { ...this._keys };
    // this.resetKeys();
    this._debounced = true;
    return returnValue;
  }

  /**
   * Sets the keyDown event.
   * This function can be called after `unsetKeyDownEvent`.
   */
  setKeyDownEvent(): void {
    document.addEventListener("keydown", this._keyDownEventReferece, false);
  }

  /**
   * Unsets the keyDown event.
   * Use this function if you need to temporarly remove the event in case it conflicts with another one.
   */
  unsetKeyDownEvent(): void {
    document.removeEventListener("keydown", this._keyDownEventReferece, false);
  }

  /**
   * Maps the Keyboard input to the _keys.
   * @param event The pressed Key
   * @param pressed If the Key is pressed or released
   */
  _onKey(event: KeyboardEvent, pressed?: boolean): void {
    if (!this._debounced) {
      this.resetKeys();
    }
    switch (event.key) {
      case KEYBOARDMAP.w:
        this._keys.forward = pressed ?? true;
        break;
      case KEYBOARDMAP.a:
        this._keys.left = pressed ?? true;
        break;
      case KEYBOARDMAP.s:
        this._keys.backward = pressed ?? true;
        break;
      case KEYBOARDMAP.d:
        this._keys.right = pressed ?? true;
        break;
      case KEYBOARDMAP.space:
        this._keys.action = pressed ?? true;
        break;
      case KEYBOARDMAP.shift:
        this._keys.modulator = pressed ?? true;
        break;
    }
    this._debounced = false;
  }
}
