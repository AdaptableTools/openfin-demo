import {
  AdaptableApi,
  AdaptableTheme,
  ThemeChangedEventArgs,
} from "@adaptabletools/adaptable/types";
import { MutableRefObject, useEffect } from "react";
import { useChannelData } from "./useChannelData";

export const useThemeSync = (
  adaptableApiRef: MutableRefObject<AdaptableApi>
) => {
  // const { client } = useChannelData({
  //   themechange: (theme: string) => {
  //     const currentTheme = adaptableApiRef.current?.themeApi.getCurrentTheme();

  //     if (currentTheme != theme && theme) {

  //       adaptableApiRef.current?.themeApi.loadTheme(theme);
  //     }
  //   },
  // });
  useEffect(() => {
    const { current: adaptableApi } = adaptableApiRef;
    if (!adaptableApi) {
      return;
    }

    const offThemeChanged = adaptableApi.eventApi.on(
      "ThemeChanged",
      async (args: ThemeChangedEventArgs) => {
        const info = adaptableApi.eventApi.getThemeChangedInfoFromEventArgs(
          args
        );

        const themeName = (info.theme as AdaptableTheme).Name || info.theme;
        const context =
          (await fin.Platform.getCurrentSync().getWindowContext()) || {};

        if (themeName !== context.theme) {
          console.log("theme change", themeName);
          const context = { theme: themeName }
          fin.Platform.getCurrentSync().setWindowContext(context);
          fin.InterApplicationBus.send({ uuid: "*" }, 'default-window-context-changed', context)
        }

        // client.dispatch('themechange', themeName);
      }
    );

    return () => {
      offThemeChanged();
    };
  }, [adaptableApiRef.current]);

  useEffect(function () {
    const execute = async () => {
      const contextChangeHandler = (e) => {
        const { context } = e
        const { theme } = context;

        console.log("setting theme", theme);

        //adaptableApiRef.current?.themeApi.getCurrentTheme()
        adaptableApiRef.current?.themeApi.loadTheme(theme);

      };

      await fin.me.on("host-context-changed", contextChangeHandler);
    };

    execute();

    return () => { };
  }, []);
};
