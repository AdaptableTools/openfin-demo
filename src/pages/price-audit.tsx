import * as React from 'react';

import AdaptableReact, {
  AdaptableApi,
  AdaptableColumn,
  AdaptableOptions,
} from '@adaptabletools/adaptable-react-aggrid';

import { AdaptableToolPanelAgGridComponent } from '@adaptabletools/adaptable/src/AdaptableComponents';

import { AgGridReact } from '@ag-grid-community/react';

import { GridOptions, ColDef } from '@ag-grid-enterprise/all-modules';

import { columnTypes } from '../data/columnTypes';
import MainLayout from '../components/MainLayout';

import { modules } from '../components/modules';

import { useChannelData } from '../components/hooks/useChannelData';
import { useRef } from 'react';

import { once } from '../components/once';
import { DisplayFormat4Digits } from '../data/displayFormat';
import { useFilters } from '../components/hooks/useFilters';
import { useDispatchOnDataChanged } from '../components/hooks/useDispatchOnDataChanged';
import { Price } from '../data/prices';
import { useThemeSync } from '../components/hooks/useThemeSync';
import Head from '../components/Head';
import { initAdaptableOptions } from '../components/initAdaptableOptions';

import { DataSource, GridFactory } from '@adaptabletools/grid'
// import type { AdaptableColumn } from '@adaptabletools/grid'


type Item = {
  id: string | number;
  timestamp: 'string'
}

const Grid = GridFactory<Item>();

const columns = [
  {
    field: 'id' as 'id', flex: 1
  },
  {
    field: 'timestamp' as 'timestamp', flex: 1
  }// as AdaptableColumn
]

const domProps = {
  style: { flex: 1 }
}
const App = () => {


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
      <Head title="Price Audit" />

      <DataSource<Item>

        primaryKey={"id"}
        fields={['id', 'timestamp']}
        data={[]}

      >
        <Grid domProps={domProps} columns={columns} showZebraRows rowHeight={30} />
      </DataSource>

    </div>
  );
};

export default App;
