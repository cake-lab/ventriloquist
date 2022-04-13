import { VRM, VRMSchema, VRMUtils } from "@pixiv/three-vrm";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { isGesturing, setIsGesturing } from "./gestures";

export let currentVrm: VRM;

//export let cameraVrmOffset: THREE.Vector3; // sssh nothing sketchy going on here

let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let clock: THREE.Clock;
let camera: THREE.Camera;
let light: THREE.Light;
let controls: OrbitControls;

// Mixer for gesture actions
export let mixer: THREE.AnimationMixer;

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
  camera.position.set(0.0, 1.6, 3);

  scene.add(camera);

  controls = new OrbitControls(camera, sceneCanvas);
  controls.screenSpacePanning = true;
  controls.target.set(0.0, 1.4, 0.0);
  controls.update();

  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1.0, 1.0, 1.0).normalize();
  scene.add(light);

  // Load the model into a vrm object
  currentVrm = await loadModel();

  mixer = new THREE.AnimationMixer(currentVrm.scene);
  mixer.addEventListener("finished", (e) => {
    console.log("Animation finished");
    setIsGesturing(false);
  });
  // Begin animation loop
  animate();
};

/**
 * Main animation loop
 */

let oldPosition = new THREE.Vector3();
let newPosition = new THREE.Vector3();
const animate = () => {
  requestAnimationFrame(animate);

  if (!currentVrm) return;

  const delta = clock.getDelta();

  if (isGesturing) {
    mixer.update(delta);
  }
  currentVrm.update(delta);

  renderer.render(scene, camera);
};

/**
 * Load a VRM model and add to currentVrms
 */
const loadModel = async (filename: string = "/rigs/tail_girl.vrm") => {
  console.log(`Loading rig ${filename}`);
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(filename);

  VRMUtils.removeUnnecessaryJoints(gltf.scene);
  VRMUtils.removeUnnecessaryVertices(gltf.scene);
  const vrm = await VRM.from(gltf);

  scene.add(vrm.scene);
  vrm.scene.rotation.y = Math.PI;
  return vrm;
};
