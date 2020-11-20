import * as React from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import type { Price } from '../data/prices';
import type { Trade } from '../data/trades';
import { ColumnFilter } from '@adaptabletools/adaptable/types';

const DynamicComponent = dynamic(() => import('./price'), { ssr: false });

async function makeProvider() {
  let x = 0;
  const channelName = 'AdapTable';
  const provider = await fin.InterApplicationBus.Channel.create(channelName);
  provider.onConnection((identity, payload) => {
    console.log('onConnection identity: ', JSON.stringify(identity));
    console.log('onConnection payload: ', JSON.stringify(payload));
  });
  provider.onDisconnection((identity) => {
    console.log('onDisconnection identity: ', JSON.stringify(identity));
  });

  let prices: Price[] = [];
  let trades: Trade[] = [];
  let filters: ColumnFilter[] = [];

  const getData = () => {
    return {
      prices,
      trades,
    };
  };

  provider.register('prices', () => prices);
  provider.register('trades', () => trades);
  provider.register('data', () => getData());
  provider.register('set-filters', (newFilters: ColumnFilter[]) => {
    filters = newFilters;

    provider.publish('filters', filters);
    return newFilters;
  });
  provider.register('set-prices', (newPrices: Price[]) => {
    prices = newPrices;

    provider.publish('data', getData());
    return newPrices;
  });
  provider.register('set-trades', (newTrades: Trade[]) => {
    trades = newTrades;

    // provider.publish('trades', newTrades);
    console.log('published trades, not doing data');
    provider.publish('data', getData());
    return newTrades;
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
