import React, { FunctionComponent, useEffect, useState } from "react";
import { Gesture, defaultGestures, startGesture } from "../../scripts/gestures";

const GestureControls: FunctionComponent = () => {
  const [currentGestures, setCurrentGestures] = useState<Gesture[]>([]);
  useEffect(() => {
    console.log("Putting currently loaded gestures into state hook");
    setCurrentGestures(defaultGestures);
  }, []);
  return (
    <div className="control-content">
      <b>Default Gestures</b>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Trigger</th>
          </tr>
        </thead>
        <tbody>
          {currentGestures.map((gesture, index) => {
            return (
              <tr
                key={index}
                onClick={() => {
                  startGesture(gesture);
                }}
                className="gesture-row"
              >
                <td>{gesture.name}</td>
                <td>{gesture.trigger}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GestureControls;
