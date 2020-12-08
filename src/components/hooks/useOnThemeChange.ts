import { useEffect } from 'react';
import { ThemeValues } from '../types';

export const useOnThemeChange = (callback: (theme: ThemeValues) => void) => {
  useEffect(function () {
    fin.InterApplicationBus.subscribe({ uuid: '*' }, 'update-theme', callback);
    fin.Platform.getCurrentSync()
      .getWindowContext()
      .then((context) => {
        if (context && context.theme) {
          callback(context.theme as ThemeValues);
        }
      });
  }, []);
};
