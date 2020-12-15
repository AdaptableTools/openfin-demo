import {
  AdaptableApi,
  AdaptableTheme,
  ThemeChangedEventArgs,
} from "@adaptabletools/adaptable/types";
import { MutableRefObject, useEffect } from "react";
import { useOnThemeChange } from "./useOnThemeChange";

export const useThemeSync = (
  adaptableApiRef: MutableRefObject<AdaptableApi>
) => {
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

        fin.InterApplicationBus.publish('update-theme', themeName)
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

  useOnThemeChange(theme => {

    if (!theme) {
      return
    }

    if (adaptableApiRef.current?.themeApi.getCurrentTheme() === theme) {
      return
    }

    adaptableApiRef.current?.themeApi.loadTheme(theme);

  })
};
