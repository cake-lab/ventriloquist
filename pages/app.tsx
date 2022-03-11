import { NextPage } from "next";
import dynamic from "next/dynamic";

// This disables SSR for the App component
// Webkit was getting mad because kalidokit doesn't work on node
const DynamicApp = dynamic(() => import("../components/App"), { ssr: false });

const App: NextPage = () => {
  return <DynamicApp />;
};

export default App;
