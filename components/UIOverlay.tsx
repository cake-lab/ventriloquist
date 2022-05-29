import React, { FunctionComponent, Ref } from "react";
import Controls from "./controls/Controls";
import GestureControls from "./controls/GestureControls";
import SceneControls from "./controls/SceneControls";
import Nav from "./Nav";

type UIOverlayProps = {
  cameraCanvasRef: Ref<HTMLCanvasElement>;
};

const UIOverlay: FunctionComponent<UIOverlayProps> = ({ cameraCanvasRef }) => {
  return (
    <div id="ui-container">
      <Nav />
      <div className="hbox">
        <div className="vbox">
          <canvas ref={cameraCanvasRef} id="camera-canvas"></canvas>
          <SceneControls />
        </div>
        <div style={{ flex: "1" }}></div>
        <GestureControls />
      </div>
    </div>
  );
};

export default UIOverlay;
