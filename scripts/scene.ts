import { VRM, VRMSchema, VRMUtils } from "@pixiv/three-vrm";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { isGesturing, setIsGesturing } from "./gestures";
import { Model } from "../types/main";

export const DEFAULT_MODELS: Model[] = [
  {
    name: "Default Girl",
    url: "/default/models/avatar_sample_a.vrm",
  },

  {
    name: "Default Boy",
    url: "/default/models/free_male.vrm",
  },
  {
    name: "Tail Girl",
    url: "/default/models/tail_girl.vrm",
  },
];

export let currentModel: Model = DEFAULT_MODELS[0];
export let currentVrm: VRM;

//export let cameraVrmOffset: THREE.Vector3; // sssh nothing sketchy going on here

export let scene: THREE.Scene;
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
  camera.position.set(0.0, 1.6, 1);

  scene.add(camera);

  controls = new OrbitControls(camera, sceneCanvas);
  controls.screenSpacePanning = true;
  controls.target.set(0.0, 1.4, 0.0);
  controls.update();

  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1.0, 1.0, 1.0).normalize();
  scene.add(light);

  // Load the model into a vrm object (sets currentVrm)
  await loadModel(currentModel);

  // Begin animation loop
  animate();
};

/**
 * Main animation loop
 */

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
export const loadModel = async (model: Model) => {
  if (currentVrm) {
    console.log("Removing old model");
    scene.remove(currentVrm.scene);
  }

  console.log(`Loading rig ${model.url}`);
  //currentModelFile = file;
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(model.url);

  VRMUtils.removeUnnecessaryJoints(gltf.scene);
  VRMUtils.removeUnnecessaryVertices(gltf.scene);
  const vrm = await VRM.from(gltf);

  scene.add(vrm.scene);
  vrm.scene.rotation.y = Math.PI;
  currentVrm = vrm;

  // Set a new mixer
  mixer = new THREE.AnimationMixer(currentVrm.scene);
  mixer.addEventListener("finished", (e) => {
    console.log("Animation finished");
    setIsGesturing(false);
  });
};
