import { HiddenState, ShownState, State, StateMachine } from './state-machine';
import { CharacterBase } from './character';
import { DamageText } from './damage-text';
import { AnimationAction } from 'three';

export class DamageTextState extends StateMachine<DamageText> {
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

  cb = () => {
    this.finished();
  };

  finished() {
    this.cleanup();
    this.machine._owner.SetState('hidden');
  }

  cleanup() {
    window._scene.remove(this.machine._owner._textMesh);
    this.machine._owner._animations.fadeOut
      .getMixer()
      .removeEventListener('finished', () => {
        this.cb;
      });
    // TODO: maybe also remove from window._animationsMixer?
  }

  enter(state: State): void {
    // execute these frames.
    // after that
    this.machine.setState('shown');
    const currentAction: AnimationAction =
      this.machine._owner._animations.fadeOut;
    const mixer = currentAction.mixer;
    mixer.addEventListener('finished', () => {
      console.info('AAA');
      this.cb;
    });
    if (!state) {
      window._animationMixers.push(mixer);
      currentAction.time = 0;
      currentAction.enabled = true;
      // currActIion.setEffectiveTimeScale(1);
      // currentAction.setEffectiveWeight(1);
      currentAction.play();
    } else {
      currentAction.play();
    }
  }
  exit(): void {
    this.cleanup();
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
