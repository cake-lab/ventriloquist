import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { defaultGestures, startGesture } from "../../scripts/gestures";
import { Gesture } from "../../types/main";
import { GesturesContext } from "../App";

const GestureControls: FunctionComponent = () => {
  const { gestures, setGestures } = useContext(GesturesContext);
  /*
  const [currentGestures, setCurrentGestures] = useState<Gesture[]>([]);
  useEffect(() => {
    console.log("Putting currently loaded gestures into state hook");
    setCurrentGestures(defaultGestures);
  }, []);
  */
  return (
    <div className="control-panel">
      <div className="control-content">
        <b>Gestures</b>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Trigger</th>
            </tr>
          </thead>
          <tbody>
            {gestures.map((gesture, index) => {
              return (
                <tr
                  key={index}
                  onClick={() => {
                    startGesture(gesture);
                  }}
                  className="gesture-row"
                >
                  <td>{gesture.name}</td>
                  <td>{gesture.trigger || "none"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestureControls;
