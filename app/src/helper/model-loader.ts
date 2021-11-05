import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import enemiesJson from '../../public/txt/enemies.json';

export class modelLoader {
  private static models: { [key: string]: GLTF } = {};
  private static gltfLoader = new GLTFLoader();

  static async load(name: string): Promise<GLTF> {
    if (!this.models[name]) {
      const model = await this.gltfLoader.loadAsync(enemiesJson[name].model);
      this.models[name] = model;
      return model;
    } else {
      return this.models[name];
    }
  }
}
