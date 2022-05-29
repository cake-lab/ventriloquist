import React, { useContext } from "react";
import {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Modal from "react-modal";

import Loading from "../components/Loading";
import UIOverlay from "./UIOverlay";

import { startVideo } from "../scripts/camera";
import { startScene } from "../scripts/scene";
import { startMediapipe, stopMediapipe } from "../scripts/mediapipe";
import { reloadGestures } from "../scripts/gestures";

import { getPromiseFromEvent } from "../util/awaitEvent";
import { Gesture } from "../types/main";

export type AppProps = {
  username?: string;
};

// Give modals root node to use
Modal.setAppElement(document.getElementById("__next")!);

// Global loading state with the Context API
export const LoadingContext = React.createContext<(s: string | null) => void>(
  (s: string | null) => {}
);

export const GesturesContext = React.createContext<{
  gestures: Gesture[];
  setGestures: (g: Gesture[]) => void;
}>({ gestures: [], setGestures: (g) => {} });

const App: FunctionComponent<AppProps> = () => {
  // Loading overlay
  const [loading, setLoading] = useState<string | null>(null);
  //const [loading, setLoading] = useState({});

  const [gestures, setGestures] = useState<Gesture[]>([]);

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

      setLoading("Loading gestures");
      await reloadGestures(
        (s) => setLoading(s),
        (g) => setGestures(g)
      );

      setLoading("Starting mediapipe");
      await startMediapipe(cameraCanvasRef.current!, cameraVideoRef.current!);

      setLoading("Waiting for mediapipe");
      await getPromiseFromEvent(cameraCanvasRef.current!, "started");

      setLoading(null);
    };
    start();
  }, []);

  return (
    <LoadingContext.Provider value={(s) => setLoading(s)}>
      <GesturesContext.Provider
        value={{ gestures, setGestures: (g) => setGestures(g) }}
      >
        {Loading && <Loading message={loading} />}
        <UIOverlay cameraCanvasRef={cameraCanvasRef} />
        <video ref={cameraVideoRef} id="camera-video" autoPlay></video>
        <canvas ref={sceneCanvasRef}></canvas>
      </GesturesContext.Provider>
    </LoadingContext.Provider>
  );
};

export default App;
