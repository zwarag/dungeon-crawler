import { KeyBoardInputController } from "./input-controller";

type StateConstructor = new (parent: StateMachine) => State;
export abstract class State {
  parent: StateMachine;
  abstract get name(): string;

  constructor(parent: StateMachine) {
    this.parent = parent;
  }

  abstract enter(state: State): void;
  abstract exit(): void;
  abstract update(timeDelta?: number, input?: unknown): void;
}

export class StateMachine {
  private _currentState: State;
  private _states: { [key: string]: StateConstructor };
  constructor() {
    this._states = {};
    // eslint-disable-next-line unicorn/no-null
    this._currentState = new IdleState(this);
  }

  addState(key: string, state: StateConstructor): void {
    this._states[key] = state;
  }

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

  update(timeDelta?: number, input?: unknown): void {
    this._currentState.update(timeDelta, input);
  }
}

/**
 * A Character is just stading around.
 */
class IdleState extends State {
  get name(): string {
    return "idle";
  }
  constructor(parent: StateMachine) {
    super(parent);
  }
  enter(state: State): void {
    throw new Error("Method not implemented.");
  }
  exit(): void {
    throw new Error("Method not implemented.");
  }
  update(): void {
    throw new Error("Method not implemented.");
  }
}

/**
 * A Character is walking towards something.
 */
class WalkState extends State {
  get name(): string {
    throw new Error("Method not implemented.");
  }
  enter(state: State): void {
    throw new Error("Method not implemented.");
  }
  exit(): void {
    throw new Error("Method not implemented.");
  }
  update(): void {
    throw new Error("Method not implemented.");
  }
}

/**
 * A Character is turning towards something.
 * AKA is changing direction.
 */
class TurningState extends State {
  get name(): string {
    throw new Error("Method not implemented.");
  }
  enter(state: State): void {
    throw new Error("Method not implemented.");
  }
  exit(): void {
    throw new Error("Method not implemented.");
  }
  update(): void {
    throw new Error("Method not implemented.");
  }
}

/**
 * A Character is attacking something.
 */
class AttackState extends State {
  get name(): string {
    throw new Error("Method not implemented.");
  }
  enter(state: State): void {
    throw new Error("Method not implemented.");
  }
  exit(): void {
    throw new Error("Method not implemented.");
  }
  update(): void {
    throw new Error("Method not implemented.");
  }
}

/**
 * A Character is hit by something.
 */
class HitState extends State {
  get name(): string {
    throw new Error("Method not implemented.");
  }
  enter(state: State): void {
    throw new Error("Method not implemented.");
  }
  exit(): void {
    throw new Error("Method not implemented.");
  }
  update(): void {
    throw new Error("Method not implemented.");
  }
}
