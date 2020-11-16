import * as React from 'react';
import Common from '../components/Common';

import AdaptableReact, {
  AdaptableOptions,
} from '@adaptabletools/adaptable-react-aggrid';

import { AdaptableToolPanelAgGridComponent } from '@adaptabletools/adaptable/src/AdaptableComponents';

import { AgGridReact } from '@ag-grid-community/react';

import {
  AllEnterpriseModules,
  GridOptions,
  ClientSideRowModelModule,
  ColDef,
} from '@ag-grid-enterprise/all-modules';

import { LicenseManager } from '@ag-grid-enterprise/core';
LicenseManager.setLicenseKey(process.env.NEXT_PUBLIC_AG_GRID_LICENSE);

import { getDataSource as getTrades } from '../data/trades';

// create ag-Grid Column Definitions
const columnDefs: ColDef[] = [
  {
    field: 'tradeId',
    editable: false,
    initialWidth: 110,
    type: 'abColDefNumber',
  },
  {
    field: 'instrumentId',
    initialWidth: 150,
    type: 'abColDefString',
  },
  {
    field: 'instrumentName',
    initialWidth: 250,
    type: 'abColDefString',
  },
  {
    field: 'notional',
    initialWidth: 180,
    type: 'abColDefNumber',
  },

  {
    field: 'deskId',
    initialWidth: 120,
    type: 'abColDefNumber',
  },

  {
    field: 'counterparty',
    type: 'abColDefString',
  },
  {
    field: 'currency',
    initialWidth: 150,
    type: 'abColDefString',
  },
  {
    field: 'country',
    initialWidth: 180,
    type: 'abColDefString',
  },
  {
    field: 'changeOnYear',
    type: 'abColDefNumber',
  },
  {
    field: 'price',
    type: 'abColDefNumber',
  },
  {
    field: 'moodysRating',
    type: 'abColDefString',
  },
  {
    field: 'fitchRating',
    type: 'abColDefString',
  },
  {
    field: 'sandpRating',
    type: 'abColDefString',
  },
  {
    field: 'tradeDate',
    type: 'abColDefDate',
  },
  {
    field: 'settlementDate',
    type: 'abColDefDate',
  },
  {
    field: 'lastUpdated',
    type: 'abColDefDate',
  },
  {
    field: 'lastUpdatedBy',
    type: 'abColDefString',
  },
];

const rowData = getTrades({ size: 1000 });

// let ag-grid know which columns and what data to use and add some other properties
const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: true,
  },
  rowData: rowData,
  components: {
    AdaptableToolPanel: AdaptableToolPanelAgGridComponent,
  },
  sideBar: true,
  suppressMenuHide: true,
  enableRangeSelection: true,
  onSelectionChanged: (...args) => {
    console.log('!!!!', args);
  },

  columnTypes: {
    // not required but helpful for column data type identification
    abColDefNumber: {},
    abColDefString: {},
    abColDefBoolean: {},
    abColDefDate: {},
    abColDefObject: {},
  },
};

// build the AdaptableOptions object
// in this example we are NOT passing in predefined config but in the real world you will ship the AdapTable with objects and permissions
const adaptableOptions: AdaptableOptions = {
  primaryKey: 'id',
  adaptableId: 'TradeView',
  adaptableStateKey: `${Date.now()}`,
  predefinedConfig: {},
  userInterfaceOptions: {
    showAdaptableToolPanel: true,
  },
};

const App: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column',
        height: '100vh',
        width: '100%',
        background: 'white',
      }}
    >
      <AdaptableReact
        style={{ flex: 'none' }}
        gridOptions={gridOptions}
        adaptableOptions={adaptableOptions}
        onAdaptableReady={({ adaptableApi }) => {
          console.log('ready!!!!');
          adaptableApi.eventApi.on('SelectionChanged', (args) => {
            console.warn(args);
          });
        }}
      />
      <div className="ag-theme-alpine" style={{ flex: 1 }}>
        <AgGridReact
          gridOptions={gridOptions}
          modules={[...AllEnterpriseModules, ClientSideRowModelModule]}
        />
      </div>
    </div>
  );
};

export default App;
