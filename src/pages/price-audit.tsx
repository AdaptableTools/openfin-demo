import * as React from "react";
import { useChannelData } from "../components/hooks/useChannelData";
import { useRef } from "react";
import type { Price } from "../data/prices";
import Head from "../components/Head";
import { CellEditAudit } from "../components/types";
import MainLayout from "../components/MainLayout";
import AdaptableReact, {
  AdaptableApi,
  AdaptableOptions,
  AdaptableToolPanelAgGridComponent,
} from "@adaptabletools/adaptable-react-aggrid";
import { modules } from "../components/modules";
import { AgGridReact } from "@ag-grid-community/react";
import { initAdaptableOptions } from "../components/initAdaptableOptions";
import { ColDef, GridOptions } from "@ag-grid-enterprise/all-modules";
import { columnTypes } from "../data/columnTypes";
import { useFilters } from "../components/hooks/useFilters";
import { useThemeSync } from "../components/hooks/useThemeSync";
import { once } from "../components/once";
import { DisplayFormat4Digits } from "../data/displayFormat";
import { ThemeConfig } from "../components/ThemeConfig";
import openfin from "@adaptabletools/adaptable-plugin-openfin";
import { useAdaptableReady } from "../components/hooks/useAdaptableReady";

type Item = {
  timestamp: string;
  oldValue: number;
  newValue: number;
  instrumentId: string;
  username: string;
  trigger: string;
};

const columns: ColDef[] = [
  {
    field: "timestamp",
    type: "abColDefDate",
  },

  {
    field: "instrumentId",
    enableRowGroup: true,
    type: "abColDefString",
  },
  {
    field: "oldValue",
    type: "abColDefNumber",
  },
  {
    field: "newValue",
    type: "abColDefNumber",
  },

  {
    field: "trigger",
    type: "abColDefString",
  },
];

const initialGridOptions: GridOptions = {
  columnDefs: columns,
  defaultColDef: {
    editable: false,
    initialWidth: 300,
    filter: true,
    resizable: true,
    floatingFilter: true,
    sortable: true,
  },
  rowData: [],
  components: {
    AdaptableToolPanel: AdaptableToolPanelAgGridComponent,
  },
  sideBar: false,
  suppressMenuHide: true,
  enableRangeSelection: true,

  columnTypes,
};

const adaptableOptions: AdaptableOptions = initAdaptableOptions({
  primaryKey: "timestamp",
  adaptableId: "Price Audit",
  predefinedConfig: {
    Theme: ThemeConfig,
    Dashboard: {
      Tabs: [],
      IsCollapsed: true,
    },
    Layout: {
      CurrentLayout: "Latest",
      Layouts: [
        {
          Name: "Latest",
          Columns: [
            "timestamp",
            "instrumentId",
            "oldValue",
            "newValue",
            "trigger",
          ],
          ColumnSorts: [
            {
              ColumnId: "timestamp",
              SortOrder: "Desc",
            },
          ],
        },
      ],
    },
    FormatColumn: {
      FormatColumns: [
        {
          Scope: {
            ColumnIds: ["newValue", "oldValue"],
          },
          CellAlignment: "Right",
          DisplayFormat: DisplayFormat4Digits,
        },
        {
          Scope: {
            ColumnIds: ["timestamp"],
          },
          DisplayFormat: {
            Formatter: "DateFormatter",
            Options: {
              Pattern: "MM/dd/yyyy HH:mm:ss",
            },
          },
        },
      ],
    },
  },
  plugins: [
    openfin({
      notificationTimeout: false,
      showAppIconInNotifications: true,
    }),
  ],
});

const toItem = (priceAudit) => {
  const item = {
    timestamp: priceAudit.client_timestamp,
    oldValue: priceAudit.data_change_details.previous_value * 1,
    newValue: priceAudit.data_change_details.new_value * 1,
    instrumentId: priceAudit.data_change_details.row_data.instrumentId,
    username: priceAudit.username,
    trigger: priceAudit.audit_trigger,
  } as Item;

  return item;
};

const App = () => {
  const adaptableApiRef = useRef<AdaptableApi>(null);
  const gridOptionsRef = useRef<GridOptions>(null);

  useChannelData({
    priceaudits: once((priceAudits: CellEditAudit<Price>[]) => {
      const items = priceAudits.map(toItem);
      gridOptionsRef.current.api.setRowData(items);
    }),
    addpriceaudit: (priceAudit: CellEditAudit<Price>) => {
      const item = toItem(priceAudit);

      if (
        adaptableApiRef.current.gridApi.getRowNodeForPrimaryKey(
          item.instrumentId
        )
      ) {
        return;
      }
      adaptableApiRef.current.gridApi.addGridData([item], {
        runAsync: true,
      });
    },
  });

  useThemeSync(adaptableApiRef);
  useFilters(adaptableApiRef);

  const onAdaptableReady = useAdaptableReady(({ adaptableApi, vendorGrid }) => {
    adaptableApiRef.current = adaptableApi;
    gridOptionsRef.current = vendorGrid;
  });

  return (
    <>
      <Head title="Price Audit" />
      <MainLayout>
        <AdaptableReact
          style={{ flex: "none" }}
          gridOptions={initialGridOptions}
          modules={modules}
          adaptableOptions={adaptableOptions}
          onAdaptableReady={onAdaptableReady}
        />

        <AgGridReact gridOptions={initialGridOptions} modules={modules} />
      </MainLayout>
    </>
  );
};

export default App;
