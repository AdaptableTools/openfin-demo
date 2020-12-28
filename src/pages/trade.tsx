import * as React from "react";
import { useRef } from "react";
import AdaptableReact, {
  AdaptableApi,
  AdaptableOptions,
} from "@adaptabletools/adaptable-react-aggrid";
import { AdaptableToolPanelAgGridComponent } from "@adaptabletools/adaptable/src/AdaptableComponents";
import { AgGridReact } from "@ag-grid-community/react";
import { GridOptions, ColDef } from "@ag-grid-enterprise/all-modules";
import { columnTypes } from "../data/columnTypes";
import { tradeColumns } from "../data/trades/columns";
import MainLayout from "../components/MainLayout";
import { modules } from "../components/modules";
import { once } from "../components/once";
import { useChannelData } from "../components/hooks/useChannelData";
import { useFilters } from "../components/hooks/useFilters";
import { useDispatchOnDataChanged } from "../components/hooks/useDispatchOnDataChanged";
import { useThemeSync } from "../components/hooks/useThemeSync";
import Head from "../components/Head";
import { initAdaptableOptions } from "../components/initAdaptableOptions";
import { useAudit } from "../components/hooks/useAudit";
import { ThemeConfig } from "../components/ThemeConfig";
import { GREEN, RED } from "../components/colors";

const columnDefs: ColDef[] = tradeColumns;

const initialGridOptions: GridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: false,
    filter: true,
    floatingFilter: true,
    sortable: true,
    resizable: true
  },
  rowData: null,
  components: {
    AdaptableToolPanel: AdaptableToolPanelAgGridComponent,
  },
  sideBar: true,
  suppressMenuHide: true,
  enableRangeSelection: true,
  singleClickEdit: true,
  columnTypes,
};

const adaptableOptions: AdaptableOptions = initAdaptableOptions({
  primaryKey: "tradeId",
  adaptableId: "Trade View",
  userFunctions: [
    {
      name: "renderCancelButton",
      type: "ActionColumnShouldRenderPredicate",
      handler: (params) => {
        return true; //params.rowData.status !== "active";
      },
    },
  ],
  predefinedConfig: {
    Theme: ThemeConfig,
    Dashboard: {
      Tabs: [
        {
          Name: "Blotter",
          Toolbars: ["Layout", "CellSummary", "Query", "Filter"],
        },
        {
          Name: "Reports",
          Toolbars: ["OpenFin", "Export"],
        },
      ],
    },

    GradientColumn: {
       GradientColumns: [
        {
          BaseValue: 4500000,
          ColumnId: "notional",
          NegativeColor: RED,
          PositiveColor: GREEN,
          PositiveValue: 10000000,
        }
      ]
    },
    ActionColumn: {
       ActionColumns: [
        {
          ColumnId: "setStatusCancel",
          FriendlyName: "Cancel",
          ButtonText: "Cancel",
          ShouldRenderPredicate: "renderCancelButton",
        },
      ],
    },
    Query: {
      Revision: 7,
      SharedQueries: [
        {
          Name: 'Active US Trades',
          Expression: '[status]="active" AND [counterparty] IN ("Goldman Sachs","Bank of America","JP Morgan","Morgan Stanley")',
          Uuid: 'active-us-trades'
        }
      ]
    },
    ConditionalStyle: {
      ConditionalStyles: [
        {
          Scope: {
            All: true,
          },

          Style: {
            BackColor: "#ffffcc",
            FontStyle: "Italic",
            ForeColor: "#000000",
          },
          Expression: '[status] = "active"',
          ExcludeGroupedRows: true,
        },
      ],
    },
    FormatColumn: {
      FormatColumns: [
        {
          Scope: {
            ColumnIds: ["tradeDate", "settlementDate", "lastUpdated"],
          },
          DisplayFormat: {
            Formatter: 'DateFormatter',
            Options: {
              Pattern: 'dd-MM-yyyy'
            }
          },
        },
      ],
    },
    Layout: {
      Layouts: [
        {
          Name: "Latest Trades",
          Columns: [
            "tradeId",
            "instrumentId",
            "instrumentName",
            "notional",
            //  "setStatusCancel",
            "status",
            "counterparty",
            "currency",
            "rating",
            "tradeDate",
            "settlementDate",
            "lastUpdatedBy",
            "lastUpdated",
          ],
          ColumnSorts: [
            {
              ColumnId: "tradeId",
              SortOrder: "Desc",
            },
          ],
        },
        {
          Name: "Counterparties",
          Columns: [
            "tradeId",
            "instrumentId",
            "instrumentName",
            "counterparty",
            "notional",
            "rating",
            "status",
          ],
          RowGroupedColumns: ["counterparty"],
          AggregationColumns: {
            notional: true,
          },
        },
      ],
    },
    Export: {
       Reports: [
        {
          Name: "Active Trades",
          ReportColumnScope: "AllColumns",
          ReportRowScope: "ExpressionRows",
          Expression: '[status] = "active"',
        },
      ],
    },
    UserInterface: {
      /*
      EditLookUpItems: [
        {
          Scope: {
            ColumnIds: ["status"],
          },
          LookUpValues: ["active", "inactive"],
        },
      ],
      */
    },
  },
});

const App: React.FC = () => {
  const adaptableApiRef = useRef<AdaptableApi>(null);
  const gridOptionsRef = useRef<GridOptions>(null);

  useFilters(adaptableApiRef);
  useAudit("tradeaudits", adaptableApiRef);

  const { client } = useChannelData({
    trades: once((trades) => {
      gridOptionsRef.current.api?.setRowData(trades);
    }),
    addtrade: (trade) => {
      if (adaptableApiRef.current.gridApi.getRowNodeForPrimaryKey(trade.tradeId)) {
        return
      }

      adaptableApiRef.current.gridApi.addGridData([trade], {
        runAsync: true,
      });
    },
  });

  useDispatchOnDataChanged({
    client,
    dispatchChannelName: "updatetrade",
    adaptableApiRef,
  });

  useThemeSync(adaptableApiRef);

  return (
    <>
      <Head title="Trades" />
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
