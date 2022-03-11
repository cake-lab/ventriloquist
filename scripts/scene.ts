import { VRM, VRMUtils } from "@pixiv/three-vrm";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export let currentVrm: VRM;

let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let clock: THREE.Clock;
let camera: THREE.Camera;
let light: THREE.Light;
let controls: OrbitControls;

export const startScene = async (
  sceneCanvas: HTMLCanvasElement
): Promise<void> => {
  console.log(`Starting three.js scene`);

  // Set scene canvas css
  sceneCanvas.style.width = `${window.innerWidth}px`;
  sceneCanvas.style.height = `${window.innerHeight}px`;

  sceneCanvas.width = sceneCanvas.clientWidth;
  sceneCanvas.height = sceneCanvas.clientHeight;

  // Setup basic three.js environment
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeaeaea);

  renderer = new THREE.WebGLRenderer({ canvas: sceneCanvas });
  clock = new THREE.Clock();

  camera = new THREE.PerspectiveCamera(
    35,
    sceneCanvas.clientWidth / sceneCanvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0.0, 1.4, 0.7);

  controls = new OrbitControls(camera, sceneCanvas);
  controls.screenSpacePanning = true;
  controls.target.set(0.0, 1.4, 0.0);
  controls.update();

  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1.0, 1.0, 1.0).normalize();
  scene.add(light);

  // Load as many models as there are people
  await loadModel();

  // Begin animation loop
  animate();
};

/**
 * Main animation loop
 */
const animate = () => {
  requestAnimationFrame(animate);

  if (currentVrm) {
    currentVrm.update(clock.getDelta());
  }

  renderer.render(scene, camera);
};

/**
 * Load a VRM model and add to currentVrms
 */
const loadModel = async (filename: string = "/rigs/avatar_sample_a.vrm") => {
  console.log(`Loading rig ${filename}`);
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(filename);

  VRMUtils.removeUnnecessaryJoints(gltf.scene);
  const vrm = await VRM.from(gltf);
  scene.add(vrm.scene);

  currentVrm = vrm;
  currentVrm.scene.rotation.y = Math.PI;
};
