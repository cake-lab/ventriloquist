import React, { FunctionComponent, Ref } from "react";
import GestureControls from "./controls/GestureControls";
import SceneControls from "./controls/SceneControls";
import Nav from "./Nav";

type UIOverlayProps = {
  cameraCanvasRef: Ref<HTMLCanvasElement>;
  style: React.CSSProperties;
};

const UIOverlay: FunctionComponent<UIOverlayProps> = ({
  cameraCanvasRef,
  style,
}) => {
  return (
    <div id="ui-container" style={style}>
      <>{/* The nav would go here (<Nav />) */}</>
      <div className="hbox">
        <div className="vbox">
          <canvas ref={cameraCanvasRef} id="camera-canvas"></canvas>
          <SceneControls />
        </div>
        <div style={{ flex: "1" }}></div>
        <div className="vbox">
          <GestureControls />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <i>Hint: Click the screen to toggle streamer mode</i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;
