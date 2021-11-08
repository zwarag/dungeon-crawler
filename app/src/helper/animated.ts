import { AnimationClip, AnimationMixer, Mesh } from 'three';

export interface Animated {
  _animations: Record<string, any>;
}

export interface Animation {
  clip: AnimationClip;
  mixer: AnimationMixer;
  mesh: Mesh;
}
