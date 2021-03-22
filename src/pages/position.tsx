import * as React from "react";
import AdaptableReact from "@adaptabletools/adaptable-react-aggrid";
import { AdaptableToolPanelAgGridComponent } from "@adaptabletools/adaptable/src/AdaptableComponents";
import { AgGridReact } from "@ag-grid-community/react";
import {
  GridOptions,
  ColDef,
  GridReadyEvent,
  GridApi,
} from "@ag-grid-enterprise/all-modules";
import { columnTypes } from "../data/columnTypes";
import { positionColumns } from "../data/position/columns";
import MainLayout from "../components/MainLayout";
import { modules } from "../components/modules";
import { useChannelData } from "../components/hooks/useChannelData";
import { useRef } from "react";
import {
  DisplayFormat4Digits,
  DisplayFormatInteger,
} from "../data/displayFormat";
import { useFilters } from "../components/hooks/useFilters";
import { once } from "../components/once";
import { useThemeSync } from "../components/hooks/useThemeSync";
import Head from "../components/Head";
import type { Position } from "../data/position";
import { initAdaptableOptions } from "../components/initAdaptableOptions";
import { GREEN, RED } from "../components/colors";
import { ThemeConfig } from "../components/ThemeConfig";
import openfin from "@adaptabletools/adaptable-plugin-openfin";
import finance from "@adaptabletools/adaptable-plugin-finance";
import {
  AdaptableAlert,
  AdaptableApi,
  AdaptableOptions,
  AdaptablePredicate,
  AlertDefinition,
  MenuInfo,
  OpenFinPluginOptions,
} from "@adaptabletools/adaptable/src/types";
import { setInstrumentId } from "../components/setInstrumentId";
import { getInstrumentName } from "../data/utils";

let adaptableApiRef: React.MutableRefObject<AdaptableApi>;
const columnDefs: ColDef[] = positionColumns;
const rowData = null;

const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: false,
    filter: true,
    floatingFilter: true,
    sortable: true,
    resizable: true,
  },
  rowData: rowData,
  components: {
    AdaptableToolPanel: AdaptableToolPanelAgGridComponent,
  },
  sideBar: true,
  suppressMenuHide: true,
  enableRangeSelection: true,
  columnTypes,
};

let notificationsPaused = false;
fin.InterApplicationBus.subscribe(
  { uuid: "*" },
  "toggle-notifications",
  ({ pausedNotifications }) => {
    notificationsPaused = pausedNotifications;
  }
);

const openfinPluginOptions: OpenFinPluginOptions = {
  notificationTimeout: false,
  showAppIconInNotifications: true,
  showAdaptableAlertsAsNotifications: true,
};

const adaptableOptions: AdaptableOptions = initAdaptableOptions({
  primaryKey: "instrumentId",
  adaptableId: "Position View",
  userFunctions: [
    {
      type: "AlertButtonActionFunction",
      handler: (info) => {
        if (info && info.alert) {
          let alertDefinition: AlertDefinition = info.alert.AlertDefinition;
          if (alertDefinition) {
            let predicate = alertDefinition.Predicate;
            if (predicate) {
              let inputs: any[] | undefined = predicate.Inputs;
              if (inputs && inputs.length > 0) {
                let firstInput = inputs[0];
                let newValue = firstInput + 1000;
                let newPredicate: AdaptablePredicate = {
                  PredicateId: "GreaterThan",
                  Inputs: [newValue],
                };
                alertDefinition.Predicate = newPredicate;
                adaptableApiRef.current.alertApi.editAlert(alertDefinition);
              }
            }
          }
        }
      },
      name: "increaseLimit",
    },
  ],
  predefinedConfig: {
    Theme: ThemeConfig,
    FormatColumn: {
      FormatColumns: [
        {
          Scope: {
            ColumnIds: ["pnl"],
          },
          DisplayFormat: {
            ...DisplayFormatInteger,
            Options: { ...DisplayFormatInteger.Options, Parentheses: true },
          },
        },
        {
          Scope: {
            ColumnIds: ["currentPrice", "closingPrice"],
          },
          DisplayFormat: DisplayFormat4Digits,
        },
      ],
    },
    FlashingCell: {
      FlashingCells: [
        { ColumnId: "position", IsLive: true, UpColor: GREEN, DownColor: RED },
      ],
    },
    ConditionalStyle: {
      ConditionalStyles: [
        {
          Scope: {
            ColumnIds: ["pnl"],
          },
          Style: {
            ForeColor: "green",
          },
          Predicate: {
            PredicateId: "Positive",
          },
        },
        {
          Scope: {
            ColumnIds: ["pnl"],
          },
          Style: {
            ForeColor: "red",
          },
          Predicate: {
            PredicateId: "Negative",
          },
        },
      ],
    },
    Dashboard: {
      IsCollapsed: true,
      VisibleButtons: ["GridInfo", "Layout", "ConditionalStyle"],
      Tabs: [
        {
          Name: "Position",
          Toolbars: ["OpenFin", "SmartEdit", "Alert", "CellSummary"],
        },
      ],
    },
    Alert: {
      AlertDefinitions: [
        {
          Scope: {
            ColumnIds: ["position"],
          },
          AlertForm: {
            Buttons: [
              {
                Label: "Increase",
                ButtonStyle: {
                  Variant: "raised",
                  ClassName: "",
                },
                AlertButtonActionFunction: "increaseLimit",
              },
              {
                Label: "Show Me",
                ButtonStyle: {
                  ClassName: "",
                  Variant: "outlined",
                  Tone: "error",
                },
                Action: ["highlight-cell", "jump-to-cell"],
              },
            ],
          },
          Predicate: {
            PredicateId: "GreaterThan",
            Inputs: [10_000], // return to 70,000
          },
          MessageType: "Warning",
          AlertProperties: {
            ShowPopup: true,
          },
        },
      ],
    },
  },
  plugins: [
    openfin(openfinPluginOptions),
    finance({
      instrumentColumns: [
        {
          columnId: "instrumentId",
          tickerColumnId: "instrumentId",
        },
      ],
    }),
  ],
});

const App: React.FC = () => {
  const gridApiRef = useRef<GridApi>(null);
  adaptableApiRef = useRef<AdaptableApi>(null);

  useChannelData({
    positions: once((positions) => {
      gridApiRef.current?.setRowData(positions);
    }),
    tickpositions: (positions: Position[]) => {
      console.log({ positions });
      adaptableApiRef.current?.gridApi.updateGridData(positions, {
        runAsync: true,
      });
    },
  });

  useFilters(adaptableApiRef);
  useThemeSync(adaptableApiRef);

  return (
    <>
      <Head title="Positions" />
      <MainLayout>
        <AdaptableReact
          style={{ flex: "none" }}
          gridOptions={gridOptions}
          adaptableOptions={adaptableOptions}
          modules={modules}
          onAdaptableReady={({ adaptableApi }) => {
            adaptableApiRef.current = adaptableApi;
          }}
        />

        <AgGridReact
          gridOptions={gridOptions}
          modules={modules}
          onGridReady={(event: GridReadyEvent) => {
            gridApiRef.current = event.api;
          }}
        />
      </MainLayout>
    </>
  );
};

export default App;
