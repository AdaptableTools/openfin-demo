import { AdaptableOptions } from "@adaptabletools/adaptable/types";

export const initAdaptableOptions = (
  adaptableOptions: AdaptableOptions
): AdaptableOptions => {
  const defaultAdaptableOptions: Partial<AdaptableOptions> = {
    layoutOptions: {
      autoSizeColumnsInLayout: true,
    },

    userName: "Demo User",

    userInterfaceOptions: {
      showAdaptableToolPanel: true,
      useCustomMacLikeScrollbars: true,
      applicationIcon: {
        url: "https://docs.adaptabletools.com/img/favicon_white.png",
      },
    },
    filterOptions: { quickFilterTrigger: "click" },
    auditOptions: {
      auditCellEdits: {
        auditAsEvent: true,
      },
      auditUserStateChanges: {
        auditAsEvent: true,
      },
      auditTickingDataUpdates: {
        auditAsEvent: true,
      },
    },
  };

  const defaults = {
    ...defaultAdaptableOptions,
    // adaptableStateKey: `${Date.now()}-4`,
    adaptableStateKey: `${adaptableOptions.adaptableId || Date.now()}-9`,
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
  };
};
