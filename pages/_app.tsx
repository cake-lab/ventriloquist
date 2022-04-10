import "bootstrap/dist/css/bootstrap.css";
import "react-tabs/style/react-tabs.css";
import "../styles/globals.css";
import "../styles/github-corner.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import React, { useEffect } from "react";
import { ReactChild, FunctionComponent } from "react";
import Nav from "../components/Nav";

/*
type SafeHydrateProps = {
  children: ReactChild | ReactChild[];
};

const SafeHydrate: FunctionComponent<SafeHydrateProps> = ({ children }) => {
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : children}
    </div>
  );
};
*/

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    if (typeof document !== undefined) {
      require("bootstrap/dist/js/bootstrap");
    }
  }, []);
  return (
    <>
      <Head>
        <title>Ventriloquist</title>
        <meta
          name="description"
          content="Loosely coupled VRM motion capture system inspired by Alter Echo."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <Component {...pageProps} />
    </>
  );
};

export default App;
