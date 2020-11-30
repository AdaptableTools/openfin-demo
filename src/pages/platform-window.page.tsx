import * as React from 'react';



// Layout.init must be called in the custom window to initialize the Layout and 
// load the views.  Call init on DOMContentLoaded or after the window is setup 
// and the target div element has been created

const init = () => {
  fin.Platform.Layout.init({ containerId: 'customWindow' });
}

const CustomPlatformWindow: React.FC = () => {

  React.useEffect(() => {
    init()
  }, [])

  return (
    <>
      <div id="customWindow" style={{
        height: 300,
        background: 'red'
      }}></div>
    </>
  );
};

export default CustomPlatformWindow;
