import Link from "next/link";
import { useRouter } from "next/router";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";

const Nav: FunctionComponent = () => {
  const router = useRouter();

  return (
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
      <div>
        <button className="btn btn-outline-dark mx-2">Login</button>
        <button className="btn btn-dark mx-2">Signup</button>
      </div>
    </div>
  );
};

export default Nav;
