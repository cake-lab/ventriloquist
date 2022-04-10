import React, { FunctionComponent, Ref } from "react";
import Controls from "./controls/Controls";
import Nav from "./Nav";

type UIProps = {
  cameraCanvasRef: Ref<HTMLCanvasElement>;
};

const UI: FunctionComponent<UIProps> = ({ cameraCanvasRef }) => {
  return (
    <div id="ui-container">
      <canvas ref={cameraCanvasRef} id="camera-canvas"></canvas>
      <Controls />
    </div>
  );
};

export default UI;
