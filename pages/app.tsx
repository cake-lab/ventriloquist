import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
//import { AppProps } from "../components/App";

// This disables SSR for the App component
// IF YOU SEE THIS ERROR, JUST REFRESH LOL -Jack
const DynamicApp = dynamic(() => import("../components/App"), { ssr: false });

const App: NextPage = () => {
  return <DynamicApp />;
};

export default App;
