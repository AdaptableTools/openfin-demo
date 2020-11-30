import * as React from 'react'


import './index.css'
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

const toggleTheme = async () => {
  let themeName = DARK_THEME;
  if (!document.documentElement.classList.contains(LIGHT_THEME)) {
    themeName = LIGHT_THEME;
  }
  setTheme(themeName);
}

const setTheme = async (theme) => {
  const root = document.documentElement;

  const lightThemeClassName = `${LIGHT_THEME}-theme`
  if (theme === LIGHT_THEME) {
    root.classList.add(lightThemeClassName);

  } else {
    root.classList.remove(lightThemeClassName);
  }

  const context = await fin.Platform.getCurrentSync().getWindowContext() || {};

  if (context.theme !== theme) {
    fin.Platform.getCurrentSync().setWindowContext({ theme });
  }
}



const maxOrRestore = async () => {
  if (await fin.me.getState() === 'normal') {
    return await fin.me.maximize();
  }

  return fin.me.restore();
}


export const TitleBar = () => {
  return <div id="title-bar">
    <div className="title-bar-draggable">
      <div id="title">Welcome to AdapTable</div>
    </div>
    <div id="buttons-wrapper">
      <div className="button" title="Toggle Theme" id="theme-button" onClick={toggleTheme} ></div>


      <div
        style={{
          backgroundImage: 'var(--minimize-button-url)'
        }}
        className="button" title="Minimize Window" id="minimize-button" onClick={() => {
          fin.me.minimize().catch(console.error)
        }}></div>
      <div
        style={{
          backgroundImage: 'var(--expand-button-url)'
        }} className="button" title="Maximize Window" id="expand-button" onClick={() => {
          maxOrRestore().catch(console.error)
        }}></div >
      <div style={{
        backgroundImage: 'var(--close-button-url)'
      }}
        className="button" title="Close Window" id="close-button" />
    </div >
  </div>
}