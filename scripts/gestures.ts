import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { currentVrm, mixer } from "./scene";
import { mixamoVrmMap } from "../util/mixamoVrmMap";
import { VRM, VRMSchema } from "@pixiv/three-vrm";
import { Gesture } from "../types/main";

let activeAction: THREE.AnimationAction;

const DEFAULT_GESTURES: Gesture[] = [
  {
    name: "Capoeira",
    url: "https://cdn.glitch.global/b233b4ea-cf6c-403a-bb68-82babee52d57/Capoeira%20(1).fbx?v=1642556259178",
  },
  {
    // Why is this the only one that works
    name: "Gangnam Style",
    url: "https://cdn.glitch.me/16b81be8-1f14-4a44-b78f-c3f6da842ee7%2FGangnam%20Style.fbx?v=1636708670740",
  },
];

export let isGesturing = false;
export const setIsGesturing = (to: boolean) => (isGesturing = to);

export const defaultGestures: Gesture[] = [];

/**
 * Given a gesture, reload its animation for the given vrm
 */
export const loadGesture = async (vrm: VRM, gesture: Gesture) => {
  const animation = await loadMixamoAnimation(gesture.url, vrm);

  gesture.animation = animation || undefined;
  if (!gesture.owner) defaultGestures.push(gesture);
};

export const reloadGestures = async (
  setLoading: (message: string | null) => void,
  setGestures: (g: Gesture[]) => void
) => {
  if (!currentVrm) {
    console.error("Trying to reload gestures without an active VRM");
    return;
  }

  console.log("Reloading default gestures");
  defaultGestures.length = 0;

  for (const defaultGesture of DEFAULT_GESTURES) {
    setLoading(`Loading ${defaultGesture.name}`);
    await loadGesture(currentVrm, defaultGesture);
  }
  setGestures(defaultGestures);
};

/*
export const loadDefaultGestures = async () => {
  defaultGestures.length = 0;
  if (!mixer || !currentVrm) {
    console.error("Either VRM or mixer is not loaded, aborting");
    return;
  }
  for (const file of DEFAULT_GESTURE_FILES) {
    const animation = await loadMixamoAnimation(file, currentVrm);

    if (!animation) {
      console.log(`Error loading ${file}`);
      continue;
    }

    defaultGestures.push({
      name: file,
      url: file,
      animation: animation,
      trigger: "none",
    });
  }
};
*/
/**
 * Loads a mixamo FBX animation
 * https://glitch.com/edit/#!/three-vrm-1-sandbox-mixamo?path=loadMixamoAnimation.js%3A1%3A0
 */
const loadMixamoAnimation = async (url: string, vrm: VRM) => {
  const loader = new FBXLoader();
  const asset = await loader.loadAsync(url);
  console.log(`Loaded FBX animation from ${url}`);
  console.log(asset);
  const clip = THREE.AnimationClip.findByName(asset.animations, "mixamo.com");
  console.log(clip);
  const tracks = [];

  for (const track of clip.tracks) {
    const splitTrack = track.name.split(".");
    const mixamoRigName = splitTrack[0];

    const vrmBoneName = mixamoVrmMap[mixamoRigName];
    const vrmNodeName = vrm.humanoid?.getBoneNode(
      vrmBoneName as VRMSchema.HumanoidBoneName
    )?.name;

    if (vrmNodeName === null) {
      console.error(`Error finding ${vrmBoneName}`);
      return null;
    }

    const propertyName = splitTrack[1];

    //console.log(vrm.meta);

    if (track instanceof THREE.QuaternionKeyframeTrack) {
      tracks.push(
        new THREE.QuaternionKeyframeTrack(
          `${vrmNodeName}.${propertyName}`,
          Array.from(track.times),
          Array.from(track.values).map((v, i) =>
            //vrm.meta?.version == "0" && i % 2 === 1 ? -v : v
            i % 2 === 0 ? -v : v
          )
        )
      );
    } else if (track instanceof THREE.VectorKeyframeTrack) {
      tracks.push(
        new THREE.VectorKeyframeTrack(
          `${vrmNodeName}.${propertyName}`,
          Array.from(track.times),
          Array.from(track.values).map(
            //(v, i) => (vrm.meta?.version == "0" && i % 3 !== 1 ? -v : v) * 0.01
            //(v, i) => (i % 3 !== 0 ? -v : v) * 0.01
            (v, i) => v * 0.01
          )
        )
      );
    }
  }

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

  if (!gesture.animation) {
    console.error(
      "Attempting to play gesture which does not have an animation loaded"
    );
    return;
  }
  console.log(`Starting ${gesture.name}`);
  activeAction = gesture.animation;

  activeAction.fadeIn(1);
  activeAction.reset();
  activeAction.play();
};
