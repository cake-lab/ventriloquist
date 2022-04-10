import Link from "next/link";
import { useRouter } from "next/router";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useUser } from "../hooks/user";

const Nav: FunctionComponent = () => {
  const { user, mutate } = useUser();
  const router = useRouter();

  const logout = () => {
    console.log("Logging out");
    fetch("/api/me", {
      method: "DELETE",
    });
    mutate(undefined);
  };

  return (
    <div id="navbar-container">
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
        {user ? (
          <div className="dropdown">
            <button
              className="btn btn-outline-dark dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Hello, {`@${user.username}`}
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item">Settings</a>
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
        ) : (
          <div style={{ display: "flex" }}>
            <button
              onClick={() => router.push("/login")}
              className="btn btn-outline-dark mx-1"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="btn btn-dark mx-1"
            >
              Signup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
