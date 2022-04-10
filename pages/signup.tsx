import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../hooks/user";

const Signup: NextPage = () => {
  const { user, mutate } = useUser();
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      console.log("Already logged in, redirecting to /");
      router.push("/");
    }
  }, []);

  const signup = async () => {
    setError(null);

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmRef.current?.value;

    if (!username || !password || !confirmPassword) {
      setError("Missing field(s)");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    console.log({ username, password, confirmPassword });

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.status === 201) {
      const username = await res.json();
      mutate({ username });
      router.push("/");
    }
  };
  return (
    <div className="form-container">
      <div className="form">
        <h5>Signup</h5>
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

        <div className="form-row">
          <label>Confirm Password</label>
          <input className="form-control" type="password" ref={confirmRef} />
        </div>

        <div className="form-row button-row">
          <div>
            <button className="btn btn-outline-dark mx-1">Cancel</button>
            <button className="btn btn-dark mx-1" onClick={signup}>
              Signup
            </button>
          </div>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

export default Signup;
