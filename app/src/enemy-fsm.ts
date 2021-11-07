import { State, StateMachine } from './state-machine';
import { Enemy } from './enemy';
import { Player } from './player';
import { Animation } from './helper/animated';
import { LoopOnce, AnimationAction } from 'three';

export class EnemyFsm extends StateMachine<any> {
  constructor(owner: any) {
    super(owner);
    this._init();
  }

  _init() {
    this.addState('idle', IdleState);
    this.addState('walk', WalkState);
    this.addState('die', DieState);
    this.addState('attack', AttackState);
  }
}

class IdleState extends State {
  _action: AnimationAction;

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
  _action: AnimationAction;

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
  _action: AnimationAction;

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
  _action: AnimationAction;

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
