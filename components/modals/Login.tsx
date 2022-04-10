import { NextPage } from "next";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useUser } from "../../hooks/user";
import { ModalProps } from "./modals";

const Login: FunctionComponent<ModalProps> = ({ onRequestClose }) => {
  const { user, mutate } = useUser();
  const [error, setError] = useState<string | null>(null);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const login = async () => {
    setError(null);

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      setError("Missing field(s)");
      return;
    }

    console.log({ username, password });

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.status === 200) {
      const username = await res.json();
      mutate({ username });
      console.log({ username });
      onRequestClose();
    } else {
      setError("Bad login");
    }
  };
  return (
    <div className="">
      <div className="form">
        <h5>Login</h5>
        <div className="form-row">
          <label>Username</label>
          <div className="input-group">
            <div className="input-group-prepend">
              <div
                className="input-group-text"
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              >
                @
              </div>
            </div>
            <input className="form-control" ref={usernameRef} />
          </div>
        </div>

        <div className="form-row">
          <label>Password</label>
          <input className="form-control" type="password" ref={passwordRef} />
        </div>

        <div className="form-row button-row">
          <div>
            <button
              className="btn btn-outline-dark mx-1"
              onClick={onRequestClose}
            >
              Cancel
            </button>
            <button className="btn btn-dark mx-1" onClick={login}>
              Login
            </button>
          </div>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
