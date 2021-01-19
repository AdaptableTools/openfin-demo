import * as React from "react";

import { Icon } from "@adaptabletools/adaptable/src/components/icons";
import "./index.css";
import { useThemeChangeInProvider } from "./useThemeChangeInProvider";
import {
  DARK_THEME,
  lightThemeClassName,
  LIGHT_THEME,
  syncTheme,
} from "../syncTheme";
import {
  getCusip,
  getInstrumentIds,
  getInstrumentName,
} from "../../data/utils";

import { useState } from "react";
import { SystemChannel } from "openfin-fdc3";


export const getCurrentTheme = () => {
  const isLight = document.documentElement.classList.contains(
    lightThemeClassName
  );

  return isLight ? LIGHT_THEME : DARK_THEME;
};

const getOtherTheme = () => {
  return getCurrentTheme() === DARK_THEME ? LIGHT_THEME : DARK_THEME;
};

const toggleTheme = async () => {
  const theme = getOtherTheme();
  if (setTheme(theme)) {
    fin.Platform.getCurrentSync().setWindowContext({ theme });
    fin.InterApplicationBus.publish("update-theme", theme);
  }
};

const setTheme = (theme) => {
  if (theme === getCurrentTheme()) {
    return false;
  }
  syncTheme(theme);
  return true;
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

const instruments = getInstrumentIds();

const ChannelItem = ({ id, selected, visualIdentity, onClick }: { selected?: boolean, id: string, visualIdentity?: SystemChannel['visualIdentity'], onClick?: (id: string) => void }) => {
  const background = visualIdentity?.color ?? 'white'
  return <div key={id} onClick={() => onClick?.(id)} style={{ width: 24, height: 24, cursor: 'pointer', fontSize: 0, borderRadius: '50%', border: selected ? '2px solid tomato' : '2px solid transparent', lineHeight: 0, marginRight: 10 }}>
    <div style={{ border: '1px solid black', borderRadius: '50%', fontSize: 0, width: 20, height: 20, background }}></div>
  </div>
}

let defaultBroadcastFn: SystemChannel['broadcast'] | null = null
export const TitleBar = () => {
  const [instrumentId, setInstrumentId] = useState("default")
  const [currentSystemChannelId, setCurrentSystemChannelId] = useState<any>(null)
  const [systemChannels, setSystemChannels] = useState<Record<string, SystemChannel>>(null)


  React.useLayoutEffect(() => {
    const { addContextListener, broadcast, getSystemChannels } = require('openfin-fdc3')
    defaultBroadcastFn = broadcast

    const initialTheme = localStorage.getItem("theme") || "dark";
    if (initialTheme) {
      syncTheme(initialTheme);
    }

    getSystemChannels().then(channels => {

      setSystemChannels(channels.reduce((acc, channel: SystemChannel) => {
        acc[channel.id] = channel
        return acc
      }, {} as Record<string, SystemChannel>))
    })

    addContextListener((context: any) => {

      const instrumentId = context.instrumentCode
      if (getInstrumentName(instrumentId)) {
        setInstrumentId(instrumentId)
      }
    })
  }, []);

  const getCurrentBroadcastFn = (): SystemChannel['broadcast'] | null => {
    return systemChannels?.[currentSystemChannelId]?.broadcast ?? defaultBroadcastFn!
  }

  useThemeChangeInProvider(syncTheme);

  React.useEffect(() => {
    fin.InterApplicationBus.publish("set-filters", instrumentId);
    const name = getInstrumentName(instrumentId)
    if (name) {

      const broadcast = getCurrentBroadcastFn()
      if (!broadcast) {
        return
      }
      console.log('broadcasting', instrumentId, 'to channel', currentSystemChannelId)
      // broadcast FDC3 message for the given instrumnet (with cusip and name info)
      broadcast({
        type: "fdc3.instrument",
        name,
        id: {
          ticker: instrumentId,
          CUSIP: getCusip(instrumentId),
        },
      });
    }
  }, [currentSystemChannelId, instrumentId])

  const renderChannelPicker = () => {
    if (!systemChannels) {
      return null
    }
    return <div id="picker" style={{ display: 'flex', flexFlow: 'row', alignItems: 'center' }}>
      <div style={{ marginRight: 10 }}>Select channel: </div>
      <ChannelItem id="default" selected={currentSystemChannelId === 'default'} onClick={setCurrentSystemChannelId} />
      {Object.keys(systemChannels).map(id => {
        const channel = systemChannels[id]

        return <ChannelItem id={id} visualIdentity={channel.visualIdentity} selected={currentSystemChannelId === id} onClick={setCurrentSystemChannelId} />
      })}
    </div>
  }
  return (
    <div id="title-bar">
      <div className="title-bar-draggable">
        <div id="title">AdapTable OpenFin Demo App</div>
      </div>
      <div id="buttons-wrapper">
        {renderChannelPicker()}
        <select
          value={instrumentId}
          style={{ marginRight: 20 }}
          onChange={(e) => {
            const instrumentId = e.target.value;
            setInstrumentId(instrumentId)
          }}
        >
          <option key="-" value="">
            Select Instrument to filter
          </option>
          {instruments.map((instrumentId) => {
            return (
              <option key={instrumentId} value={instrumentId}>
                {instrumentId}
              </option>
            );
          })}
        </select>
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
