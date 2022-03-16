//@ts-nocheck
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { currentVrm, mixer } from "./scene";
import { mixamoVrmMap } from "../util/mixamoVrmMap";
import { VRM } from "@pixiv/three-vrm";

const DEFAULT_GESTURE_FILES = ["Punching.fbx", "Walking.fbx"];

/**
 * Gesture type
 */
export type Gesture = {
  name: string;
  url: string;
  animation: THREE.AnimationAction;
  trigger: string;
};

let activeAction: THREE.AnimationAction;

export let isGesturing = false;
export const setIsGesturing = (to: boolean) => (isGesturing = to);

export const defaultGestures: Gesture[] = [];

export const loadDefaultGestures = async () => {
  if (!mixer || !currentVrm) {
    console.error("Either VRM or mixer is not loaded, aborting");
    return;
  }

  defaultGestures.length = 0;

  for (const file of DEFAULT_GESTURE_FILES) {
    const animation = await loadMixamoAnimation(
      `/gestures/${file}`,
      currentVrm
    );

    defaultGestures.push({
      name: file,
      url: file,
      animation: animation,
      trigger: "none",
    });
  }
};

/**
 * This loads a mixamo FBX animation
 * https://glitch.com/edit/#!/three-vrm-1-sandbox-mixamo?path=loadMixamoAnimation.js%3A1%3A0
 */
const loadMixamoAnimation = async (url: string, vrm: VRM) => {
  const loader = new FBXLoader();
  const asset = await loader.loadAsync(url);
  console.log(`Loaded FBX animation from ${url}`);

  const clip = THREE.AnimationClip.findByName(asset.animations, "mixamo.com");

  const tracks = [];

  clip.tracks.forEach((track) => {
    const splitTrack = track.name.split(".");
    const mixamoRigName = splitTrack[0];

    const vrmBoneName = mixamoVrmMap[mixamoRigName];
    const vrmNodeName = currentVrm.humanoid?.getBoneNode(vrmBoneName)?.name;

    if (vrmNodeName !== null) {
      const propertyName = splitTrack[1];
      if (track instanceof THREE.QuaternionKeyframeTrack) {
        tracks.push(
          new THREE.QuaternionKeyframeTrack(
            `${vrmNodeName}.${propertyName}`,
            track.times,
            track.values.map((v, i) =>
              vrm.meta?.version === "0" && i % 2 === 0 ? -v : v
            )
          )
        );
      } else if (track instanceof THREE.VectorKeyframeTrack) {
        tracks.push(
          new THREE.VectorKeyframeTrack(
            `${vrmNodeName}.${propertyName}`,
            track.times,
            track.values.map(
              (v, i) =>
                (vrm.meta?.version === "0" && i % 3 !== 1 ? -v : v) * 0.01
            )
          )
        );
      }
    }
  });

  const animationClip = new THREE.AnimationClip(url, clip.duration, tracks);

  const animation = mixer.clipAction(animationClip);
  animation.loop = THREE.LoopOnce;

  return animation;
};

export const startGesture = (gesture: Gesture) => {
  isGesturing = true;
  if (activeAction) {
    console.log("Fading out of current animation");
    activeAction.fadeOut(1);
  }
  console.log(`Starting ${gesture.name}`);
  activeAction = gesture.animation;

  activeAction.fadeIn(1);
  activeAction.reset();
  activeAction.play();
};
