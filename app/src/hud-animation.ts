import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { HTMLELEMENTS } from './helper/const';

export class HudAnimation {
  private readonly _scene: THREE.Scene;
  private readonly _width: number;
  private readonly _height: number;
  private readonly _camera: THREE.Camera;
  private readonly _light: THREE.Light;
  private _renderer: THREE.Renderer;
  private _gltfLoader: GLTFLoader;
  private _controls: OrbitControls;

  constructor(element: HTMLCanvasElement) {
    this._scene = new THREE.Scene();

    this._width = HTMLELEMENTS.hudAnimationDisplay.clientWidth / 1.5;
    this._height = HTMLELEMENTS.hudAnimationDisplay.offsetHeight / 1.5;

    this._camera = new THREE.PerspectiveCamera(
      45,
      this._width / this._height,
      1,
      800
    );
    this._camera.position.y = 100;
    this._camera.position.z = 100;
    this._camera.position.x = 100;
    this._camera.lookAt(this._scene.position);

    this._renderer = new THREE.WebGLRenderer({
      antialias: false,
      canvas: element,
      alpha: true,
    });

    this._renderer.setSize(this._width, this._height);
    this._light = new THREE.DirectionalLight(0xfffffff, 1);
    this._light.position.set(50, 50, 50);

    this._scene.add(this._light);

    this._gltfLoader = new GLTFLoader();
    this._gltfLoader.load('./public/assets/char.glb', (gltf) => {
      const model = gltf.scene;
      this._scene.add(model);
    });

    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.autoRotate = true;

    this._animate();
  }

  _animate() {
    requestAnimationFrame(() => {
      this._animate();
    });

    this._controls.update();

    this._renderer.render(this._scene, this._camera);
  }
}
