import * as React from "react";

const HelpPage: React.FC = () => {
  return (
    <>
      <div style={{ padding: 20, overflow: "auto" }}>
        <h2>AdapTable - OpenFin Demo Guide</h2>
        <h4>Overview</h4>
        <p>
          This demo application illustrates how{" "}
          <a href="https://adaptabletools.com" target="_blank">
            AdapTable
          </a>{" "}
          and{" "}
          <a href="https://openfin.co/" target="_blank">
            OpenFin
          </a>
          can be used together to provide a powerful, cutting-edge, feature-rich
          application.{" "}
        </p>
        <p>
          It uses dummy data to mimic the types of screens workflows and
          advanced use-cases typically found in Financial Services systems.
        </p>
        <p>
          The application - which took less than a day to build - uses a small
          subset of the many, exceptional features found in both AdapTable and
          OpenFin (they are listed below).{" "}
        </p>
        <h4>How it Works</h4>
        <p>To Do</p>
      </div>
    </>
  );
};

export default HelpPage;
