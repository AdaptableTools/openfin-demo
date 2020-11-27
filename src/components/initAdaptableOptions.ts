import { AdaptableOptions } from '@adaptabletools/adaptable/types';
import { plugins } from './plugins';

const defaultAdaptableOptions: Partial<AdaptableOptions> = {
  layoutOptions: {
    autoSizeColumnsInLayout: true,
  },
  plugins,
  userInterfaceOptions: {
    showAdaptableToolPanel: true,
  },
};
export const initAdaptableOptions = (
  adaptableOptions: AdaptableOptions
): AdaptableOptions => {
  const defaults = {
    ...defaultAdaptableOptions,
    adaptableStateKey: `${Date.now()}`,
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
  };
};
