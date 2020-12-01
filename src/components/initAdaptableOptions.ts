import { AdaptableOptions } from "@adaptabletools/adaptable/types";
import openfin from "@adaptabletools/adaptable-plugin-openfin";

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

    auditOptions: {
      auditCellEdits: {
        auditAsEvent: true,
      },
      auditUserStateChanges: {
        auditAsEvent: true,
      },
      auditTickingDataUpdates: {
        // auditAsEvent: true
      },
    },
  };

  const defaults = {
    ...defaultAdaptableOptions,
    adaptableStateKey: `${Date.now()}`, //`${adaptableOptions.adaptableId || Date.now()}-1`,
  };
  const common = {};

  Object.keys(defaults).forEach((key) => {
    const defaultValue = defaults[key];

    if (typeof defaultValue === "object") {
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
