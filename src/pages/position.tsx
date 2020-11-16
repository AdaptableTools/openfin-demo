import * as React from 'react';
import Common from '../components/Common';

import { LicenseManager } from '@ag-grid-enterprise/core';
LicenseManager.setLicenseKey(process.env.NEXT_PUBLIC_AG_GRID_LICENSE);

const App: React.FC = () => {
  return (
    <div>
      OPENFIN DEMO position <Common name="position" />
    </div>
  );
};

export default App;
