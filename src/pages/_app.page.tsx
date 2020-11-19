import App from 'next/app';

import { LicenseManager } from '@ag-grid-enterprise/core';
LicenseManager.setLicenseKey(process.env.NEXT_PUBLIC_AG_GRID_LICENSE);

export default App;
