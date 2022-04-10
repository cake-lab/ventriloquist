import React, { FunctionComponent, useState } from "react";
import Modal from "react-modal";
import { useUser } from "../../hooks/user";
import { modalStyle } from "../modals/modals";
import UploadModel from "../modals/UploadModel";

const SceneControls: FunctionComponent = () => {
  const { user } = useUser();

  const [modelModalIsOpen, setModelModalIsOpen] = useState(false);

  const openModal = () => {
    setModelModalIsOpen(true);
  };
  const closeModal = () => {
    setModelModalIsOpen(false);
  };
  return (
    <>
      <Modal
        isOpen={modelModalIsOpen}
        onRequestClose={closeModal}
        style={modalStyle}
      >
        <UploadModel />
      </Modal>
      <div className="control-content">
        <b>Model</b>
        {user ? (
          <div style={{ display: "flex" }}>
            <select className="form-select"></select>
            <button className="btn btn-dark mx-1" onClick={openModal}>
              Upload
            </button>
          </div>
        ) : (
          <i>Login to use custom models!</i>
        )}

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
