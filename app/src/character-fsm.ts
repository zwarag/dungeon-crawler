import { AnimationAction, LoopOnce } from 'three';

import { Animation } from './helper/animated';
import { State, StateMachine } from './state-machine';

export class CharacterFsm<T> extends StateMachine<T> {
  constructor(owner: T) {
    super(owner);
    this._init();
  }

  _init(): void {
    this.addState('idle', IdleState);
    this.addState('walk', WalkState);
    this.addState('die', DieState);
    this.addState('attack', AttackState);
  }
}

class IdleState extends State {
  declare _action: AnimationAction;

  enter(previousState: State): void {
    const animation: Animation = this.machine._owner.Element.animations['idle'];
    this._action = animation.mixer.clipAction(animation.clip);
    window._animationMixers.add(animation.mixer);

    if (previousState) {
      const previousAction = previousState._action;
      // this._action.reset()
      this._action.crossFadeFrom(previousAction, 1, true);
      this._action.play();
    } else {
      this._action.play();
    }
  }

  exit(): void {
    this._action.stop();
  }

  get name(): string {
    return 'idle';
  }
}

class WalkState extends State {
  declare _action: AnimationAction;

  enter(previousState: State): void {
    const animation: Animation = this.machine._owner.Element.animations['walk'];
    this._action = animation.mixer.clipAction(animation.clip);
    window._animationMixers.add(animation.mixer);
    animation.mixer.timeScale = 1.5;

    if (previousState) {
      const previousAction = previousState._action;
      this._action.loop = LoopOnce;
      this._action.clampWhenFinished = true;
      this._action.crossFadeFrom(previousAction, 0.5, true);
      this._action.play();
    } else {
      this._action.play();
    }

    animation.mixer.addEventListener('finished', this.cb);
    // window._player._allowAction = false
  }

  cb = () => {
    this.machine._owner.Element.position.set(
      ...this.machine._owner._targetPosition.toArray()
    );
    this.machine.setState('idle');
  };

  exit(): void {
    const animation: Animation = this.machine._owner.Element.animations['walk'];
    this._action.stop();
    animation.mixer.removeEventListener('finished', this.cb);
    // window._player._allowAction = true
  }

  get name(): string {
    return 'walk';
  }
}

class DieState extends State {
  declare _action: AnimationAction;

  get name(): string {
    return 'die';
  }

  enter(previousState: State): void {
    const animation: Animation = this.machine._owner.Element.animations['die'];
    this._action = animation.mixer.clipAction(animation.clip);
    window._animationMixers.add(animation.mixer);

    if (previousState) {
      const previousAction = previousState._action;
      // this._action.reset()
      this._action.loop = LoopOnce;
      this._action.clampWhenFinished = true;
      this._action.crossFadeFrom(previousAction, 0.5, true);
      this._action.play();
    } else {
      this._action.play();
    }

    animation.mixer.addEventListener('finished', this.cb);
  }

  exit(): void {
    const animation: Animation = this.machine._owner.Element.animations['die'];
    this._action.stop();
    animation.mixer.removeEventListener('finished', this.cb);
  }

  cb = () => {
    window._scene.remove(this.machine._owner.Element);
  };
}

class AttackState extends State {
  declare _action: AnimationAction;

  get name(): string {
    return 'attack';
  }

  enter(previousState: State): void {
    const animation: Animation =
      this.machine._owner.Element.animations['attack'];
    this._action = animation.mixer.clipAction(animation.clip);
    window._animationMixers.add(animation.mixer);

    if (previousState) {
      const previousAction = previousState._action;
      // this._action.reset()
      this._action.loop = LoopOnce;
      this._action.clampWhenFinished = true;
      this._action.crossFadeFrom(previousAction, 0.5, true);
      this._action.play();
    } else {
      this._action.play();
    }

    animation.mixer.addEventListener('finished', this.cb);
    // window._player._allowAction = false
  }

  exit(): void {
    const animation: Animation = this.machine._owner.Element.animations['walk'];
    this._action.stop();
    animation.mixer.removeEventListener('finished', this.cb);
    // window._player._allowAction = true
  }

  cb = () => {
    this.machine.setState('idle');
  };
}
