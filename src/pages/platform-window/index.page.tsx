import * as React from "react";

import "../../../node_modules/modern-normalize/modern-normalize.css";
import { LeftMenu } from "../../components/chrome/LeftMenu";
import { TitleBar } from "../../components/chrome/TitleBar";

import "./frame-style-template.css";
import "./frame-style.css";
import "./light-theme.css";

// Layout.init must be called in the custom window to initialize the Layout and
// load the views.  Call init on DOMContentLoaded or after the window is setup
// and the target div element has been created

const init = () => {
  typeof fin !== "undefined"
    ? fin.Platform.Layout.init({ containerId: "layout-container" })
    : null;
};

const CustomPlatformWindow: React.FC = () => {
  React.useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div
        id="customWindow"
        style={{
          height: "100%",
          width: "100%",
          padding: 0,
          margin: 0,
          position: "absolute",
          overflow: "hidden",
          backgroundColor: "var(--frame-background-color)",
        }}
      >
        <TitleBar />
        <div id="body-container">
          <LeftMenu />
          <div className="two-sided-container">
            <div id="layout-container" className="face"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomPlatformWindow;
