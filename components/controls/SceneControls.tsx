import React, { FunctionComponent, useContext, useState } from "react";
import Modal from "react-modal";
import { useUser } from "../../hooks/user";
import { reloadGestures } from "../../scripts/gestures";
import { currentModel, DEFAULT_MODELS, loadModel } from "../../scripts/scene";
import { GesturesContext, LoadingContext } from "../App";
import { modalStyle } from "../modals/modals";
import UploadModel from "../modals/UploadModel";

const SceneControls: FunctionComponent = () => {
  const { user } = useUser();
  const setLoading = useContext(LoadingContext);
  const { setGestures } = useContext(GesturesContext);
  const [modelModalIsOpen, setModelModalIsOpen] = useState(false);

  const openModal = () => {
    setModelModalIsOpen(true);
  };
  const closeModal = () => {
    setModelModalIsOpen(false);
  };

  const changeModel = async (e: React.FormEvent<HTMLSelectElement>) => {
    const newModelUrl = e.currentTarget.value;

    if (currentModel.url === newModelUrl) {
      alert(`${currentModel.url} already active`);
      return;
    }

    const model = DEFAULT_MODELS.find((m) => m.url === newModelUrl);

    if (!model) {
      console.error("Couldn't find that model");
      return;
    }
    setLoading(`Loading ${model.name}`);
    await loadModel(model);

    setLoading("Generating gestures");
    await reloadGestures(setLoading, setGestures);

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
      <div className="control-panel">
        <div className="control-content">
          <b>Avatar</b>
          <div style={{ display: "flex" }}>
            <select className="form-select" onChange={changeModel}>
              <optgroup label="Default">
                {DEFAULT_MODELS.map((s) => (
                  <option key={s.url} value={s.url}>
                    {s.name}
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
          <hr />
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
                    value="environment"
                  ></input>
                </td>
                <td>Transparent</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SceneControls;
