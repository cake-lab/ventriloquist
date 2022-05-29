import React, { FunctionComponent, useContext, useState } from "react";
import Modal from "react-modal";
import { useUser } from "../../hooks/user";
import { reloadGestures } from "../../scripts/gestures";
import { currentModel, DEFAULT_MODELS, loadModel } from "../../scripts/scene";
import { GesturesContext, LoadingContext } from "../App";
import { modalStyle } from "../modals/modals";
import { scene } from "../../scripts/scene";
import UploadModel from "../modals/UploadModel";
import * as THREE from "three";
import { setServers } from "dns";

const SceneControls: FunctionComponent = () => {
  //const { user } = useUser();
  const [backgroundType, setBackgroundType] = useState<string>("solid");
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
            </select>
            <button className="btn btn-dark mx-1" onClick={openModal}>
              New
            </button>
          </div>
          <hr />
          <b>Background</b>
          <div className="vbox">
            <div className="hbox">
              <input
                type="radio"
                className="form-check-input mx-2"
                name="background"
                defaultChecked={true}
                onChange={(e) => {
                  setBackgroundType(
                    e.currentTarget.value ? "solid" : "transparent"
                  );
                  if (!!e) {
                    scene.background = new THREE.Color(
                      (
                        document.getElementById(
                          "solidColorPicker"
                        )! as HTMLInputElement
                      ).value //typescript lol
                    );
                  }
                }}
              ></input>
              <p>Solid color</p>
              <input
                id="solidColorPicker"
                type="color"
                className="mx-2"
                defaultValue="#eaeaea"
                onChange={(e) => {
                  if (backgroundType === "solid")
                    scene.background = new THREE.Color(e.currentTarget.value);
                }}
              ></input>
              <div style={{ flex: "1" }}></div>
            </div>
            <div className="hbox">
              <input
                type="radio"
                className="form-check-input mx-2"
                name="background"
                onChange={(e) => {
                  setBackgroundType(
                    !e.currentTarget.value ? "solid" : "transparent"
                  );
                  if (!!e.currentTarget.value) {
                    scene.background = null;
                  }
                }}
              ></input>
              <p>Transparent</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SceneControls;
