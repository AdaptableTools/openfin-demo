import * as React from 'react';

import AdaptableReact, {
  AdaptableApi,
  AdaptableOptions,
} from '@adaptabletools/adaptable-react-aggrid';

import { AdaptableToolPanelAgGridComponent } from '@adaptabletools/adaptable/src/AdaptableComponents';

import { AgGridReact } from '@ag-grid-community/react';

import {
  GridOptions,
  ColDef,
  GridReadyEvent,
  GridApi,
} from '@ag-grid-enterprise/all-modules';

import { columnTypes } from '../data/columnTypes';
import { positionColumns } from '../data/position/columns';
import MainLayout from '../components/MainLayout';
import { modules } from '../components/modules';
import { plugins } from '../components/plugins';
import { useChannelData } from '../components/hooks';
import { getPositions } from '../data/position';
import { getInstrumentIds } from '../data/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

// create ag-Grid Column Definitions
const columnDefs: ColDef[] = positionColumns;

const rowData = null;

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
  adaptableId: 'PositionView',
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
  const gridApiRef = useRef<GridApi>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const { dispatch } = useChannelData(
    useCallback((data) => {
      const positions = getPositions(
        getInstrumentIds(),
        data.trades,
        data.prices
      );

      setPositions(positions);
    }, [])
  );
  const dispatchRef = useRef<any>(null);
  dispatchRef.current = dispatch;
  useEffect(() => {
    setInterval(() => {
      if (dispatchRef.current) {
        console.log('refresh');
        dispatchRef.current('refresh');
      }
    }, 1000);
  }, []);

  useEffect(() => {
    const { current: gridApi } = gridApiRef;
    if (!gridApi) {
      return;
    }
    gridApi.setRowData(positions);
  }, [positions]);

  return (
    <MainLayout>
      <AdaptableReact
        style={{ flex: 'none' }}
        gridOptions={gridOptions}
        adaptableOptions={adaptableOptions}
        modules={modules}
        onAdaptableReady={({ adaptableApi, vendorGrid }) => {
          (globalThis as any).adaptableApi = adaptableApi;
        }}
      />

      <AgGridReact
        gridOptions={gridOptions}
        modules={modules}
        onGridReady={(event: GridReadyEvent) => {
          gridApiRef.current = event.api;
        }}
      />
    </MainLayout>
  );
};

export default App;
