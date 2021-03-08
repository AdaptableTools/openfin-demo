import * as React from "react";
import AdaptableReact, {
  AdaptableApi,
  AdaptableOptions,
  MenuInfo,
} from "@adaptabletools/adaptable-react-aggrid";
import { AdaptableToolPanelAgGridComponent } from "@adaptabletools/adaptable/src/AdaptableComponents";
import { AgGridReact } from "@ag-grid-community/react";
import { GridOptions, ColDef } from "@ag-grid-enterprise/all-modules";
import { columnTypes } from "../data/columnTypes";
import { priceColumns } from "../data/prices/columns";
import MainLayout from "../components/MainLayout";
import { modules } from "../components/modules";
import { useChannelData } from "../components/hooks/useChannelData";
import { useRef } from "react";
import { once } from "../components/once";
import { DisplayFormat4Digits } from "../data/displayFormat";
import { useFilters } from "../components/hooks/useFilters";
import { useDispatchOnDataChanged } from "../components/hooks/useDispatchOnDataChanged";
import { Price } from "../data/prices";
import { useThemeSync } from "../components/hooks/useThemeSync";
import Head from "../components/Head";
import { initAdaptableOptions } from "../components/initAdaptableOptions";
import { useAudit } from "../components/hooks/useAudit";
import { GREEN, RED } from "../components/colors";
import { ThemeConfig } from "../components/ThemeConfig";
import openfin from "@adaptabletools/adaptable-plugin-openfin";
import { getInstrumentName } from "../data/utils";
import { setInstrumentId } from "../components/setInstrumentId";
import finance, {
  abColDefFDC3Instrument,
} from "@adaptabletools/adaptable-plugin-finance";

const columnDefs: ColDef[] = priceColumns;

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
  columnTypes,
};

const adaptableOptions: AdaptableOptions = initAdaptableOptions({
  primaryKey: "instrumentId",
  adaptableId: "Price View",
  editOptions: {
    // validateOnServer: (dataChangeInfo: DataChangedInfo) => {
    //   if (dataChangeInfo.columnId === 'bidOfferSpread') {
    //     const bidOfferSpread = dataChangeInfo.newValue * 1;
    //     if (isNaN(bidOfferSpread)) {
    //       return Promise.resolve({
    //         NewValue: 1,
    //         ValidationMessage: 'Bid offer spread has to be a numeric value',
    //       });
    //     }
    //   }
    //   return Promise.resolve({
    //     NewValue: dataChangeInfo.newValue * 1,
    //   });
    // },
  },
  predefinedConfig: {
    Theme: ThemeConfig,
    ConditionalStyle: {
      ConditionalStyles: [
        {
          Scope: {
            ColumnIds: ["changeOnDay"],
          },
          Style: {
            BackColor: GREEN,
            ForeColor: "#000000",
          },
          Predicate: {
            PredicateId: "Positive",
          },
        },
        {
          Scope: {
            ColumnIds: ["changeOnDay"],
          },
          Style: {
            BackColor: RED,
            ForeColor: "#000000",
          },
          Predicate: {
            PredicateId: "Negative",
          },
        },
      ],
    },
    CalculatedColumn: {
      CalculatedColumns: [
        {
          ColumnId: "bid",
          FriendlyName: "Bid",
          ColumnExpression: "[price] - [bidOfferSpread] / 2",
        },
        {
          ColumnId: "ask",
          FriendlyName: "Ask",
          ColumnExpression: "[price] + [bidOfferSpread] / 2",
        },
        {
          ColumnId: "changeOnDay",
          FriendlyName: "Change on Day",
          ColumnExpression: "[price] - [closingPrice]",
        },
      ],
    },
    PlusMinus: {
      PlusMinusRules: [
        {
          ColumnId: "bidOfferSpread",
          NudgeValue: 0.5,
          IsDefaultNudge: true,
        },
        {
          ColumnId: "bidOfferSpread",
          NudgeValue: 1,
          IsDefaultNudge: false,
          Expression: '[instrumentId]= "AAPL"',
        },
        // {
        //   ColumnId: 'bidOfferSpread',
        //   NudgeValue: 0,
        //   IsDefaultNudge: false,
        //   Expression: '[price] > 130',
        // },
      ],
    },
    FormatColumn: {
      FormatColumns: [
        {
          Scope: {
            ColumnIds: ["bid", "ask", "changeOnDay", "price"],
          },
          CellAlignment: "Right",
          DisplayFormat: DisplayFormat4Digits,
        },
      ],
    },
    Dashboard: {
      VisibleButtons: ["GridInfo", "Layout", "ConditionalStyle"],
      Tabs: [
        {
          Name: "Price",
          Toolbars: ["SmartEdit", "OpenFin"],
        },
      ],
      IsCollapsed: true,
    },
    Layout: {
      CurrentLayout: "Price",
      Layouts: [
        {
          Name: "Price",
          Columns: [
            "instrumentId",
            "price",
            "bidOfferSpread",
            "bid",
            "ask",
            "closingPrice",
            "changeOnDay",
            "bbgBid",
            "bbgAsk",
          ],
        },
      ],
    },

    FlashingCell: {
      FlashingCells: [
        { ColumnId: "price", IsLive: true, UpColor: GREEN, DownColor: RED },
        { ColumnId: "bid", IsLive: true, UpColor: GREEN, DownColor: RED },
        { ColumnId: "ask", IsLive: true, UpColor: GREEN, DownColor: RED },
      ],
    },
  },
  plugins: [
    openfin({
      notificationTimeout: false,
      showAppIconInNotifications: true,
    }),
    finance(),
  ],
});

const App: React.FC = () => {
  const adaptableApiRef = useRef<AdaptableApi>(null);
  const gridOptionsRef = useRef<GridOptions>(null);
  const { client } = useChannelData({
    prices: once((prices) => {
      gridOptionsRef.current.api?.setRowData(prices);
    }),
    tickprice: (priceObject: Price) => {
      adaptableApiRef.current?.gridApi.updateGridData([priceObject], {
        runAsync: true,
      });
    },
  });

  useFilters(adaptableApiRef);

  useAudit("priceaudits", adaptableApiRef);

  useThemeSync(adaptableApiRef);

  useDispatchOnDataChanged({
    client,
    dispatchChannelName: "updateprice",
    adaptableApiRef,
  });

  return (
    <>
      <Head title="Prices" />
      <MainLayout>
        <AdaptableReact
          style={{ flex: "none" }}
          gridOptions={initialGridOptions}
          adaptableOptions={adaptableOptions}
          modules={modules}
          onAdaptableReady={({ adaptableApi, vendorGrid }) => {
            adaptableApiRef.current = adaptableApi;
            gridOptionsRef.current = vendorGrid;

            (globalThis as any).adaptableApi = adaptableApi;
            (globalThis as any).gridOptions = vendorGrid;
          }}
        />

        <AgGridReact gridOptions={initialGridOptions} modules={modules} />
      </MainLayout>
    </>
  );
};

export default App;
