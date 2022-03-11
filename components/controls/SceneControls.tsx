import React, { FunctionComponent } from "react";

const SceneControls: FunctionComponent = () => {
  return (
    <div className="control-content">
      <b>Model</b>
      <select></select>
      <b>Background</b>
      <table>
        <tbody>
          <tr>
            <td>
              <input
                className="form-check-input"
                type="radio"
                name="backgroundType"
                value="color"
                defaultChecked
              ></input>
            </td>
            <td>Color</td>
            <td>
              <input type="text"></input>
            </td>
          </tr>
          <tr>
            <td>
              <input
                className="form-check-input"
                type="radio"
                name="backgroundType"
                value="image"
              ></input>
            </td>
            <td>Image</td>
            <td>
              <select></select>
            </td>
          </tr>
          <tr>
            <td>
              <input
                className="form-check-input"
                type="radio"
                name="backgroundType"
                value="environment"
              ></input>
            </td>
            <td>Environment</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SceneControls;
