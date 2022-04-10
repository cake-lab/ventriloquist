// BECAUSE REACT-MODAL DOESNT FUCKING WORK WITH CSS REEEEE
import Modal from "react-modal";

export const modalStyle: Modal.Styles = {
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    border: "2px solid black",
    borderRadius: "10px",
  },
};

export interface ModalProps {
  onRequestClose: () => void;
}
