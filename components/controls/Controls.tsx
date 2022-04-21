  import React, { FunctionComponent, useEffect } from "react";
import GestureControls from "./GestureControls";
import SceneControls from "./SceneControls";
import dynamic from "next/dynamic";

// Black magic
const Tabs = dynamic(
  import("react-tabs").then((mod) => mod.Tabs as any),
  { ssr: false }
); // disable ssr

import { Tab, TabList, TabPanel, resetIdCounter } from "react-tabs";

const Controls: FunctionComponent = () => {
  useEffect(() => {
    resetIdCounter();
  }, []);
  return (
    <div id="control-panel">
      <Tabs>
        <TabList>
          <Tab>Scene</Tab>
          <Tab>Gestures</Tab>
        </TabList>
        <TabPanel>
          <SceneControls />
        </TabPanel>
        <TabPanel>
          <GestureControls />
        </TabPanel>
      </Tabs>
    </div>
  );
};
export default Controls;
