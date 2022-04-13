import React, { FunctionComponent, useContext, useState } from "react";
import Modal from "react-modal";
import { useUser } from "../../hooks/user";
import { loadDefaultGestures } from "../../scripts/gestures";
import {
  currentModelFile,
  DEFAULT_GESTURE_FILES,
  DEFAULT_MODEL_FILES,
  loadModel,
} from "../../scripts/scene";
import { LoadingContext } from "../App";
import { modalStyle } from "../modals/modals";
import UploadModel from "../modals/UploadModel";

const SceneControls: FunctionComponent = () => {
  const { user } = useUser();
  const setLoading = useContext(LoadingContext);
  const [modelModalIsOpen, setModelModalIsOpen] = useState(false);

  const openModal = () => {
    setModelModalIsOpen(true);
  };
  const closeModal = () => {
    setModelModalIsOpen(false);
  };

  const changeModel = async (e: React.FormEvent<HTMLSelectElement>) => {
    const newModelUrl = e.currentTarget.value;

    if (currentModelFile === newModelUrl) {
      alert(`${currentModelFile} already active`);
      return;
    }
    setLoading(`Loading ${newModelUrl}`);
    await loadModel(newModelUrl);

    setLoading("Generating gestures");
    await loadDefaultGestures();

    setLoading(null);
  };

  return (
    <>
      <Modal
        isOpen={modelModalIsOpen}
        onRequestClose={closeModal}
        style={modalStyle}
      >
        <UploadModel onRequestClose={closeModal} />
      </Modal>
      <div className="control-content">
        <b>Model</b>

        <div style={{ display: "flex" }}>
          <select className="form-select" onChange={changeModel}>
            <optgroup label="Default">
              {DEFAULT_MODEL_FILES.map((s) => (
                <option key={s} value={s}>
                  {s.substring(6)}
                </option>
              ))}
            </optgroup>
            {user && <optgroup label="Custom"></optgroup>}
          </select>
          <button
            className="btn btn-dark mx-1"
            onClick={openModal}
            disabled={!user}
          >
            New
          </button>
        </div>

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
    </>
  );
};

export default SceneControls;
