import * as React from 'react';

import AdaptableReact, {
  AdaptableApi,
  AdaptableOptions,
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
import { useEffect, useRef } from 'react';
import { useChannelData } from '../components/hooks/useChannelData';
import { getRowData } from '../data/utils';
import { useFilters } from '../components/hooks/useFilters';

const columnDefs: ColDef[] = tradeColumns;

let rowData = getTrades({ size: 1000 });
let lastTradeId = rowData[rowData.length - 1].tradeId;

const initialGridOptions: GridOptions = {
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

  const { dispatch } = useChannelData();
  useEffect(() => {
    if (!adaptableApiRef.current) {
      return;
    }
    dispatch('set-trades', rowData);

    const intervalId = setInterval(() => {
      const { current: gridOptions } = gridOptionsRef;
      if (!gridOptions) {
        return;
      }
      lastTradeId++;
      const newTradeIndex = lastTradeId;
      const trade = createNewTrade(newTradeIndex);

      adaptableApiRef.current.gridApi.addGridData([trade], {
        runAsync: true,
        callback: () => {
          dispatch('set-trades', getRowData(gridOptionsRef.current.api));
        },
      });
    }, 1500);

    const off = adaptableApiRef.current.eventApi.on('GridDataChanged', () => {
      dispatch('set-trades', getRowData(gridOptionsRef.current.api));
    });

    return () => {
      off();
      clearInterval(intervalId);
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
