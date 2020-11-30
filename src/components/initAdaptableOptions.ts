import { AdaptableOptions } from '@adaptabletools/adaptable/types';
import openfin from '@adaptabletools/adaptable-plugin-openfin';

export const initAdaptableOptions = (
  adaptableOptions: AdaptableOptions
): AdaptableOptions => {
  const defaultAdaptableOptions: Partial<AdaptableOptions> = {
    layoutOptions: {
      autoSizeColumnsInLayout: true,
    },

    userInterfaceOptions: {
      showAdaptableToolPanel: true,
      useCustomMacLikeScrollbars: true,
    },
  };

  const defaults = {
    ...defaultAdaptableOptions,
    adaptableStateKey: `${adaptableOptions.adaptableId || Date.now()}-1`,
  };
  const common = {};

  Object.keys(defaults).forEach((key) => {
    const defaultValue = defaults[key];

    if (typeof defaultValue === 'object') {
      common[key] = { ...defaultValue, ...adaptableOptions[key] };
    }
  });

  return {
    ...defaults,
    ...adaptableOptions,
    ...common,
    plugins: [openfin()],
  };
};
