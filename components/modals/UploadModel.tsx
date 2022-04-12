import { FunctionComponent, useRef, useState } from "react";
import { useUser } from "../../hooks/user";
import { ModalProps } from "./modals";

const UploadModel: FunctionComponent<ModalProps> = ({ onRequestClose }) => {
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const nameRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async () => {
    setError(null);
    const name = nameRef.current?.value;
    const file = fileRef.current?.files![0];

    if (!user) {
      setError("Need to be logged in");
      return;
    }

    if (!name || !file) {
      setError("Missing name or file");
      return;
    }

    console.log({ name, file });

    const data = new FormData();
    data.append("file", file);
    data.append("user", user.username);
    const res = await fetch("/api/models", {
      method: "POST",
      body: file,
    });

    console.log(res.status);

    console.log(await res.text());
  };
  return (
    <div className="form">
      <h3>Upload Custom Model</h3>
      <div className="form-row">
        <label>Name</label>
        <input type="text" className="form-control" ref={nameRef}></input>
      </div>
      <div className="form-row">
        <input type="file" className="form-control-file" ref={fileRef} />
      </div>
      <hr />
      <div className="form-row button-row">
        <div>
          <button className="btn btn-dark mx-1" onClick={upload}>
            Upload
          </button>
          <button
            className="btn btn-outline-dark mx-1"
            onClick={onRequestClose}
          >
            Cancel
          </button>
        </div>
      </div>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};
export default UploadModel;
