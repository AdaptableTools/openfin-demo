import * as React from "react";
import dynamic from "next/dynamic";
import "../styles";

const DynamicComponent = dynamic(() => import("./price-audit"), { ssr: false });

const App: React.FC = () => {
  return (
    <>

      <DynamicComponent />
    </>
  );
};

export default App;
