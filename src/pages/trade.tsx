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
import { GREEN } from "../components/colors";
import openfin from "@adaptabletools/adaptable-plugin-openfin";
import finance from "@adaptabletools/adaptable-plugin-finance";
import {
  ActionColumnButtonContext,
  AdaptableButton,
  MenuContext,
} from "@adaptabletools/adaptable/src/types";
import { useAdaptableReady } from "../components/hooks/useAdaptableReady";

const columnDefs: ColDef[] = tradeColumns;

let adaptableApiRef: React.MutableRefObject<AdaptableApi>;
const initialGridOptions: GridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: false,
    filter: true,
    floatingFilter: true,
    sortable: true,
    resizable: true,
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
  menuOptions: {
    contextMenuItems: [
      {
        label: "Cancel Trade",
        onClick: (menuContext: MenuContext) => {
          const node = menuContext.rowNode;
          if (node && node.data) {
            const tradeId = node.data["tradeId"];
            adaptableApiRef.current.gridApi.setCellValue(
              "status",
              "inactive",
              tradeId,
              true
            );
          }
        },
        shouldRender: (menuContext: MenuContext) => {
          if (!menuContext.isGroupedNode) {
            const node = menuContext.rowNode;
            return (
              node &&
              node.data &&
              node.data["status"] &&
              node.data["status"] == "active"
            );
          }
          return false;
        },
      },
    ],
  },

  userInterfaceOptions: {
    actionColumns: [
      {
        columnId: "cancel",
        friendlyName: "Cancel",
        actionColumnButton: {
          label: "Cancel",
          buttonStyle: {
            variant: "raised",
            tone: "accent",
          },
          shouldRender: (
            button: AdaptableButton,
            context: ActionColumnButtonContext
          ) => {
            return (
              context.rowNode?.data != null &&
              context.rowNode.data.status == "active"
            );
          },
          onClick: (
            button: AdaptableButton,
            context: ActionColumnButtonContext
          ) => {
            adaptableApiRef.current.gridApi.setCellValue(
              "status",
              "inactive",
              context.primaryKeyValue,
              true
            );
          },
        },
      },
    ],
    editLookUpItems: [
      {
        scope: {
          ColumnIds: ["status"],
        },
        values: ["active", "inactive"],
      },
    ],
  },
  predefinedConfig: {
    Theme: ThemeConfig,
    Dashboard: {
      VisibleButtons: ["GridInfo", "Alert", "Layout", "ConditionalStyle"],
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

    Alert: {
      AlertDefinitions: [
        {
          Scope: {
            ColumnIds: ["notional"],
          },
          Rule: {
            Predicate: {
              PredicateId: "Negative",
            },
          },

          MessageType: "Error",
          AlertProperties: {
            PreventEdit: true,
          },
        },
      ],
    },

    Query: {
      NamedQueries: [
        {
          Name: "Active US Trades",
          BooleanExpression:
            '[status]="active" AND [counterparty] IN ("Goldman Sachs","Bank of America","JP Morgan","Morgan Stanley")',
        },
      ],
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
          Rule: {
            BooleanExpression: '[status] = "active"',
          },
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
            Formatter: "DateFormatter",
            Options: {
              Pattern: "dd-MM-yyyy",
            },
          },
        },
        {
          Scope: {
            ColumnIds: ["notional"],
          },
          ColumnStyle: {
            GradientStyle: {
              CellRanges: [
                {
                  Min: 4500000,
                  Max: 10000000,
                  Color: GREEN,
                },
              ],
            },
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
            "status",
            "cancel",
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
          Query: {
            BooleanExpression: '[status] = "active"',
          },
        },
      ],
    },
  },
  plugins: [
    openfin({
      notificationTimeout: false,
      showAppIconInNotifications: true,
      onValidationFailureInExcel: "show-undo-notification",
    }),
    finance({
      instrumentColumns: [
        {
          columnId: "instrumentId",
          cusipColumnId: "cusip",
          tickerColumnId: "instrumentId",
        },
      ],
    }),
  ],
});

const App: React.FC = () => {
  adaptableApiRef = useRef<AdaptableApi>(null);
  const gridOptionsRef = useRef<GridOptions>(null);

  useFilters(adaptableApiRef);
  useAudit("tradeaudits", adaptableApiRef);

  const { client } = useChannelData({
    trades: once((trades) => {
      gridOptionsRef.current.api?.setRowData(trades);
    }),
    addtrade: (trade) => {
      if (
        adaptableApiRef.current.gridApi.getRowNodeForPrimaryKey(trade.tradeId)
      ) {
        return;
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

  const onAdaptableReady = useAdaptableReady(({ adaptableApi, vendorGrid }) => {
    adaptableApiRef.current = adaptableApi;
    gridOptionsRef.current = vendorGrid;
  });

  return (
    <>
      <Head title="Trades" />
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
