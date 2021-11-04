import { State, StateMachine } from './state-machine';
import { Enemy } from './enemy';
import { Animation } from './helper/animated';
import { LoopOnce, AnimationAction, AnimationMixer } from 'three';

export class EnemyFsm extends StateMachine<Enemy> {
  constructor(owner: Enemy) {
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
  private _action: AnimationAction;

  enter(state: State): void {
    const animation: Animation = this.machine._owner.Element.animations['idle'];
    this._action = animation.mixer.clipAction(animation.clip);
    window._animationMixers.add(animation.mixer);
    this._action.play();
  }

  exit(): void {
    this._action.stop();
  }

  get name(): string {
    return 'idle';
  }
}

class WalkState extends State {
  private _action: AnimationAction;

  enter(state: State): void {
    const animation: Animation = this.machine._owner.Element.animations['walk'];
    this._action = animation.mixer.clipAction(animation.clip);
    this._action.loop = LoopOnce;
    this._action.clampWhenFinished = true;
    window._animationMixers.add(animation.mixer);

    this._action.play();
    animation.mixer.addEventListener('finished', this.cb);
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
  }

  get name(): string {
    return 'walk';
  }
}

class DieState extends State {
  private _action: AnimationAction;

  get name(): string {
    return 'die';
  }

  enter(state: State): void {
    const animation: Animation = this.machine._owner.Element.animations['die'];
    this._action = animation.mixer.clipAction(animation.clip);
    this._action.loop = LoopOnce;
    this._action.clampWhenFinished = true;
    window._animationMixers.add(animation.mixer);

    this._action.play();
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
  private _action: AnimationAction;

  get name(): string {
    return 'attack';
  }

  enter(state: State): void {
    const animation: Animation =
      this.machine._owner.Element.animations['attack'];
    this._action = animation.mixer.clipAction(animation.clip);
    this._action.loop = LoopOnce;
    this._action.clampWhenFinished = true;
    window._animationMixers.add(animation.mixer);

    this._action.play();
    animation.mixer.addEventListener('finished', this.cb);
  }

  exit(): void {
    const animation: Animation = this.machine._owner.Element.animations['walk'];
    this._action.stop();
    animation.mixer.removeEventListener('finished', this.cb);
  }

  cb = () => {
    this.machine.setState('idle');
  };
}
