import * as React from "react";
import AdaptableReact, {
 
} from "@adaptabletools/adaptable-react-aggrid";
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
import openfin from '@adaptabletools/adaptable-plugin-openfin';
import { AdaptableAlert, AdaptableApi, AdaptableOptions, AdaptablePredicate, AlertDefinition } from "@adaptabletools/adaptable/src/types"; 


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
    resizable: true
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

const adaptableOptions: AdaptableOptions = initAdaptableOptions({
  primaryKey: "instrumentId",
  adaptableId: "Position View",
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
      Tabs: [
        { Name: "Position", Toolbars: ['OpenFin', "SmartEdit", "Alert", "CellSummary"] },
      ],
    },
    Alert: {
      AlertDefinitions: [
        {
          Scope: {
            ColumnIds: ["position"],
          },

          Predicate: {
            PredicateId: "GreaterThan",
            Inputs: [50000],
          },
          MessageType: "Warning",
          AlertProperties: {
            ShowInOpenFin: true,
            JumpToCell: false,
            HighlightCell: false
          },
        },
      ],
    },
  },
  plugins: [openfin({
    notificationTimeout: false,
    showApplicationIconInNotifications: true,
    onShowNotification: (notification) => {
      notification.buttons = [
        {
          title: 'Increase Limit',
          type: 'button',
          cta: true,
          onClick: {
            task: 'increase-limit'
          },
        },
        {
          title: 'Show Me',
          type: 'button',
          cta: true,
          onClick: {
            task: 'jump-to-cell'
          },
        },
      ];
    },
    onNotificationAction: (event) => {
      if (event.result.task === 'jump-to-cell') {
        const alert = event.notification.alert as AdaptableAlert;

        adaptableApiRef.current.gridApi.jumpToCell(
          alert.DataChangedInfo?.primaryKeyValue,
          alert.DataChangedInfo?.columnId || ''
        );

        adaptableApiRef.current.gridApi.highlightCell({
          columnId: alert.DataChangedInfo?.columnId || '',
          primaryKeyValue: alert.DataChangedInfo?.primaryKeyValue,
          timeout: 2500,
          highlightType: alert.AlertDefinition.MessageType
        });
      }
      if (event.result.task === 'increase-limit') {
       
         const alert: AdaptableAlert = event.notification.alert as AdaptableAlert;
    if(alert){
         let alertDefinition: AlertDefinition = alert.AlertDefinition;
        if (alertDefinition) {
          let predicate = alertDefinition.Predicate;
          if (predicate) {
            let inputs: any[] | undefined = predicate.Inputs;
            if (inputs && inputs.length > 0) {
              let firstInput = inputs[0];
              let newValue = firstInput + 1000;
              let newPredicate: AdaptablePredicate = {
                PredicateId: 'GreaterThan',
                Inputs: [newValue],
              };
              alertDefinition.Predicate = newPredicate;
              adaptableApiRef.current.alertApi.editAlert(alertDefinition);
            }
          }   
          }
        }
     }
    },
  })],
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
