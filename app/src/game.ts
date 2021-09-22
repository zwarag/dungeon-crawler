import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Character } from "./character";
import { millisecondsToSeconds } from "./helper/time";

export class Game {
  private _threejs: THREE.WebGLRenderer;
  private _camera: THREE.PerspectiveCamera;
  private _scene: THREE.Scene;
  private _previousRAF: number | null;
  private _player: Character;

  constructor(element: HTMLCanvasElement) {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
      canvas: element,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(
      document.body.scrollWidth,
      document.body.scrollHeight
    );

    window.addEventListener(
      "resize",
      () => {
        this._onWindowResize();
      },
      false
    );

    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(75, 20, 0);

    this._scene = new THREE.Scene();

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 100, 10);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.bias = -0.001;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = 100;
    directionalLight.shadow.camera.right = -100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    this._scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 4);
    this._scene.add(ambientLight);

    // Camera
    // TODO: this is only temporary and should be swaped out for the actual implementaiton of the camera
    const controls = new OrbitControls(this._camera, this._threejs.domElement);
    controls.target.set(0, 20, 0);
    controls.update();

    // Skybox
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      "./img/cocoa_ft.jpg",
      "./img/cocoa_bk.jpg",
      "./img/cocoa_up.jpg",
      "./img/cocoa_dn.jpg",
      "./img/cocoa_rt.jpg",
      "./img/cocoa_lf.jpg",
    ]);
    this._scene.background = texture;

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0x202020,
      })
    );
    ground.castShadow = false;
    ground.receiveShadow = true;
    ground.rotation.x = -Math.PI / 2;
    this._scene.add(ground);

    // eslint-disable-next-line unicorn/no-null
    this._previousRAF = null;

    this._player = new Character();

    this._requestAnimationFrame();
  }

  private _onWindowResize() {
    this._threejs.setSize(window.innerWidth, window.innerHeight);
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
  }

  private _requestAnimationFrame() {
    requestAnimationFrame((timeElapsedMS) => {
      if (this._previousRAF === null) {
        this._previousRAF = timeElapsedMS;
      }

      this._requestAnimationFrame();

      this._threejs.render(this._scene, this._camera);
      this._calculateNextState(timeElapsedMS - this._previousRAF);
      this._previousRAF = timeElapsedMS;
    });
  }

  private _calculateNextState(timeDeltaMS: number) {
    const timeDeltaS = millisecondsToSeconds(timeDeltaMS);
  }
}
