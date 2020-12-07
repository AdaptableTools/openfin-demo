import * as React from "react";

import { Icon } from "@adaptabletools/adaptable/src/components/icons";
import "./index.css";
import { useThemeChangeInProvider } from "./useThemeChangeInProvider";
const LIGHT_THEME = "light";
const DARK_THEME = "dark";

const lightThemeClassName = `${LIGHT_THEME}-theme`;

export const getCurrentTheme = () => {
  const isLight = document.documentElement.classList.contains(lightThemeClassName)

  return isLight ? LIGHT_THEME : DARK_THEME
};

const getOtherTheme = () => {
  return getCurrentTheme() === DARK_THEME ? LIGHT_THEME : DARK_THEME;
};

const toggleTheme = async () => {
  const theme = getOtherTheme()
  if (setTheme(theme)) {
    fin.Platform.getCurrentSync().setWindowContext({ theme })
    fin.InterApplicationBus.publish('update-theme', { theme })
  }
};

const setTheme = (theme) => {

  if (theme === getCurrentTheme()) {
    return false
  }
  syncTheme(theme);
  return true
};

const syncTheme = (theme: string) => {
  const root = document.documentElement;

  localStorage.setItem('theme', theme)

  if (theme === LIGHT_THEME) {
    root.classList.add(lightThemeClassName);
  } else {
    root.classList.remove(lightThemeClassName);
  }
};

const maxOrRestore = async () => {
  if ((await fin.me.getState()) === "normal") {
    return await fin.me.maximize();
  }

  return fin.me.restore();
};

export const toggleSidebar = () => {
  document.querySelector("#left-menu").classList.toggle("hidden");
};

export const TitleBar = () => {

  React.useLayoutEffect(() => {
    const initialTheme = localStorage.getItem('theme') || 'dark'
    if (initialTheme) {
      syncTheme(initialTheme)
    }
  }, [])
  useThemeChangeInProvider(syncTheme)

  return (
    <div id="title-bar">
      <div className="title-bar-draggable">
        <div id="title">AdapTable OpenFin Demo App</div>
      </div>
      <div id="buttons-wrapper">
        <div
          className="button"
          title="Toggle Theme"
          id="theme-button"
          onClick={toggleTheme}
        >
          <Icon name="conditional-style" />
        </div>
        <div
          className="button"
          style={{
            backgroundImage: "var(--menu-icon)",
          }}
          title="Toggle SideBar"
          id="menu-button"
          onClick={toggleSidebar}
        ></div>

        <div
          style={{
            backgroundImage: "var(--minimize-button-url)",
          }}
          className="button"
          title="Minimize Window"
          id="minimize-button"
          onClick={() => {
            fin.me.minimize().catch(console.error);
          }}
        ></div>
        <div
          style={{
            backgroundImage: "var(--expand-button-url)",
          }}
          className="button"
          title="Maximize Window"
          id="expand-button"
          onClick={() => {
            maxOrRestore().catch(console.error);
          }}
        ></div>
        <div
          style={{
            backgroundImage: "var(--close-button-url)",
          }}
          onClick={() => fin.me.close().catch(console.error)}
          className="button"
          title="Close Window"
          id="close-button"
        />
      </div>
    </div>
  );
};
