import React, { FunctionComponent, useState } from "react";

const GestureControls: FunctionComponent = () => {
  const [defaultGestures, setDefaultGestures] = useState<string[]>([]);
  return (
    <div className="control-content">
      <b>Default Gestures</b>
      <table>
        <thead>
          <tr className="gesture-row">
            <th>Name</th>
            <th>Trigger</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default GestureControls;
