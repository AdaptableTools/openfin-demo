import * as React from "react";

const HelpPage: React.FC = () => {
  return (
    <>
      <div style={{ padding: 20, overflow: "auto" }}>
        <h2>AdapTable - OpenFin Demo Guide</h2>
        <p>
          <a href="#how-works">How It Works</a>
        </p>
        <p>
          {" "}
          <a href="#audit-log">Audit Log</a>
        </p>
        <p>
          {" "}
          <a href="#openfin-channels">OpenFin Channels</a>
        </p>
        <p>
          <a href="#live-export">Live Export</a>
        </p>
        <p>
          {" "}
          <a href="#adaptable-features">AdapTable Features</a>
        </p>
        <h3>Overview</h3>
        <p>
          This demo application illustrates how{" "}
          <a href="https://adaptabletools.com" target="_blank">
            AdapTable
          </a>{" "}
          and{" "}
          <a href="https://openfin.co/" target="_blank">
            OpenFin
          </a>{" "}
          can work together to provide a powerful, cutting-edge, feature-rich
          application.{" "}
        </p>
        <p>
          It uses dummy data to mimic the types of screens workflows and
          advanced use-cases typically found in Financial Services systems.
        </p>
        <p>
          The application took less than a day to build and uses a small subset
          of the many, exceptional features found in both AdapTable and OpenFin.
        </p>
        <a id="how-works"></a>
        <h3>How it Works</h3>
        <p>The Application mimics some typical Front Office workflows. </p>
        <p>
          There are 3 main screens (each of which is an OpenFin application)
          that show 'ticking' data and which update based on changes in the
          other screens.{" "}
        </p>
        <p>The 3 'ticking data' screens are:</p>
        <h4>1. Trade Blotter</h4>
        <ul>
          <li>
            Displays a collection of dummy Trades, each of which has an{" "}
            <i>InstrumentId</i>.
          </li>
          <li>
            Every x seconds a new trade is added to the dummy data and displayed
            in the Grid.
          </li>
          <li>The Trade Status can be set to inactive</li>
        </ul>
        <h4>2. Price Blotter</h4>
        <ul>
          <li>
            Displays a fictitous list of instruments, each of which has a Price.
          </li>{" "}
          <li>
            Every x seconds the Price is updated (and flashes accordingly).
          </li>{" "}
          <li>The 'Bid Offer Spread' column sets the Ask and Bid</li>{" "}
        </ul>
        <h4>3. Positions Blotter</h4>
        <ul>
          <li>
            Lists the positions for each <i>InstrumentId</i> based on the Trade
            and Price screens.
          </li>
          <li>
            Each row aggregates all the trades for an instrument and calculates
            the PnL based on the current Price.
          </li>
          <li>
            Each time a Trade is added or a Price changes, the Positions Blotter
            will update (via the OpenFin xxx).
          </li>
        </ul>{" "}
        <h4>Keeping in Sync</h4>
        <p>One nice feature in the Demo is that all 3 Blotters stay in sync.</p>
        <p>
          For example, filtering on an Instrument in the Trade Blotter will
          cause the Price and Positions Blotters to filter immediately on the
          same instrument.
        </p>
        <p>
          Likewise setting the Theme in one Blotter to dark will update all
          other screens as well.
        </p>
        <p>
          This can also be performed outside of the Grid by toggling the Theme
          button at the top of the main window.
        </p>
        <h4>Notifications and Alerts</h4>
        <p>
          The Positions Blotter has been set up to fire an{" "}
          <a
            href="https://docs.adaptabletools.com/docs/adaptable-functions/alert-function"
            target="_blank"
          >
            Adaptable Alert
          </a>{" "}
          when X happens.
        </p>
        <p>
          The Alert has been configured with the <i>ShowInOpenFin</i> property
          set to true (only available when running in the OpenFin container).
        </p>
        <p>
          The result is that the Alert is fired as an{" "}
          <b>OpenFin Notification</b> and appears in the [where?]?
        </p>
        <a id="audit-log"></a>
        <h3>Audit Screens</h3>
        <p>
          The Demo leverages the{" "}
          <a
            href="https://docs.adaptabletools.com/docs/key-topics/audit-log"
            target="_blank"
          >
            AdapTable Audit Log
          </a>{" "}
          to provide a live 'view' of all data changes. There are 2 Audit
          Screens:
        </p>
        <ul>
          <li>
            <b>Trade Audit</b>: Displays a list of all Cell Edits made in the
            Trade Blotter - who made the change, what was changed and when.
          </li>
          <li>
            <b>Price Blotter</b>: Displays a list of all Cell Edits made in the
            Price Blotter and also Ticking Data changes.
          </li>
        </ul>
        <a id="openfin-channels"></a> <h3>OpenFin Channels</h3>
        <p>Need a few sentences on how the apps talk to each other</p>
        <a id="live-export"></a>
        <h3>Live Export</h3>
        <p>
          AdapTable provides a number of unique, extra features, when it is
          running in the OpenFin container.
        </p>
        <p>
          One of these is Live Export - whereby data can be sent from the Grid
          to Excel with 2 way updates.
        </p>
        <p>
          The result is that Excel will update in line with ticking data updates
          in AdapTable, and any edits made in Excel will be automatically
          reflected in the Blotter.
        </p>
        <p>
          This can be achieved by selecting a report from the{" "}
          <b>OpenFin Toolbar</b> in the Trades Blotter{" "}
          <a
            href="https://docs.adaptabletools.com/docs/user-interface/dashboard"
            target="_blank"
          >
            Dashboard
          </a>{" "}
          and starting Live Update (the triangular buttton).
        </p>
        <a id="adaptable-features"></a>
        <h3>AdapTable Features</h3>
        <p>
          There are numerous{" "}
          <a
            href="https://docs.adaptabletools.com/docs/adaptable-functions/adaptable-functions-overview"
            target="_blank"
          >
            AdapTable Functions
          </a>{" "}
          being used in this demo. These include [NEED TO DO!]:{" "}
        </p>{" "}
        <ul>
          <li>Alert</li>
          <li>Conditional Style</li>
          <li>Calculated Columns</li>
          <li>Format Columns</li>
          <li>Flashing Cell</li>
          <li>Plus Minus</li>
          <li>Layout</li>
        </ul>
      </div>
    </>
  );
};

export default HelpPage;
