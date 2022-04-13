import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { AppProps } from "../components/App";

// This disables SSR for the App component
// Webkit was getting mad because kalidokit doesn't work on node
const DynamicApp = dynamic(() => import("../components/App"), { ssr: false });

const App: NextPage<AppProps> = ({ username }) => {
  return <DynamicApp />;
};

export default App;
