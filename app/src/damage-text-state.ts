import { HiddenState, ShownState, State, StateMachine } from './state-machine';
import { CharacterBase } from './character';
import { DamageText } from './damage-text';

export class DamageTextState extends StateMachine {
  constructor(owner: DamageText) {
    super(owner);
    this._init();
  }

  _init() {
    this.addState('hidden', HiddenState);
    this.addState('shown', ShownState);
  }
}

class ShownState extends State {
  get name(): string {
    return 'shown';
  }
  constructor(parent: StateMachine) {
    super(parent);
  }
  enter(state: State): void {
    // execute these frames.
    // after that
    this.machine.setState('hidden');
    this.machine._owner._animations;
  }
  exit(): void {
    throw new Error('Method not implemented.');
  }
  update(): void {
    throw new Error('Method not implemented.');
  }
}

class HiddenState extends State {
  get name(): string {
    return 'hidden';
  }
  constructor(parent: StateMachine) {
    super(parent);
  }
  enter(state: State): void {
    // IS shown, and shall be hidden.
    // TODO: execute the keyframes to hide the text
  }
  exit(): void {
    // was hidden, and will be shown
  }
  update(): void {
    throw new Error('Method not implemented.');
  }
}
