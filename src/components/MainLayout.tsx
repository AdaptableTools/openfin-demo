import * as React from 'react';

export default ({ children }) => {
  children = React.Children.toArray(children);

  const adaptable = children[0];
  const aggrid = children[1];

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
      {adaptable}
      <div className="ag-theme-balham" style={{ flex: 1 }}>
        {aggrid}
      </div>
    </div>
  );
};
