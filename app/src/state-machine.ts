import { CharacterBase } from './character';
import { DamageText } from './damage-text';

type StateConstructor = new (parent: StateMachine) => State;

export abstract class State {
  machine: StateMachine;

  abstract get name(): string;

  constructor(machine: StateMachine) {
    this.machine = machine;
  }

  abstract enter(state: State): void;

  abstract exit(): void;

  abstract update(timeDelta?: number, input?: unknown): void;
}

export class StateMachine {
  private _currentState: State;
  _owner: CharacterBase | DamageText; // actually only used to access the animations.
  private _states: { [key: string]: StateConstructor };

  constructor(owner: CharacterBase | DamageText) {
    this._states = {};
    // eslint-disable-next-line
    this._owner = owner;
    this._currentState = null as unknown as State;
    // this._currentState = new StartState(this);
  }

  // creates the meta for a new state, defines all `f`
  addState(key: string, state: StateConstructor): void {
    this._states[key] = state;
  }

  // sets the new state of the statemachine `f` -> `g`
  setState(key: string): void {
    const previousState = this._currentState;
    if (previousState.name === key) {
      return;
    }
    previousState.exit();
    const state = new this._states[key](this);
    this._currentState = state;
    state.enter(previousState);
  }

  getCurrentState(): State {
    return this._currentState;
  }

  update(timeDelta?: number, input?: unknown): void {
    this._currentState.update(timeDelta, input);
  }
}

/**
 * A Character is just standing around.
 */
export class IdleState extends State {
  get name(): string {
    return 'idle';
  }

  constructor(parent: StateMachine) {
    super(parent);
  }

  enter(state: State): void {
    throw new Error('Method not implemented.');
  }

  exit(): void {
    throw new Error('Method not implemented.');
  }

  update(): void {
    throw new Error('Method not implemented.');
  }
}

/**
 * A Character is walking towards something.
 */
class WalkState extends State {
  get name(): string {
    throw new Error('Method not implemented.');
  }

  enter(state: State): void {
    throw new Error('Method not implemented.');
  }

  exit(): void {
    throw new Error('Method not implemented.');
  }

  update(): void {
    throw new Error('Method not implemented.');
  }
}

/**
 * A Character is turning towards something.
 * AKA is changing direction.
 */
class TurningState extends State {
  get name(): string {
    throw new Error('Method not implemented.');
  }

  enter(state: State): void {
    throw new Error('Method not implemented.');
  }

  exit(): void {
    throw new Error('Method not implemented.');
  }

  update(): void {
    throw new Error('Method not implemented.');
  }
}

/**
 * A Character is attacking something.
 */
class AttackState extends State {
  get name(): string {
    throw new Error('Method not implemented.');
  }

  enter(state: State): void {
    throw new Error('Method not implemented.');
  }

  exit(): void {
    throw new Error('Method not implemented.');
  }

  update(): void {
    throw new Error('Method not implemented.');
  }
}

/**
 * A Character is hit by something.
 */
class HitState extends State {
  get name(): string {
    throw new Error('Method not implemented.');
  }

  enter(state: State): void {
    throw new Error('Method not implemented.');
  }

  exit(): void {
    throw new Error('Method not implemented.');
  }

  update(): void {
    throw new Error('Method not implemented.');
  }
}
