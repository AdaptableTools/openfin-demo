import * as React from 'react'


import './index.css'
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

const lightThemeClassName = `${LIGHT_THEME}-theme`

const getCurrentTheme = async () => {
  const context = await fin.Platform.getCurrentSync().getWindowContext() || {};

  return context.theme || LIGHT_THEME
}

const getOtherTheme = async () => {
  return await getCurrentTheme() === DARK_THEME ? LIGHT_THEME : DARK_THEME
}

const toggleTheme = async () => {
  setTheme(await getOtherTheme());
}

const setTheme = async (theme) => {

  //  syncTheme(theme)
  const context = await fin.Platform.getCurrentSync().getWindowContext() || {};

  if (context.theme !== theme) {
    fin.Platform.getCurrentSync().setWindowContext({ theme });
  }
}

const syncTheme = (theme: string) => {
  const root = document.documentElement;

  console.log('setting theme!!!', theme)

  if (theme === LIGHT_THEME) {
    root.classList.add(lightThemeClassName);
  } else {
    root.classList.remove(lightThemeClassName);
  }
}




const maxOrRestore = async () => {
  if (await fin.me.getState() === 'normal') {
    return await fin.me.maximize();
  }

  return fin.me.restore();
}


export const TitleBar = () => {
  React.useEffect(() => {

    // console.log(fin.me, '!!!!')

    //     fin.me.on('host-context-changed', (context) => {
    //   const { theme } = context

    //   syncTheme(theme)

    // });

    fin.Application.getCurrent().then(app => {
      app.on('host-context-changed', (context) => {
        const { theme } = context

        syncTheme(theme)

      })
    })
  }, [])
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
        onClick={() => fin.me.close().catch(console.error)}
        className="button" title="Close Window" id="close-button" />
    </div >
  </div>
}