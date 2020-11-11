import * as React from "react";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";

const DynamicComponent = dynamic(() => import("./index"), { ssr: false });

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <DynamicComponent />
    </>
  );
};

export default App;
