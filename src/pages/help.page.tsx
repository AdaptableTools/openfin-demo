import Head from "../components/Head";
import * as React from "react";
import { useOnThemeChange } from "../components/hooks/useOnThemeChange";
import { syncTheme } from "../components/syncTheme";

const HelpPage: React.FC = () => {
  useOnThemeChange(syncTheme)
  return (
    <>
      <Head title="Demo Guide" />
      <div style={{ padding: 20, overflow: "auto", width: "100%", background: 'var(--main-background-color)', color: 'var(--body-font-color)' }}>
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
          {" "}
          <a href="#openfin-notifications">Notifications and Alerts</a>
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
          combine neatly together to provide powerful, cutting-edge,
          feature-rich applications.
        </p>
        <p>
          It uses <b>dummy data</b> to mimic the types of screens, workflows and
          advanced use-cases typically found in Financial Services systems.
        </p>
        <p>
          The application took less than a day to develop and uses a small
          subset of the many, exceptional features found in both AdapTable and
          OpenFin.
        </p>
        <a id="how-works"></a>
        <h3>How it Works</h3>
        <p>
          The Demo Application - built using AdapTable's{" "}
          <a
            href="https://docs.adaptabletools.com/docs/plugins/openfin/openfin-plugin"
            target="_blank"
          >
            OpenFin Plugin
          </a>{" "}
          - displays a pseudo Front Office set-up with 3 views: Trade, Price and
          Positions.
        </p>
        <p>
          Each screen is an OpenFin application which shows 'ticking' data, and
          each updates based on data changes in the other screens:
        </p>
        <h4>1. Trade Blotter</h4>
        <ul>
          <li>
            Displays a collection of fictitous Trades, each of which has an{" "}
            <i>InstrumentId</i>.
          </li>
          <li>
            Every x seconds a new trade is added to the dummy data and displayed
            in the Grid.
          </li>
          <li>
            Editable columns are: Trade Status, Notional (is this correct?)
          </li>
        </ul>
        <h4>2. Price Blotter</h4>
        <ul>
          <li>
            Displays a made-up list of <i>Instruments</i>, each of which
            contains a Price.
          </li>
          <li>
            Every x seconds the Price is updated (and flashes accordingly).
          </li>
          <li>
            Each entry also contains a Closing Price, Spread and Bid and Ask
            values
          </li>
          <li>
            Editable columns are: Price, BidOfferSpread (is this correct?)
          </li>
        </ul>
        <h4>3. Positions Blotter</h4>
        <ul>
          <li>
            Displays the positions for each <i>InstrumentId</i> based on data
            from the Trade and Price screens.
          </li>
          <li>
            Each row aggregates all the trades for an <i>InstrumentId</i> and
            calculates the PnL based on the current Price.
          </li>
          <li>
            Each time a Trade is added or a Price changes, the Positions Blotter
            will update (via the OpenFin xxx).
          </li>
          <li>No columns are editable </li>
        </ul>
        <h4>Keeping in Sync</h4>
        <p>
          One essential feature in the Demo is that all 3 Blotters can stay in
          sync with each other by using OpenFin communication APIs.
        </p>
        <p>This happens in various ways in the application:</p>
        <ul>
          <li>
            <b>Set the Filter</b> on the <i>InstrumentId</i> Column in any
            Blotter will cause the other Blotters to filter immediately on same
            instrument
          </li>
          <li>
            <b>Clear the Filter</b> on the <i>InstrumentId</i> Column in any
            Blotter will clear the Filters for that Column in all screens
          </li>
          <li>
            <b>Changing the Theme</b> in one screen will update the theme in all
            (also possible via the buttons at top of application)
          </li>
        </ul>
        <a id="audit-log"></a>
        <h3>Audit Screens</h3>
        <p>
          The Demo leverages the powerful{" "}
          <a
            href="https://docs.adaptabletools.com/docs/key-topics/audit-log"
            target="_blank"
          >
            AdapTable Audit Log
          </a>{" "}
          to provide a live 'view' of all data changes.{" "}
        </p>
        <p>
          There are 2 Audit Screens - each of which listens to the Audit Log
          stream and outputs to a new window:
        </p>
        <ul>
          <li>
            <b>Trade Audit</b>: Displays a list of all Cell Edits made in the
            Trade Blotter - who made the change, what was changed and when.
          </li>
          <li>
            <b>Price Blotter</b>: Displays a list of all Cell Edits made in the
            Price Blotter but also logs Ticking Data changes.
          </li>
        </ul>
        <a id="openfin-channels"></a> <h3>OpenFin Channels</h3>
        <p>Need a few sentences on how the apps talk to each other</p>
        <a id="openfin-notifications"></a> <h3>Notifications and Alerts</h3>
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
          The result is that the Alert is displayed as an{" "}
          <a
            href="https://www.npmjs.com/package/openfin-notifications"
            target="_blank"
          >
            OpenFin Notification
          </a>{" "}
          and appears in the [where?]?
        </p>{" "}
        <a id="live-export"></a>
        <h3>Live Export</h3>
        <p>
          AdapTable ships with compelling, extra features, only available when
          it is running in the OpenFin container.
        </p>
        <p>
          One of these is Live Export - whereby grid data can be sent from
          AdapTable to Excel with 2 way updates:
        </p>
        <ul>
          <li>
            Excel will automatically update in line with cell edits and ticking
            data changes in AdapTable
          </li>
          <li>
            Any date edits made directly in Excel will be automatically
            reflected in AdapTable
          </li>
        </ul>
        <p>
          This can be achieved by selecting a report from the{" "}
          <b>OpenFin Toolbar</b> in the Trades{" "}
          <a
            href="https://docs.adaptabletools.com/docs/user-interface/dashboard"
            target="_blank"
          >
            Dashboard
          </a>{" "}
          and running Live Update (the triangular buttton).
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
          being used in this demo application to enhance the workflow and
          improve the user experience.
        </p>
        <p>
          Note: these have been configured at design-time through{" "}
          <a
            href="https://docs.adaptabletools.com/docs/predefined-config/predefined-config-overview"
            target="_blank"
          >
            Predefined Config
          </a>
          , but they can, instead, be created at run-time via the AdapTable UI.
        </p>
        <p>Some of the Functions being used are:</p>
        <ul>
          <li>
            <a
              href="https://docs.adaptabletools.com/docs/user-interface/dashboard"
              target="_blank"
            >
              Dashboard
            </a>
            <ul>
              <li>
                Trade View - Two Tabs - <i>Blotter</i> and <i>Reports</i> (each
                with own set of Toolbars)
              </li>
              <li>
                Position and Price Views - a single Tab with a different set of
                Toolbars
              </li>
              <li>
                Position and Price Views - configued so Dashboard is in
                'Collapsed' mode at startup
              </li>
            </ul>
          </li>
          <li>
            <a
              href="https://docs.adaptabletools.com/docs/adaptable-functions/alert-function"
              target="_blank"
            >
              Alert
            </a>
            <ul>
              <li>
                Position View - will fire an Alert when Position Coumn value is
                greater than 50,000{" "}
              </li>
              <li>
                The Alert is of type 'Warning' and is configured to trigger an
                OpenFin Notification
              </li>
            </ul>
          </li>
          <li>
            <a
              href="https://docs.adaptabletools.com/docs/adaptable-functions/conditional-style-function"
              target="_blank"
            >
              Conditional Style
            </a>
            <ul>
              <li>
                Trade View - Styles the whole Row where Status Column value is
                'active'
              </li>
              <li>
                Price View - 2 Styles for 'Change of Day' Column: green
                background for positive values and red background for negative
                values
              </li>
              <li>
                Position View - 'PnL' Column displays a green or red font for
                positive and negative numbers
              </li>
            </ul>
          </li>
          <li>
            <a
              href="https://docs.adaptabletools.com/docs/adaptable-functions/calculated-column-function"
              target="_blank"
            >
              Calculated Column
            </a>
            <ul>
              <li>
                Price View - contains 3 Calculated Columns:
                <ol>
                  <li>
                    <b>Bid</b>: Created with Expression: '[price] -
                    [bidOfferSpread] / 2'
                  </li>
                  <li>
                    <b>Ask</b>: Created with Expression: '[price] +
                    [bidOfferSpread] / 2'
                  </li>
                  <li>
                    <b>Change on Day</b>: Created with Expression: '[price] -
                    [closingPrice]'
                  </li>
                </ol>
              </li>
            </ul>
          </li>
          <li>
            <a
              href="https://docs.adaptabletools.com/docs/adaptable-functions/format-column-function"
              target="_blank"
            >
              Format Column
            </a>
            <ul>
              <li>
                Trade View: All Date Columns (Trade Date, Settlement Date, Last
                Updated) use a Date Format of 'MM/DD/YYYY'
              </li>
              <li>
                Price View: 'Bid', 'Ask', 'Change On Day', and 'Price' have a
                Display Format of 4 decimal places and cell aligns right
              </li>
              <li>
                Position View: 'Current Price', 'Closing Price' and 'PnL' have
                Display Format of 4 decimal places; 'PnL' also has negative
                numbers in parentheses
              </li>
            </ul>
          </li>
          <li>
            <a
              href="https://docs.adaptabletools.com/docs/adaptable-functions/flashing-cell-function"
              target="_blank"
            >
              Flashing Cell
            </a>
            <ul>
              <li>
                Price View: 'Bid', 'Ask', and 'Price' all have Flashing Cells
                set (to Green and Red)
              </li>
              <li>
                Position View: 'Position' has Flashing Cells set (to Green and
                Red)
              </li>
            </ul>
          </li>
          <li>
            <a
              href="https://docs.adaptabletools.com/docs/adaptable-functions/plus-minus-function"
              target="_blank"
            >
              Plus Minus
            </a>
            <ul>
              <li>
                Price View - contains 2 Plus / Minus Rules for the 'Bid Offer
                Spread' column:
                <ol>
                  <li>
                    Default Nudge value of 0.5 - how cells in Column will
                    increment / decrement when the '+' or '-' keys are pressed
                  </li>
                  <li>
                    A Custom Plus Minus Rule which specifies that if the{" "}
                    <i>InstrumentId</i> is 'AAPL', the cell will nudge instead
                    by 1
                  </li>
                </ol>
              </li>
            </ul>
          </li>
          <li>
            <a
              href="https://docs.adaptabletools.com/docs/adaptable-functions/layout-function"
              target="_blank"
            >
              Layout
            </a>
            <ul>
              <li>
                Trade View - contains 2 Layouts:
                <ol>
                  <li>
                    'Latest Trades' - shows all Columns ordered by Trade Id in
                    descending order
                  </li>
                  <li>
                    'Counterparties' - shows subset of Columns grouped by
                    Counterparty (and with notional aggregated)
                  </li>
                </ol>
              </li>
            </ul>
          </li>
          <li>
            <a
              href="https://docs.adaptabletools.com/docs/adaptable-functions/export-function"
              target="_blank"
            >
              Export
            </a>{" "}
            <ul>
              <li>
                Trade View - contains an 'Active Trades' Report; will export All
                Columns and any Rows where Status is 'Active'
              </li>
              <li>
                This Report is also available in the OpenFin Toolbar and so can
                be exported to Excel as a "Live Report" (which will update in
                real time).
              </li>
            </ul>
          </li>
          <li>
            <a
              href="https://docs.adaptabletools.com/docs/predefined-config/user-interface-config#editlookupitems"
              target="_blank"
            >
              Edit Lookup
            </a>{" "}
            <ul>
              <li>
                Trade View - has Edit LookUp Items for Status column to enable
                quick editing
              </li>
            </ul>
          </li>
          <li>Action Column</li>{" "}
        </ul>
      </div>
    </>
  );
};

export default HelpPage;
