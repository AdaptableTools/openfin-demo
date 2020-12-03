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
import { GridOptions } from "@ag-grid-enterprise/all-modules";

import { columnTypes } from "../data/columnTypes";
import { useFilters } from "../components/hooks/useFilters";
import { useThemeSync } from "../components/hooks/useThemeSync";
import { once } from "../components/once";

type Item = {
  timestamp: string;
  oldValue: string;
  newValue: string;
  instrumentId: string;
  username: string;
};

const columns = [
  {
    field: "timestamp",
    type: "abColDefString",
  },

  {
    field: "instrumentId",
    type: "abColDefString",
  },
  {
    field: "oldValue",
    type: "abColDefString",
  },
  {
    field: "newValue",
    type: "abColDefString",
  },
  {
    field: "username",
    type: "abColDefString",
  },
];

const initialGridOptions: GridOptions = {
  columnDefs: columns,
  defaultColDef: {
    editable: false,
    initialWidth: 300,
    filter: true,
    floatingFilter: true,
    sortable: true,
  },
  rowData: null,
  components: {
    AdaptableToolPanel: AdaptableToolPanelAgGridComponent,
  },
  sideBar: true,
  suppressMenuHide: true,
  enableRangeSelection: true,

  columnTypes,
};

const adaptableOptions: AdaptableOptions = initAdaptableOptions({
  primaryKey: "timestamp",
  adaptableId: "Price Audit",

  predefinedConfig: {
    Dashboard: {
      Tabs: [],
      IsCollapsed: true,
    },
  },
});

const toItem = (priceAudit) => {
  const item = {
    timestamp: priceAudit.client_timestamp,
    oldValue: priceAudit.data_change_details.previous_value,
    newValue: priceAudit.data_change_details.new_value,
    instrumentId: priceAudit.data_change_details.row_data.instrumentId,
    username: priceAudit.username
  } as Item;

  console.log(item)
  return item
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
      adaptableApiRef.current.gridApi.addGridData([toItem(priceAudit)], {
        runAsync: true,
      });
    },
  });

  useThemeSync(adaptableApiRef);
  useFilters(adaptableApiRef);

  return (
    <>
      <Head title="Price Audit" />
      <MainLayout>
        <AdaptableReact
          style={{ flex: "none" }}
          gridOptions={initialGridOptions}
          modules={modules}
          adaptableOptions={adaptableOptions}
          onAdaptableReady={({ adaptableApi, vendorGrid }) => {
            adaptableApiRef.current = adaptableApi;
            gridOptionsRef.current = vendorGrid;
          }}
        />

        <AgGridReact gridOptions={initialGridOptions} modules={modules} />
      </MainLayout>
    </>
  );
};

export default App;
