import {
  AdaptableApi,
  AdaptableTheme,
  ThemeChangedEventArgs,
} from "@adaptabletools/adaptable/types";
import { MutableRefObject, useEffect } from "react";
import { ThemeValues } from "../types";
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

        const context = { theme: themeName }
        fin.InterApplicationBus.publish('update-theme', context)
      }
    );

    if (adaptableApiRef.current) {
      // on initial load, make sure new adaptable tabs pick the correct theme
      fin.Platform.getCurrentSync().getWindowContext().then(context => {
        const { theme } = context || {}

        if (theme) {
          adaptableApiRef.current?.themeApi.loadTheme(theme);
        }
      })
    }
    return () => {
      offThemeChanged();
    };
  }, [adaptableApiRef.current]);

  useEffect(function () {

    const contextChangeHandler = ({ theme }: { theme: ThemeValues }) => {

      if (!theme) {
        return
      }

      if (adaptableApiRef.current?.themeApi.getCurrentTheme() === theme) {
        return
      }

      console.log("setting theme", theme);

      adaptableApiRef.current?.themeApi.loadTheme(theme);

    };

    fin.InterApplicationBus.subscribe({ uuid: "*" }, 'update-theme', contextChangeHandler)


    return () => { };
  }, []);
};
