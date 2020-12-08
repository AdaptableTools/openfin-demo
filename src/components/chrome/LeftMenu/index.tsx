import * as React from "react";
import { toggleSidebar } from "../TitleBar";
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
    url: "trade-audit",
    title: "Trade Audit",
    name: "Trade Audit",
  },
  {
    url: 'help',
    title: 'Demo Guide',
    name: 'Demo Guide'
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


const clearState = () => {
  localStorage.clear()
  fin.InterApplicationBus.publish('clear-state');
}
export const LeftMenu = () => {

  return (
    <div id="left-menu">
      <div style={{
        padding: '20px 0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        <a className="brand" href="https://adaptabletools.com">
          <img className="dark" src={`https://docs.adaptabletools.com/img/adaptablelogodarktheme.png`} />
          <img className="light" src={`https://docs.adaptabletools.com/img/adaptablelogolighttheme.png`} />
        </a>

      </div>

      <span>Available applications</span>

      <ul>
        {tabs.map((tab) => {
          return (
            <li key={tab.url}>
              <button onClick={() => addView(tab)}>{tab.title}</button>
            </li>
          );
        })}
      </ul>

      <button onClick={toggleSidebar}>Hide sidebar</button>
      <button onClick={clearState}>Clear state</button>
    </div>
  );
};
