import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function _load(file: Record<string, unknown>): Record<string, unknown> {
  return file;
}

export async function loadGltf(
  jsonFile: Record<string, unknown>,
  name: string
): Promise<GLTF> {
  const file = _load(jsonFile);
  if (file[name]) {
    return await new GLTFLoader().loadAsync(file[name].model);
  }
  return await new GLTFLoader().loadAsync(file.model);
}
