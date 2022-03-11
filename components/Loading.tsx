import React, { FunctionComponent } from "react";

type LoadingProps = {
  message: string | null;
};

const Loading: FunctionComponent<LoadingProps> = ({ message }) => {
  return message ? (
    <div id="loading-container">
      <p id="loading-text">{message}</p>
    </div>
  ) : (
    <></>
  );
};

export default Loading;
