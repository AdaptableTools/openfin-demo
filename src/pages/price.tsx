import * as React from 'react';

import AdaptableReact, {
  AdaptableOptions,
} from '@adaptabletools/adaptable-react-aggrid';

import { AdaptableToolPanelAgGridComponent } from '@adaptabletools/adaptable/src/AdaptableComponents';

import { AgGridReact } from '@ag-grid-community/react';

import { GridOptions, ColDef } from '@ag-grid-enterprise/all-modules';

import { getDataSource as getPrices } from '../data/prices';
import { columnTypes } from '../data/columnTypes';
import { priceColumns } from '../data/prices/columns';
import MainLayout from '../components/MainLayout';

import { modules } from '../components/modules';
import { plugins } from '../components/plugins';
import { useChannelData } from '../components/hooks';
import { useEffect } from 'react';

// create ag-Grid Column Definitions
const columnDefs: ColDef[] = priceColumns;

const rowData = getPrices();

const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: false,
    filter: true,
    floatingFilter: true,
    sortable: true,
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
          DisplayFormat: {
            Formatter: 'NumberFormatter',
            Options: {
              FractionDigits: 4,
            },
          },
        },
      ],
    },
    Dashboard: {
      Tabs: [
        {
          Name: 'Dashboard',
          Toolbars: ['SmartEdit', 'OpenFin', 'Export', 'Layout'],
        },
      ],
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
  const { dispatch } = useChannelData();

  useEffect(() => {
    dispatch('set-prices', rowData);
  }, []);
  return (
    <>
      <MainLayout>
        <AdaptableReact
          style={{ flex: 'none' }}
          gridOptions={gridOptions}
          adaptableOptions={adaptableOptions}
          modules={modules}
          onAdaptableReady={({ adaptableApi, vendorGrid }) => {
            console.log('ready!!!!', adaptableApi);
            (globalThis as any).adaptableApi = adaptableApi;

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

        <AgGridReact gridOptions={gridOptions} modules={modules} />
      </MainLayout>
    </>
  );
};

export default App;
