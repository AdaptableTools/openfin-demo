import * as React from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';

const DynamicComponent = dynamic(() => import('./price'), { ssr: false });

async function makeProvider() {
  let x = 0;
  const channelName = 'counter';
  const provider = await fin.InterApplicationBus.Channel.create(channelName);
  provider.onConnection((identity, payload) => {
    console.log('onConnection identity: ', JSON.stringify(identity));
    console.log('onConnection payload: ', JSON.stringify(payload));
  });
  provider.onDisconnection((identity) => {
    console.log('onDisconnection identity: ', JSON.stringify(identity));
  });
  provider.register('get', (payload, identity) => {
    console.log('Value of x', payload, ', requested from', identity);
    return x;
  });
  provider.register('set', (payload) => {
    x = payload;
    console.log('SETTING', payload);

    provider.publish('get', payload);
    return x;
  });
  provider.register('increment', () => ++x);
  provider.register('incrementBy', (payload) => (x += payload.amount));
  provider.register('throwError', () => {
    throw new Error('Error in channelProvider');
  });
}

const App: React.FC = () => {
  React.useEffect(() => {
    makeProvider();
  }, []);

  return (
    <>
      {!(globalThis as any).fin ? <Navbar /> : null}
      <DynamicComponent />
    </>
  );
};

export default App;
