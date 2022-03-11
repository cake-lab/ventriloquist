import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";

// This disables SSR for the App component
// Webkit was getting mad because kalidokit doesn't work on node
const DynamicApp = dynamic(() => import("../components/App"), { ssr: false });

type DynamicAppProps = {
  username: string;
};

const App: NextPage<DynamicAppProps> = ({ username }) => {
  return <DynamicApp username={username} />;
};

/**
 * See if the user is logged in or not
 */
export const getServerSideProps: GetServerSideProps<DynamicAppProps> = async (
  context
) => {
  return { props: { username: "hi" } };
};

export default App;
