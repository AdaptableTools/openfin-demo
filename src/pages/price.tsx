import * as React from 'react';

import AdaptableReact, {
  AdaptableApi,
  AdaptableOptions,
} from '@adaptabletools/adaptable-react-aggrid';

import { AdaptableToolPanelAgGridComponent } from '@adaptabletools/adaptable/src/AdaptableComponents';

import { AgGridReact } from '@ag-grid-community/react';

import { GridOptions, ColDef } from '@ag-grid-enterprise/all-modules';

import { getDataSource as getPrices, tickPrice } from '../data/prices';
import { columnTypes } from '../data/columnTypes';
import { priceColumns } from '../data/prices/columns';
import MainLayout from '../components/MainLayout';

import { modules } from '../components/modules';
import { plugins } from '../components/plugins';
import { useChannelData } from '../components/hooks/useChannelData';
import { useEffect, useRef } from 'react';
import { generateRandomInt, getRowData } from '../data/utils';
import { DisplayFormat4Digits } from '../data/displayFormat';
import { useFilters } from '../components/hooks/useFilters';

// create ag-Grid Column Definitions
const columnDefs: ColDef[] = priceColumns;

const prices = getPrices();

const initialGridOptions: GridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: false,
    filter: true,
    floatingFilter: true,
    sortable: true,
  },
  rowData: prices,
  components: {
    AdaptableToolPanel: AdaptableToolPanelAgGridComponent,
  },
  sideBar: true,
  suppressMenuHide: true,
  enableRangeSelection: true,

  columnTypes,
};

const adaptableOptions: AdaptableOptions = {
  primaryKey: 'instrumentId',
  adaptableId: 'PriceView',
  adaptableStateKey: `${Date.now()}`,
  editOptions: {
    // validateOnServer: (dataChangeInfo: DataChangedInfo) => {
    //   if (dataChangeInfo.ColumnId === 'bidOfferSpread') {
    //     const bidOfferSpread = dataChangeInfo.NewValue * 1;
    //     if (isNaN(bidOfferSpread)) {
    //       return Promise.resolve({
    //         NewValue: 1,
    //         ValidationMessage: 'Bid offer spread has to be a numeric value',
    //       });
    //     }
    //   }
    //   return Promise.resolve({
    //     NewValue: dataChangeInfo.NewValue * 1,
    //   });
    // },
  },
  predefinedConfig: {
    CalculatedColumn: {
      CalculatedColumns: [
        {
          ColumnId: 'bid',
          FriendlyName: 'Bid',
          ColumnExpression: '[price] - [bidOfferSpread] / 2',
        },
        {
          ColumnId: 'ask',
          FriendlyName: 'Ask',
          ColumnExpression: '[price] + [bidOfferSpread] / 2',
        },
      ],
    },
    FormatColumn: {
      FormatColumns: [
        {
          Scope: {
            ColumnIds: ['bid', 'ask'],
          },
          DisplayFormat: DisplayFormat4Digits,
        },
      ],
    },
    Dashboard: {
      Tabs: [
        {
          Name: 'Price',
          Toolbars: ['SmartEdit', 'OpenFin'],
        },
      ],
      IsCollapsed: true,
    },
    Layout: {
      CurrentLayout: 'Price',
      Layouts: [
        {
          Name: 'Price',
          Columns: [
            'instrumentId',
            'price',
            'bidOfferSpread',
            'bid',
            'ask',
            'closingPrice',
            'changeOnDay',
            'bloombergBid',
            'bloombergAsk',
          ],
        },
      ],
    },
    FlashingCell: {
      FlashingCells: [
        { ColumnId: 'price', IsLive: true },
        { ColumnId: 'bid', IsLive: true },
        { ColumnId: 'ask', IsLive: true },
      ],
    },
  },
  auditOptions: {
    auditTickingDataUpdates: {
      auditAsEvent: true,
    },
    auditCellEdits: {
      auditAsAlert: true,
    },
  },
  userInterfaceOptions: {
    showAdaptableToolPanel: true,
  },
  plugins,
};

const App: React.FC = () => {
  const adaptableApiRef = useRef<AdaptableApi>(null);
  const gridOptionsRef = useRef<GridOptions>(null);
  const { dispatch } = useChannelData();

  useFilters(adaptableApiRef.current);

  useEffect(() => {
    dispatch('set-prices', prices);
  }, [dispatch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const priceIndex = generateRandomInt(0, prices.length - 1);
      const priceObject = tickPrice(prices[priceIndex]);

      prices[priceIndex] = priceObject;

      const { current: adaptableApi } = adaptableApiRef;

      if (!adaptableApi) {
        return;
      }

      adaptableApi.gridApi.updateGridData([priceObject], {
        runAsync: true,
        callback: () => {
          dispatch('set-prices', getRowData(gridOptionsRef.current.api));
        },
      });
    }, 2500);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]);
  return (
    <>
      <MainLayout>
        <AdaptableReact
          style={{ flex: 'none' }}
          gridOptions={initialGridOptions}
          adaptableOptions={adaptableOptions}
          modules={modules}
          onAdaptableReady={({ adaptableApi, vendorGrid }) => {
            adaptableApiRef.current = adaptableApi;
            gridOptionsRef.current = vendorGrid;

            (globalThis as any).adaptableApi = adaptableApi;
            (globalThis as any).gridOptions = vendorGrid;

            // adaptableApi.eventApi.on(
            //   'GridDataChanged',
            //   (gridDataChangedEvent: GridDataChangedEventArgs) => {
            //     const event: any = gridDataChangedEvent as any;

            //     if (event.ColumnId === 'bidOfferSpread') {
            //       const bidOfferSpread = event.NewValue * 1;
            //       const primaryKey = event.PrimaryKeyValue;
            //       if (isNaN(bidOfferSpread)) {
            //         setTimeout(() => {
            //           adaptableApi.gridApi.setCellValue(
            //             event.ColumnId,
            //             event.OldValue,
            //             primaryKey,
            //             false
            //           );
            //         }, 100);
            //       } else {
            //         const { data } = event.RowNode;
            //         const { price } = data;

            //         adaptableApi.gridApi.updateGridData([
            //           { ...data, bidOfferSpread },
            //         ]);
            //       }
            //     }
            //   }
            // );
          }}
        />

        <AgGridReact gridOptions={initialGridOptions} modules={modules} />
      </MainLayout>
    </>
  );
};

export default App;
