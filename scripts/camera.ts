import { getPromiseFromEvent } from "../util/awaitEvent";

let stream: MediaStream;

export const startVideo = async (
  cameraVideo: HTMLVideoElement,
  cameraCanvas: HTMLCanvasElement
): Promise<boolean> => {
  if (stream) {
    console.log("Video already started");
    return false;
  }
  console.log("Requesting webcam access");
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
      },
      audio: false,
    });

    cameraVideo.srcObject = stream;

    // Wait for webcam data to load
    await getPromiseFromEvent(cameraVideo, "loadeddata");

    // Set camera css
    const aspect = cameraVideo.videoWidth / cameraVideo.videoHeight;
    cameraCanvas.style.height = `${cameraCanvas.clientWidth / aspect}px`;

    return false;
  } catch (e) {
    return true;
  }
};

export const stopVideo = () => {
  console.log("Stopping webcam feed");
  stream.getTracks().forEach((track) => track.stop());
};
