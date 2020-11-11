import * as React from "react";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";

const DynamicComponent = dynamic(() => import("./position"), { ssr: false });

const App: React.FC = () => {
  return (
    <>
      {!(globalThis as any).fin ? <Navbar /> : null}
      <DynamicComponent />
    </>
  );
};

export default App;
