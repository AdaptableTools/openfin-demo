import * as React from 'react';

import '../../../node_modules/modern-normalize/modern-normalize.css';
import { TitleBar } from '../../components/chrome/TitleBar';

import './frame-style-template.css';
import './frame-style.css';
import './light-theme.css';

// Layout.init must be called in the custom window to initialize the Layout and 
// load the views.  Call init on DOMContentLoaded or after the window is setup 
// and the target div element has been created

const init = () => {
  typeof fin !== 'undefined' ? fin.Platform.Layout.init({ containerId: 'customWindow' }) : null
}

const CustomPlatformWindow: React.FC = () => {


  React.useEffect(() => {
    init()
  }, [])

  return (
    <>

      <div id="customWindow" style={{
        height: '100%',
        width: '100%',

      }}>
        <TitleBar />
      </div>

    </>
  );
};

export default CustomPlatformWindow;
