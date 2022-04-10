import React from "react";
import {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Modal from "react-modal";

import Loading from "../components/Loading";
import UI from "../components/UI";

import { startVideo } from "../scripts/camera";
import { startScene } from "../scripts/scene";
import { startMediapipe, stopMediapipe } from "../scripts/mediapipe";
import { loadDefaultGestures } from "../scripts/gestures";

import { getPromiseFromEvent } from "../util/awaitEvent";

export type AppProps = {
  username?: string;
};

Modal.setAppElement(document.getElementById("__next")!);

const App: FunctionComponent<AppProps> = ({ username }) => {
  // Loading overlay
  const [loading, setLoading] = useState<string | null>(null);

  // Error overlay
  const [error, setError] = useState<string | null>(null);

  // Main DOM elements
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const cameraCanvasRef = useRef<HTMLCanvasElement>(null);
  const sceneCanvasRef = useRef<HTMLCanvasElement>(null);

  // Run after the DOM elements are loaded
  useEffect(() => {
    const start = async () => {
      console.log("Beginning post-DOM-render logic");

      setLoading("Setting up webcam");
      if (await startVideo(cameraVideoRef.current!, cameraCanvasRef.current!)) {
        setError("Couldn't access webcam");
        return;
      }

      setLoading("Setting up three.js scene");
      await startScene(sceneCanvasRef.current!);

      setLoading("Loading default gestures");
      await loadDefaultGestures();

      setLoading("Starting mediapipe");
      await startMediapipe(cameraCanvasRef.current!, cameraVideoRef.current!);

      setLoading("Waiting for mediapipe");
      await getPromiseFromEvent(cameraCanvasRef.current!, "started");

      setLoading(null);
    };
    start();
  }, []);

  return (
    <div>
      <Loading message={loading} />
      <UI cameraCanvasRef={cameraCanvasRef} />
      <video ref={cameraVideoRef} id="camera-video" autoPlay></video>
      <canvas ref={sceneCanvasRef}></canvas>
    </div>
  );
};

export default App;
