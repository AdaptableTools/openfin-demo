import {
  AdaptableApi,
  AdaptableTheme,
  ThemeChangedEventArgs,
} from '@adaptabletools/adaptable/types';
import { MutableRefObject, useEffect } from 'react';
import { useChannelData } from './useChannelData';

export const useThemeSync = (
  adaptableApiRef: MutableRefObject<AdaptableApi>
) => {
  const { client } = useChannelData({
    themechange: (theme: string) => {
      const currentTheme = adaptableApiRef.current?.themeApi.getCurrentTheme();

      if (currentTheme != theme && theme) {
        console.log('setting theme', theme);
        adaptableApiRef.current?.themeApi.loadTheme(theme);
      }
    },
  });
  useEffect(() => {
    const { current: adaptableApi } = adaptableApiRef;
    if (!adaptableApi || !client) {
      return;
    }

    const offThemeChanged = adaptableApi.eventApi.on(
      'ThemeChanged',
      (args: ThemeChangedEventArgs) => {
        const info = adaptableApi.eventApi.getThemeChangedInfoFromEventArgs(
          args
        );

        const themeName = (info.theme as AdaptableTheme).Name || info.theme;
        console.log('theme change', themeName);

        client.dispatch('themechange', themeName);
      }
    );

    return () => {
      offThemeChanged();
    };
  }, [adaptableApiRef.current, client]);
};
