import { AdaptableOptions } from '@adaptabletools/adaptable/types';
import openfin from '@adaptabletools/adaptable-plugin-openfin';

export const initAdaptableOptions = (
  adaptableOptions: AdaptableOptions
): AdaptableOptions => {
  const defaultAdaptableOptions: Partial<AdaptableOptions> = {
    layoutOptions: {
      autoSizeColumnsInLayout: true,
    },

    userName: 'Demo User',

    userInterfaceOptions: {
      showAdaptableToolPanel: true,
      useCustomMacLikeScrollbars: true,
      applicationIcon: {
        url: 'https://docs.adaptabletools.com/img/favicon_white.png'
      }
    },

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

    if (typeof defaultValue === 'object') {
      common[key] = { ...defaultValue, ...adaptableOptions[key] };
    }
  });

  return {
    ...defaults,
    ...adaptableOptions,
    ...common,
    plugins: [openfin({
      notificationTimeout: false,
      showApplicationIconInNotifications: true,
      onShowNotification: (notification) => {
        // if ...
        notification.buttons = [
          {
            //Button that sends data to the app
            "title": "Jump to cell",
            "type": "button",
            "cta": true, //makes the button prominent by coloring it blue
            "onClick": {
              "task": "jump-to-cell",
              "customData": {
                "message": "Example data to send back when this entry is clicked"
              }
            }
          }
        ]
      }

    })],
  };
};
