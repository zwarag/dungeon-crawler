import { State, StateMachine } from './state-machine';
import { DamageText } from './damage-text';
import { AnimationClip, AnimationMixer, LoopOnce, Mesh } from 'three';

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

  constructor(parent: StateMachine<any>) {
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

  enter(): void {
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

    (window as any)._animationMixers.add(mixer);
    action.play();
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

  constructor(parent: StateMachine<any>) {
    super(parent);
  }

  enter(): void {
    const fadeOutAnimation = this.machine._owner._animations.fadeOut;
    const mixer: AnimationMixer = fadeOutAnimation.mixer;
    const mesh: Mesh = fadeOutAnimation.mesh;
    this.machine._owner._enemy.remove(mesh);
    (window as any)._animationMixers.remove(mixer);
  }

  exit(): void {
    throw new Error('Method not implemented.');
  }

  update(): void {
    throw new Error('Method not implemented.');
  }
}
