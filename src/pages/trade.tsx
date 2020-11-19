import * as React from 'react';

import AdaptableReact, {
  AdaptableApi,
  AdaptableOptions,
} from '@adaptabletools/adaptable-react-aggrid';

import { AdaptableToolPanelAgGridComponent } from '@adaptabletools/adaptable/src/AdaptableComponents';

import { AgGridReact } from '@ag-grid-community/react';

import { GridOptions, ColDef, GridApi } from '@ag-grid-enterprise/all-modules';

import { createTrade, getDataSource as getTrades } from '../data/trades';
import { columnTypes } from '../data/columnTypes';
import { tradeColumns } from '../data/trades/columns';
import MainLayout from '../components/MainLayout';
import { modules } from '../components/modules';
import { plugins } from '../components/plugins';
import { useEffect, useRef } from 'react';
import { useChannelData } from '../components/hooks';

const columnDefs: ColDef[] = tradeColumns;

let rowData = getTrades({ size: 1000 });
let lastTradeId = rowData[rowData.length - 1].tradeId;

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
  primaryKey: 'tradeId',
  adaptableId: 'TradeView',
  adaptableStateKey: `${Date.now()}`,
  predefinedConfig: {
    Dashboard: {
      Tabs: [{ Name: 'Dashboard', Toolbars: ['OpenFin', 'Export', 'Layout'] }],
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
    dispatch('set-trades', rowData);

    setInterval(() => {
      lastTradeId++;
      const trade = createTrade(lastTradeId);

      adaptableApiRef.current.gridApi.addGridData([trade], {
        runAsync: true,
        callback: () => {
          rowData = rowData.concat(trade);

          console.log('done setting data', rowData.length);
          dispatch('set-trades', rowData);
        },
      });
    }, 1500);
  }, []);

  const adaptableApiRef = useRef<AdaptableApi>(null);
  const vendorApiRef = useRef<GridApi>(null);
  return (
    <>
      <MainLayout>
        <AdaptableReact
          style={{ flex: 'none' }}
          gridOptions={gridOptions}
          modules={modules}
          adaptableOptions={adaptableOptions}
          onAdaptableReady={({ adaptableApi, vendorGrid }) => {
            console.log('ready!!!!', adaptableApi);
            adaptableApiRef.current = adaptableApi;
            vendorApiRef.current = vendorGrid.api;
            (globalThis as any).adaptableApi = adaptableApi;
          }}
        />

        <AgGridReact gridOptions={gridOptions} modules={modules} />
      </MainLayout>
    </>
  );
};

export default App;
