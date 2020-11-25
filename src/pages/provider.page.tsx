import * as React from 'react';
import { makeProvider } from '../components/provider';

function init() {
  fin.Platform.init({
    overrideCallback: async (Provider) => {
      class Override extends Provider {}
      return new Override();
    },
  });

  makeProvider();
}

const App: React.FC = () => {
  const [initialized, setInitialized] = React.useState(false);
  React.useEffect(() => {
    if (initialized) {
      return;
    }
    setInitialized(true);
    init();
  }, [initialized]);
  return <div>provider</div>;
};

export default App;
