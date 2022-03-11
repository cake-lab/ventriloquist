// @ts-nocheck

import { VRM, VRMBlendShapeGroup, VRMSchema } from "@pixiv/three-vrm";
import * as THREE from "three";
import {
  Vector,
  Utils,
  Hand,
  Face,
  Pose,
  THand,
  TFace,
  TPose,
} from "kalidokit";
import { Results } from "@mediapipe/holistic";

const poseBones = [
  "RightUpperArm",
  "RightLowerArm",
  "LeftUpperArm",
  "LeftLowerArm",
  "RightUpperLeg",
  "RightLowerLeg",
  "LeftUpperLeg",
  "LeftLowerLeg",
];

const leftHandBones = [
  "LeftRingProximal",
  "LeftRingIntermediate",
  "LeftRingDistal",
  "LeftIndexProximal",
  "LeftIndexIntermediate",
  "LeftIndexDistal",
  "LeftMiddleProximal",
  "LeftMiddleIntermediate",
  "LeftMiddleDistal",
  "LeftThumbProximal",
  "LeftThumbDistal",
  "LeftLittleProximal",
  "LeftLittleIntermediate",
  "LeftLittleDistal",
];

const rightHandBones = [
  "RightRingProximal",
  "RightRingIntermediate",
  "RightRingDistal",
  "RightIndexProximal",
  "RightIndexIntermediate",
  "RightIndexDistal",
  "RightMiddleProximal",
  "RightMiddleIntermediate",
  "RightMiddleDistal",
  "RightThumbProximal",
  "RightThumbDistal",
  "RightLittleProximal",
  "RightLittleIntermediate",
  "RightLittleDistal",
];

const rigRotation = (
  vrm: VRM,
  boneName: string,
  rotation = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3
) => {
  if (!vrm) return;
  //VRMSchema.HumanoidBoneName[boneName]

  const part = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName[boneName]);
  if (!part) {
    console.error(`VRM part ${boneName} not found`);
    return;
  }

  const euler = new THREE.Euler(
    rotation.x * dampener,
    rotation.y * dampener,
    rotation.z * dampener
  );

  const quaternion = new THREE.Quaternion().setFromEuler(euler);
  part.quaternion.slerp(quaternion, lerpAmount);
};

const rigPosition = (
  vrm: VRM,
  boneName: string,
  position = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3
) => {
  if (!vrm) return;

  const part = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName[boneName]);
  if (!part) {
    console.error(`VRM part ${boneName} not found`);
    return;
  }

  const vector = new THREE.Vector3(
    position.x * dampener,
    position.y * dampener,
    position.z * dampener
  );

  part.position.lerp(vector, lerpAmount);
};

// Js functions should have static variables
const oldLookTarget = new THREE.Euler();
const rigFace = (vrm: VRM, riggedFace: TFace) => {
  if (!vrm) return;

  rigRotation(vrm, "Neck", riggedFace.head, 0.7);

  const blendShape = vrm.blendShapeProxy;
  const PresetName = VRMSchema.BlendShapePresetName;

  // TODO: THIS DOESN'T DO ANYTHING, eye.l === eye.r === 0 ALWAYS

  riggedFace.eye.l = Vector.lerp(
    Utils.clamp(1 - riggedFace.eye.l, 0, 1),
    blendShape.getValue(PresetName.Blink),
    0.5
  ) as number;
  riggedFace.eye.r = Vector.lerp(
    Utils.clamp(1 - riggedFace.eye.r, 0, 1),
    blendShape.getValue(PresetName.Blink),
    0.5
  ) as number;

  riggedFace.eye = Face.stabilizeBlink(riggedFace.eye, riggedFace.head.y);

  blendShape.setValue(PresetName.Blink, riggedFace.eye.l);

  // Mouth blendshapes
  for (const shape of ["A", "E", "I", "O", "U"]) {
    blendShape.setValue(
      PresetName[shape],
      Vector.lerp(
        riggedFace.mouth.shape[shape],

        blendShape.getValue(PresetName[shape]),
        0.5
      )
    );
  }

  // Pupil directions
  const lookTarget = new THREE.Euler(
    Vector.lerp(oldLookTarget.x, riggedFace.pupil.y, 0.4),
    Vector.lerp(oldLookTarget.y, riggedFace.pupil.x, 0.4),
    0,
    "XYZ"
  );
  oldLookTarget.copy(lookTarget);
  vrm.lookAt.applyer.lookAt(lookTarget);
};

const rigPose = (vrm: VRM, riggedPose: TPose) => {
  // Hips
  rigRotation(vrm, "Hips", riggedPose.Hips.rotation, 0.7);
  rigPosition(
    vrm,
    "Hips",
    {
      x: -riggedPose.Hips.position.x,
      y: riggedPose.Hips.position.y + 1,
      z: -riggedPose.Hips.position.z,
    },
    1,
    0.07
  );

  // Torso
  rigRotation(vrm, "Chest", riggedPose.Spine, 0.25, 0.3);
  rigRotation(vrm, "Spine", riggedPose.Spine, 0.45, 0.3);

  // Arms and Legs (same dampener/lerp parameters)
  for (const name of poseBones) {
    rigRotation(vrm, name, riggedPose[name], 1, 0.3);
  }
};

const rigLeftHand = (
  vrm: VRM,
  riggedLeftHand: THand<"Left">,
  riggedPose: TPose
) => {
  rigRotation(vrm, "LeftHand", {
    x: riggedLeftHand.LeftWrist.x,
    y: riggedLeftHand.LeftWrist.y,
    z: riggedPose.LeftHand.z,
  });

  for (const name of leftHandBones) {
    rigRotation(vrm, name, riggedLeftHand[name]);
  }
};

const rigRightHand = (
  vrm: VRM,
  riggedRightHand: THand<"Right">,
  riggedPose: TPose
) => {
  rigRotation(vrm, "RightHand", {
    x: riggedRightHand.RightWrist.x,
    y: riggedRightHand.RightWrist.y,
    z: riggedPose.RightHand.z,
  });

  for (const name of rightHandBones) {
    rigRotation(vrm, name, riggedRightHand[name]);
  }
};

export const rigVrm = (
  vrm: VRM,
  results: Results,
  cameraVideo: HTMLVideoElement
) => {
  if (!vrm) return;
  //console.log(results);

  const {
    faceLandmarks,

    ea: pose2DLandmarks,
    poseLandmarks: pose3DLandmarks,
    // Reverse hand landmarks
    leftHandLandmarks: rightHandLandmarks,
    rightHandLandmarks: leftHandLandmarks,
  } = results;

  if (faceLandmarks) {
    //console.log("Rigging face");

    const riggedFace = Face.solve(faceLandmarks, {
      runtime: "mediapipe",
      video: cameraVideo,
    });
    //console.log(riggedFace);
    rigFace(vrm, riggedFace);
  }

  if (pose2DLandmarks && pose3DLandmarks) {
    const riggedPose = Pose.solve(pose2DLandmarks, pose3DLandmarks, {
      runtime: "mediapipe",
      video: cameraVideo,
    });
    rigPose(vrm, riggedPose);

    if (leftHandLandmarks) {
      const riggedLeftHand = Hand.solve(leftHandLandmarks, "Left");
      rigLeftHand(vrm, riggedLeftHand, riggedPose);
    }

    if (rightHandLandmarks) {
      const riggedRightHand = Hand.solve(rightHandLandmarks, "Right");
      rigRightHand(vrm, riggedRightHand, riggedPose);
    }
  }
};
