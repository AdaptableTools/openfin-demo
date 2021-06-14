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
import { useCallback } from "react";

type Context = any;
type SystemChannel = any;
export const getCurrentTheme = () => {
  const isLight = document.documentElement.classList.contains(
    lightThemeClassName
  );

  return isLight ? LIGHT_THEME : DARK_THEME;
};

let pausedNotifications = false;

const toggleNotifications = () => {
  pausedNotifications = !pausedNotifications;

  fin.Platform.getCurrentSync().setWindowContext({
    theme: getCurrentTheme(),
    pausedNotifications,
  });
  fin.InterApplicationBus.publish("toggle-notifications", {
    pausedNotifications,
  });
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

const ChannelItem = ({
  id,
  selected,
  visualIdentity,
  onClick,
}: {
  selected?: boolean;
  id: string;
  visualIdentity?: SystemChannel["visualIdentity"];
  onClick?: (id: string) => void;
}) => {
  const background = visualIdentity?.color ?? "white";
  return (
    <div
      key={id}
      onClick={() => onClick?.(id)}
      style={{
        width: 24,
        height: 24,
        cursor: "pointer",
        fontSize: 0,
        borderRadius: "50%",
        border: selected ? "2px solid tomato" : "2px solid transparent",
        lineHeight: 0,
        marginRight: 10,
      }}
    >
      <div
        style={{
          border: "1px solid black",
          borderRadius: "50%",
          fontSize: 0,
          width: 20,
          height: 20,
          background,
        }}
      ></div>
    </div>
  );
};

let SYSTEM_CHANNELS: SystemChannel[] = null;

let CURRENT_SYSTEM_ID: string = null;

const getSystemChannels: () => Promise<SystemChannel[]> = () => {
  return Promise.resolve(
    SYSTEM_CHANNELS ??
      fdc3.getSystemChannels().then((channels) => {
        SYSTEM_CHANNELS = channels;
        return channels;
      })
  );
};

const reduceChannels = (
  channels: SystemChannel[]
): Record<string, SystemChannel> => {
  return channels.reduce((acc, channel: SystemChannel) => {
    acc[channel.id] = channel;
    return acc;
  }, {} as Record<string, SystemChannel>);
};

const getSystemChannelsMap: () => Promise<
  Record<string, SystemChannel>
> = () => {
  return getSystemChannels().then(reduceChannels);
};

const getCurrentBroadcastFn = (): SystemChannel["broadcast"] => {
  return (message: Context) => {
    getSystemChannelsMap().then((systemChannels) => {
      const theChannel = systemChannels?.[CURRENT_SYSTEM_ID];
      if (theChannel) {
        (fdc3 as any).leaveCurrentChannel().then(() => {
          (fdc3 as any).joinChannel(CURRENT_SYSTEM_ID).then(() => {
            console.log(
              "broadcasting",
              message,
              "to",
              CURRENT_SYSTEM_ID,
              "channel"
            );
            return fdc3.broadcast(message);
          });
        });
      }
    });
  };
};

const broadcast = (what: any) => {
  getCurrentBroadcastFn()?.(what);
};

export const TitleBar = () => {
  const [instrumentId, setInstrumentId] = useState("");
  const [_renderId, setRenderId] = useState(0);
  const rerender = () => setRenderId((x) => x + 1);
  const [currentSystemChannelId, doSetCurrentSystemChannelId] = useState<any>(
    "green"
  );

  const setCurrentSystemChannelId = useCallback((id: string) => {
    CURRENT_SYSTEM_ID = id;
    doSetCurrentSystemChannelId(id);
  }, []);
  const [systemChannels, setSystemChannels] = useState<
    Record<string, SystemChannel>
  >(null);

  React.useLayoutEffect(() => {
    const initialTheme = localStorage.getItem("theme") || "dark";
    if (initialTheme) {
      syncTheme(initialTheme);
    }

    getSystemChannels().then((channels) => {
      console.log("got channels", channels);
      setCurrentSystemChannelId(channels[0].id);
      setSystemChannels(reduceChannels(channels));
    });

    (fdc3 as any).addContextListener(null, (context: any) => {
      if (context.skipFilter) {
        return;
      }

      const instrumentId = context.id?.ticker;

      if (getInstrumentName(instrumentId)) {
        setInstrumentId(instrumentId);
      }
    });

    fin.InterApplicationBus.subscribe(
      { uuid: "*" },
      "broadcast-instrument",
      (instrumentContext) => {
        console.log("got new instrument", instrumentContext);

        broadcast(instrumentContext);
      }
    );
  }, []);

  useThemeChangeInProvider(syncTheme);

  React.useEffect(() => {
    fin.InterApplicationBus.publish("set-filters", instrumentId);
    const name = getInstrumentName(instrumentId);
    if (name) {
      // broadcast FDC3 message for the given instrumnet (with cusip and name info)
      broadcast({
        type: "instrument",
        name,
        id: {
          ticker: instrumentId,
          CUSIP: getCusip(instrumentId),
        },
      });
    }
  }, [instrumentId]);

  React.useEffect(() => {
    fin.InterApplicationBus.subscribe(
      { uuid: "*" },
      "set-instrumentid",
      setInstrumentId
    );
  }, []);

  const renderChannelPicker = () => {
    if (!systemChannels) {
      return null;
    }
    return (
      <div
        id="picker"
        style={{ display: "flex", flexFlow: "row", alignItems: "center" }}
      >
        <div style={{ marginRight: 10 }}>Channels: </div>

        {Object.keys(systemChannels).map((id) => {
          const channel = systemChannels[id];

          return (
            <ChannelItem
              id={id}
              key={id}
              visualIdentity={channel.displayMetadata}
              selected={currentSystemChannelId === id}
              onClick={setCurrentSystemChannelId}
            />
          );
        })}
      </div>
    );
  };
  return (
    <div id="title-bar">
      <div className="title-bar-draggable">
        <div id="title">AdapTable OpenFin Demo</div>
      </div>
      <div id="buttons-wrapper">
        {renderChannelPicker()}
        <select
          value={instrumentId}
          style={{ marginRight: 10 }}
          onChange={(e) => {
            const instrumentId = e.target.value;
            setInstrumentId(instrumentId);
          }}
        >
          <option key="-" value="">
            Select Instrument
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
          title={
            pausedNotifications ? "Resume notifications" : "Pause notifications"
          }
          id="notifications-button"
          onClick={() => {
            toggleNotifications();
            rerender();
          }}
          style={{ opacity: pausedNotifications ? 0.25 : 1 }}
        >
          <Icon name="alert" />
        </div>
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
