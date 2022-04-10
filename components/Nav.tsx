import Link from "next/link";
import { useRouter } from "next/router";
import Modal from "react-modal";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useUser } from "../hooks/user";
import Login from "./modals/Login";
import { modalStyle } from "./modals/modals";
import Signup from "./modals/Signup";

const Nav: FunctionComponent = () => {
  const { user, mutate } = useUser();
  const router = useRouter();

  const [loginModalIsOpen, setLoginModalIsOpen] = useState<boolean>(false);
  const [signupModalIsOpen, setSignupModalIsOpen] = useState<boolean>(false);

  const openLogin = () => {
    setLoginModalIsOpen(true);
  };
  const closeLogin = () => {
    setLoginModalIsOpen(false);
  };

  const openSignup = () => {
    setSignupModalIsOpen(true);
  };

  const closeSignup = () => {
    setSignupModalIsOpen(false);
  };

  const logout = () => {
    console.log("Logging out");
    fetch("/api/me", {
      method: "DELETE",
    });
    mutate(undefined);
  };

  return (
    <>
      <div id="navbar-container">
        <Modal
          isOpen={loginModalIsOpen}
          onRequestClose={closeLogin}
          style={modalStyle}
        >
          <Login onRequestClose={closeLogin} />
        </Modal>

        <Modal
          isOpen={signupModalIsOpen}
          onRequestClose={closeSignup}
          style={modalStyle}
        >
          <Signup onRequestClose={closeSignup} />
        </Modal>

        <div id="navbar">
          <div style={{ display: "flex" }}>
            <div
              className="navbar-item"
              onClick={() => {
                router.push("/");
              }}
            >
              Home
            </div>
            <div className="navbar-item">GitHub</div>
          </div>
          <div style={{ flexGrow: 1 }}></div>

          {/* CANNOT USE TERNARY OPERATOR HERE
              Dropdown must always be rendered because
              the bootstrap js is autistic and it won't work
              if it is ever not rendered :( */}
          <div className="dropdown" hidden={!user}>
            <button
              className="btn btn-outline-dark dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Hello, {`@${user?.username}`}
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" style={{ cursor: "pointer" }}>
                  Settings
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a
                  className="dropdown-item"
                  style={{ cursor: "pointer" }}
                  onClick={logout}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>

          {!user && (
            <div style={{ display: "flex" }}>
              <button onClick={openLogin} className="btn btn-outline-dark mx-1">
                Login
              </button>

              <button onClick={openSignup} className="btn btn-dark mx-1">
                Signup
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Nav;
