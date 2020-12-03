import * as React from "react";
import dynamic from "next/dynamic";
import "../styles";

const DynamicComponent = dynamic(() => import("./trade-audit"), { ssr: false });

const App: React.FC = () => {
  return (
    <>

      <DynamicComponent />
    </>
  );
};

export default App;
