import * as React from "react";
import "./index.css";

const tabs = [
  {
    url: "price",
    title: "Prices",
    name: "Price View",
  },
  {
    url: "price-audit",
    title: "Price Audit",
    name: "Price Audit",
  },
  {
    url: "position",
    title: "Positions",
    name: "Position View",
  },
  {
    url: "trade",
    title: "Trades",
    name: "Trade View",
  },
  {
    url: 'help',
    title: 'How it works',
    name: 'How it works'
  }
];

const addView = (tab: { url: string; title: string; name: string }) => {
  const url = `${window.location.origin}/${tab.url}`;

  return fin.Platform.getCurrentSync().createView(
    {
      url,
      name: tab.name,
    },
    fin.me.identity
  );
};

const openHelp = () => {
  fin.Platform.getCurrentSync().createView({

    url: `${window.location.origin}/help`,

  });
}
export const LeftMenu = () => {
  return (
    <div id="left-menu">
      <span>Available applications</span>

      <ul>
        {tabs.map((tab) => {
          return (
            <li key={tab.url}>
              <button onClick={() => addView(tab)}>{tab.title}</button>
            </li>
          );
        })}
        {/*}   <li key="help">
          <button onClick={openHelp}>How it works</button>
      </li>*/}
      </ul>
    </div>
  );
};
