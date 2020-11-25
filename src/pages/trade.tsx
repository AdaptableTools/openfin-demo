import * as React from 'react';

import AdaptableReact, {
  AdaptableApi,
  AdaptableOptions,
  GridDataChangedEventArgs,
  SearchChangedEventArgs,
} from '@adaptabletools/adaptable-react-aggrid';

import { AdaptableToolPanelAgGridComponent } from '@adaptabletools/adaptable/src/AdaptableComponents';

import { AgGridReact } from '@ag-grid-community/react';

import { GridOptions, ColDef, GridApi } from '@ag-grid-enterprise/all-modules';

import {
  createNewTrade,
  createTrade,
  getDataSource as getTrades,
} from '../data/trades';
import { columnTypes } from '../data/columnTypes';
import { tradeColumns } from '../data/trades/columns';
import MainLayout from '../components/MainLayout';
import { modules } from '../components/modules';
import { plugins } from '../components/plugins';
import { once } from '../components/once';
import { useEffect, useRef } from 'react';
import { useChannelData } from '../components/hooks/useChannelData';

import { useFilters } from '../components/hooks/useFilters';

const columnDefs: ColDef[] = tradeColumns;

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
  singleClickEdit: true,

  columnTypes,
};

const adaptableOptions: AdaptableOptions = {
  primaryKey: 'tradeId',
  adaptableId: 'TradeView',
  adaptableStateKey: `${Date.now()}`,
  auditOptions: {
    auditFunctionEvents: {
      auditAsEvent: true,
    },
  },
  predefinedConfig: {
    Dashboard: {
      Tabs: [{ Name: 'Dashboard', Toolbars: ['OpenFin', 'Export', 'Layout'] }],
    },
    Layout: {
      Layouts: [
        {
          Name: 'Latest Trades',
          Columns: [
            'tradeId',
            'instrumentId',
            'instrumentName',
            'notional',
            'status',
            'counterparty',
            'currency',
            'rating',
            'tradeDate',
            'settlementDate',
            'lastUpdated',
            'lastUpdatedBy',
          ],
          ColumnSorts: [
            {
              ColumnId: 'tradeId',
              SortOrder: 'Desc',
            },
          ],
        },
      ],
    },
    UserInterface: {
      EditLookUpItems: [
        {
          Scope: {
            ColumnIds: ['status'],
          },
          LookUpValues: ['active', 'inactive'],
        },
      ],
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

  useFilters(adaptableApiRef.current);

  const { dispatch } = useChannelData({
    trades: once((trades) => {
      gridOptionsRef.current.api?.setRowData(trades);
    }),
    addtrade: (trade) => {
      adaptableApiRef.current.gridApi.addGridData([trade], {
        runAsync: true,
      });
    },
  });

  // const { dispatch } = useChannelData();
  // useEffect(() => {
  //   if (!adaptableApiRef.current) {
  //     return;
  //   }
  //   dispatch('set-trades', rowData);

  //   const intervalId = setInterval(() => {
  //     const { current: gridOptions } = gridOptionsRef;
  //     if (!gridOptions) {
  //       return;
  //     }
  //     lastTradeId++;
  //     const newTradeIndex = lastTradeId;
  //     const trade = createNewTrade(newTradeIndex);

  //     adaptableApiRef.current.gridApi.addGridData([trade], {
  //       runAsync: true,
  //       callback: () => {
  //         dispatch('set-trades', getRowData(gridOptionsRef.current.api));
  //       },
  //     });
  //   }, 1500);

  useEffect(() => {
    const eventApi = adaptableApiRef.current?.eventApi;
    if (!eventApi) {
      return;
    }
    const off = eventApi.on(
      'GridDataChanged',
      (event: GridDataChangedEventArgs) => {
        const {
          dataChangedInfo,
        } = eventApi.getGridDataChangedInfoFromEventArgs(event);

        dispatch('updatetrade', {
          primaryKey: dataChangedInfo.PrimaryKeyValue,
          columnId: dataChangedInfo.ColumnId,
          newValue: dataChangedInfo.NewValue,
        });
      }
    );

    return () => {
      off();
      //     clearInterval(intervalId);
    };
  }, [dispatch]);

  return (
    <>
      <MainLayout>
        <AdaptableReact
          style={{ flex: 'none' }}
          gridOptions={initialGridOptions}
          modules={modules}
          adaptableOptions={adaptableOptions}
          onAdaptableReady={({ adaptableApi, vendorGrid }) => {
            adaptableApiRef.current = adaptableApi;
            gridOptionsRef.current = vendorGrid;
            (globalThis as any).adaptableApi = adaptableApi;
          }}
        />

        <AgGridReact gridOptions={initialGridOptions} modules={modules} />
      </MainLayout>
    </>
  );
};

export default App;
