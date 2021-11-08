import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EnemyFileLoader } from './enemy-file-loader';

export class modelLoader {
  private static models: { [key: string]: GLTF } = {};
  private static gltfLoader = new GLTFLoader();

  static async load(name: string): Promise<GLTF> {
    if (!this.models[name]) {
      const file = EnemyFileLoader.load();
      const model = await this.gltfLoader.loadAsync(file[name].model);
      this.models[name] = model;
      return model;
    } else {
      return this.models[name];
    }
  }
}
