import "bootstrap/dist/css/bootstrap.css";
import "react-tabs/style/react-tabs.css";
import "../styles/globals.css";
import "../styles/github-corner.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { ReactChild, FunctionComponent } from "react";

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
      <Component {...pageProps} />
    </>
  );
};

export default App;
