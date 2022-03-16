// @ts-nocheck
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors } from "@mediapipe/drawing_utils";
import {
  FACEMESH_TESSELATION,
  HAND_CONNECTIONS,
  Holistic,
  POSE_CONNECTIONS,
  Results,
  ResultsListener,
} from "@mediapipe/holistic";
import { isGesturing } from "./gestures";
import { rigVrm } from "./rig";
//import { rigVrm } from "./rig";
import { currentVrm } from "./scene";

let holistic: Holistic;
let camera: Camera;

let hasStarted = false;

export const startMediapipe = async (
  cameraCanvas: HTMLCanvasElement,
  cameraVideo: HTMLVideoElement
): Promise<void> => {
  console.log("Starting mediapipe");

  if (holistic && camera) {
    console.log("Mediapipe already started, using current instance");
    hasStarted = true;
    cameraCanvas.dispatchEvent(new Event("started"));
    return;
  }

  // Set camera canvas size to match CSS
  cameraCanvas.width = cameraCanvas.clientWidth;
  cameraCanvas.height = cameraCanvas.clientHeight;

  // Cache the drawing context
  const context = cameraCanvas.getContext("2d");

  /**
   * Handler for mediapipe results
   * This will change the currently loaded VRM model
   * Shouldn't do anything if isGesturing
   */
  const onResults: ResultsListener = (results: Results) => {
    if (!hasStarted) {
      hasStarted = true;
      console.log("Dispatching mediapipe start event");
      cameraCanvas.dispatchEvent(new Event("started"));
    }

    drawResults(results, cameraCanvas, context!);

    // Do everythign else, but if you're gesturing then go no further
    if (isGesturing) return;

    if (currentVrm) {
      rigVrm(currentVrm, results, cameraVideo);
    }
  };

  // Setup mediapipe holistic model if it isn't already loaded
  if (!holistic) {
    holistic = new Holistic({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;
      },
    });
    holistic.setOptions({ refineFaceLandmarks: true });
    holistic.onResults(onResults);
  }

  // Setup camera if it isn't already running
  if (!camera) {
    camera = new Camera(cameraVideo, {
      onFrame: async () => {
        await holistic.send({ image: cameraVideo });
      },
    });
    await camera.start();
  }
};

export const stopMediapipe = async () => {
  if (camera) {
    console.log("Stopping mediapipe");
    await camera.stop();
  }

  hasStarted = false;
};

const drawResults = (
  results: Results,
  cameraCanvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
): void => {
  context.save();
  context.clearRect(0, 0, cameraCanvas.width, cameraCanvas.height);

  context.drawImage(
    results.image,
    0,
    0,
    cameraCanvas.width,
    cameraCanvas.height
  );

  drawConnectors(context, results.faceLandmarks, FACEMESH_TESSELATION, {
    color: "#FFFFFF50",
    lineWidth: 1,
  });

  drawConnectors(context, results.poseLandmarks, POSE_CONNECTIONS, {
    color: "#FFFFFF",
    lineWidth: 1,
  });

  drawConnectors(context, results.leftHandLandmarks, HAND_CONNECTIONS, {
    color: "#FFFFFF",
    lineWidth: 1,
  });

  drawConnectors(context, results.rightHandLandmarks, HAND_CONNECTIONS, {
    color: "#FFFFFF",
    lineWidth: 1,
  });
  context.restore();
};
