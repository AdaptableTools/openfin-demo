import { useEffect, useState } from "react";
import { ThemeValues } from "../types";
import { getCurrentTheme } from "./TitleBar";

export const useThemeChangeInProvider = (
  callback?: (theme: ThemeValues) => void
): ThemeValues => {
  const [theme, setTheme] = useState<ThemeValues>("dark");
  useEffect(() => {
    fin.InterApplicationBus.subscribe(
      { uuid: "*" },
      "update-theme",
      (theme: ThemeValues) => {
        if (getCurrentTheme() === theme) {
          return;
        }
        setTheme(theme);
        callback?.(theme);
      }
    );
  }, []);

  return theme;
};
