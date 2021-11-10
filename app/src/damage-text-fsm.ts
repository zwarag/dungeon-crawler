import { HiddenState, ShownState, State, StateMachine } from './state-machine';
import { CharacterBase } from './character';
import { DamageText } from './damage-text';
import {
  LoopOnce,
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Mesh,
} from 'three';

export class DamageTextFsm extends StateMachine<DamageText> {
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
    this.machine.setState('hidden');
  }

  cleanup() {
    const mixer: AnimationMixer = this.machine._owner._animations.fadeOut.mixer;
    mixer.removeEventListener('finished', () => {
      this.cb;
    });
  }

  enter(state: State): void {
    const fadeOutAnimation = this.machine._owner._animations.fadeOut;
    const mesh: Mesh = fadeOutAnimation.mesh;
    const mixer: AnimationMixer = fadeOutAnimation.mixer;
    const clip: AnimationClip = fadeOutAnimation.clip;
    const action = mixer.clipAction(clip);
    action.loop = LoopOnce;
    action.clampWhenFinished = true;
    this.machine._owner._enemy.add(mesh);

    mixer.addEventListener('finished', () => {
      this.cb;
    });

    // if (!state) {
    window._animationMixers.add(mixer);
    action.play();
    // } else {
    //   action.play();
    // }
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

    const fadeOutAnimation = this.machine._owner._animations.fadeOut;
    const mixer: AnimationMixer = fadeOutAnimation.mixer;
    const mesh: Mesh = fadeOutAnimation.mesh;
    this.machine._owner._enemy.remove(mesh);
    window._animationMixers.remove(mixer);

    // TODO: execute the keyframes to hide the text
  }

  exit(): void {
    throw new Error('Method not implemented.');
  }

  update(): void {
    throw new Error('Method not implemented.');
  }
}
