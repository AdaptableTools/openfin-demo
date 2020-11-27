import * as React from 'react';

import AdaptableReact, {
  AdaptableApi,
  AdaptableOptions,
} from '@adaptabletools/adaptable-react-aggrid';

import { AdaptableToolPanelAgGridComponent } from '@adaptabletools/adaptable/src/AdaptableComponents';

import { AgGridReact } from '@ag-grid-community/react';

import { GridOptions, ColDef } from '@ag-grid-enterprise/all-modules';

import { columnTypes } from '../data/columnTypes';
import { priceColumns } from '../data/prices/columns';
import MainLayout from '../components/MainLayout';

import { modules } from '../components/modules';
import { plugins } from '../components/plugins';
import { useChannelData } from '../components/hooks/useChannelData';
import { useEffect, useRef } from 'react';
import { generateRandomInt, getRowData } from '../data/utils';
import { once } from '../components/once';
import { DisplayFormat4Digits } from '../data/displayFormat';
import { useFilters } from '../components/hooks/useFilters';
import { useDispatchOnDataChanged } from '../components/hooks/useDispatchOnDataChanged';
import { Price } from '../data/prices';
import { useThemeSync } from '../components/hooks/useThemeSync';
import Head from '../components/Head';
import { initAdaptableOptions } from '../components/initAdaptableOptions';

// create ag-Grid Column Definitions
const columnDefs: ColDef[] = priceColumns;

const initialGridOptions: GridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: false,
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
  primaryKey: 'instrumentId',
  adaptableId: 'PriceView',
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
    ConditionalStyle: {
      ConditionalStyles: [
        {
          Scope: {
            ColumnIds: ['changeOnDay'],
          },
          Style: {
            BackColor: 'green',
            ForeColor: '#000000',
          },
          Expression: '[changeOnDay] > 0',
          ExcludeGroupedRows: true,
        },
        {
          Scope: {
            ColumnIds: ['changeOnDay'],
          },
          Style: {
            BackColor: 'red',
            ForeColor: '#000000',
          },
          Expression: '[changeOnDay] < 0',
          ExcludeGroupedRows: true,
        },
      ],
    },
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

  useThemeSync(adaptableApiRef);

  useDispatchOnDataChanged({
    client,
    dispatchChannelName: 'updateprice',
    adaptableApiRef,
  });

  return (
    <>
      <Head title="Prices" />
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
          }}
        />

        <AgGridReact gridOptions={initialGridOptions} modules={modules} />
      </MainLayout>
    </>
  );
};

export default App;
