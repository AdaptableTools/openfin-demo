import type { Price } from '../data/prices';
import { createTrade, Trade } from '../data/trades';
import { ColumnFilter } from '@adaptabletools/adaptable/types';

import { getDataSource as getPrices, tickPrice } from '../data/prices';

let prices: Price[] = getPrices();
let trades: Trade[] = [];
let filters: ColumnFilter[] = [];

export async function makeProvider() {
  const channelName = 'AdapTable';
  const provider = await fin.InterApplicationBus.Channel.create(channelName);

  provider.onConnection((identity, payload) => {
    console.log('onConnection identity: ', JSON.stringify(identity));
    console.log('onConnection payload: ', JSON.stringify(payload));
  });
  provider.onDisconnection((identity) => {
    console.log('onDisconnection identity: ', JSON.stringify(identity));
  });

  const getData = () => {
    return {
      prices,
      trades,
    };
  };

  provider.register('data', () => getData());
  provider.register('set-filters', (newFilters: ColumnFilter[]) => {
    filters = newFilters;

    provider.publish('filters', filters);
    return newFilters;
  });

  const updateTrades = () => {
    provider.publish('trades', trades);
  };
  const updatePrices = () => {
    provider.publish('prices', prices);
  };
  const addTrade = (trade: Trade) => {
    trades = trades.concat(trade);
    provider.publish('addtrade', trade);
    updateTrades();
  };

  provider.register('trades', updateTrades);
  provider.register('prices', updatePrices);
  //   provider.register('addtrade', addTrade);

  provider.register(
    'updatetrade',
    (info: { primaryKey: string; columnId: string; newValue: any }) => {
      const id = ((info.primaryKey as any) as number) * 1;

      const index = trades.findIndex((trade) => trade.tradeId == id);
      if (index != -1) {
        trades[index] = { ...trades[index], [info.columnId]: info.newValue };
        console.log(trades[index], '!!!');
      }

      updateTrades();
    }
  );

  provider.publish('trades', trades);
  provider.publish('prices', prices);

  setInterval(() => {
    addTrade(createTrade(trades.length));
  }, 7000);
}
