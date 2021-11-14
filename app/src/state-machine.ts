import { AnimationAction } from 'three';

type StateConstructor = new (parent: StateMachine<any>) => State;

export abstract class State {
  declare _action: AnimationAction;
  machine: StateMachine<any>;

  abstract get name(): string;

  constructor(machine: StateMachine<any>) {
    this.machine = machine;
  }

  abstract enter(previousState: State): void;

  abstract exit(): void;
}

export class StateMachine<T> {
  private _currentState: State | null;
  _owner: T; // actually only used to access the animations.
  private _states: { [key: string]: StateConstructor };

  constructor(owner: T) {
    this._states = {};
    this._owner = owner;
    this._currentState = null as unknown as State;
  }

  // creates the meta for a new state, defines all `f`
  addState(key: string, state: StateConstructor): void {
    this._states[key] = state;
  }

  // sets the new state of the statemachine `f` -> `g`
  setState(key: string): void {
    const previousState = this._currentState;
    if (previousState?.name === key) {
      return;
    }
    previousState?.exit();
    const state = new this._states[key](this);
    this._currentState = state;
    state.enter(previousState!);
  }

  getCurrentState(): State {
    return this._currentState!;
  }
}
