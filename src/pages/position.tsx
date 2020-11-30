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

import { useChannelData } from '../components/hooks/useChannelData';
import { useRef } from 'react';
import {
  DisplayFormat4Digits,
  DisplayFormatInteger,
} from '../data/displayFormat';
import { useFilters } from '../components/hooks/useFilters';
import { once } from '../components/once';
import { useThemeSync } from '../components/hooks/useThemeSync';
import Head from '../components/Head';
import type { Position } from '../data/position';
import { initAdaptableOptions } from '../components/initAdaptableOptions';

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

const adaptableOptions: AdaptableOptions = initAdaptableOptions({
  primaryKey: 'instrumentId',
  adaptableId: 'PositionView',

  predefinedConfig: {
    FormatColumn: {
      Revision: 1,
      FormatColumns: [
        {
          Scope: {
            ColumnIds: ['pnl'],
          },
          DisplayFormat: DisplayFormatInteger,
        },
      ],
    },
    Dashboard: {
      IsCollapsed: true,
      Tabs: [{ Name: 'Position', Toolbars: ['SmartEdit', 'OpenFin'] }],
    },
    Alert: {
      AlertDefinitions: [
        // {
        // }
      ],
    },
  },
});

const App: React.FC = () => {
  const gridApiRef = useRef<GridApi>(null);
  const adaptableApiRef = useRef<AdaptableApi>(null);

  useChannelData({
    positions: once((positions) => {
      gridApiRef.current?.setRowData(positions);
    }),
    tickpositions: (positions: Position[]) => {
      console.log({ positions });
      adaptableApiRef.current?.gridApi.updateGridData(positions, {
        runAsync: true,
      });
    },
  });

  useFilters(adaptableApiRef);
  useThemeSync(adaptableApiRef);

  return (
    <>
      <Head title="Positions" />
      <MainLayout>
        <AdaptableReact
          style={{ flex: 'none' }}
          gridOptions={gridOptions}
          adaptableOptions={adaptableOptions}
          modules={modules}
          onAdaptableReady={({ adaptableApi }) => {
            adaptableApiRef.current = adaptableApi;
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
    </>
  );
};

export default App;
