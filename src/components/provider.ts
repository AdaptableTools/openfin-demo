import type { Price } from '../data/prices';
import type { Position } from '../data/position';
import { createTrade, Trade } from '../data/trades';
import { ColumnFilter } from '@adaptabletools/adaptable/types';

import { getDataSource as getPrices, tickPrice } from '../data/prices';
import { generateRandomInt, getInstrumentIds } from '../data/utils';
import { getPositions } from '../data/position';
import type { CellEditAudit } from './types';

let prices: Price[] = getPrices();
let trades: Trade[] = [];
let filteredInstrumentId: string = null;
let positions: Position[] = [];

let priceAudits: CellEditAudit<Price>[] = [];
let tradeAudits: CellEditAudit<Trade>[] = [];

const getPositionsArray = ({
  trades,
  prices,
}: {
  trades: Trade[];
  prices: Price[];
}) => {
  return getPositions(getInstrumentIds(), trades, prices);
};

let resolveProvider: any = () => {};
export const channelProvider = new Promise<any>((resolve) => {
  resolveProvider = resolve;
});

if (process.browser) {
  (window as any).onInstrumentIdChange = (instrumentId: string) => {
    console.log({ instrumentId });
  };
}
export async function makeProvider() {
  const channelName = 'AdapTable';
  const provider = await fin.InterApplicationBus.Channel.create(channelName);
  resolveProvider(provider);

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

  const publish = (channelName, data) => {
    try {
      console.log('publish', channelName);
      provider.publish(channelName, data);
    } catch (ex) {
      console.warn(ex);
    }
  };

  provider.register('data', () => getData());
  provider.register('set-filters', (newInstrumentId: string) => {
    filteredInstrumentId = newInstrumentId;

    publish('filters', filteredInstrumentId);
    console.log('instrumentid', filteredInstrumentId);
    return newInstrumentId;
  });

  const updatePositions = () => {
    const positionsArray = getPositionsArray({ trades, prices });

    const len = positionsArray.length;

    const changes: Position[] = [];
    for (let i = 0; i < len; i++) {
      let initial = positions[i];
      let current = positionsArray[i];
      if (JSON.stringify(initial) !== JSON.stringify(current)) {
        changes.push(current);
      }
    }
    positions = positionsArray;
    publish('positions', positionsArray);
    publish('tickpositions', changes);
  };

  const updateTrades = () => {
    updatePositions();
    publish('trades', trades);
  };
  const updatePrices = () => {
    updatePositions();
    publish('prices', prices);
  };

  const addTrade = (trade: Trade) => {
    trades = trades.concat(trade);
    publish('addtrade', trade);
    updateTrades();
  };

  provider.register('trades', updateTrades);
  provider.register('prices', updatePrices);
  provider.register('priceaudits', (priceAudit) => {
    if (!priceAudit) {
      return;
    }
    const trigger = priceAudit.audit_trigger;

    if (trigger !== 'TickingDataUpdate' && trigger !== 'CellEdit') {
      return;
    }

    priceAudits = priceAudits.concat(priceAudit);

    console.log('audits', priceAudits);
    publish('priceaudits', priceAudits);
    publish('addpriceaudit', priceAudit);
  });
  provider.register('tradeaudits', (tradeAudit) => {
    if (!tradeAudit) {
      return;
    }
    const trigger = tradeAudit.audit_trigger;

    if (trigger !== 'TickingDataUpdate' && trigger !== 'CellEdit') {
      return;
    }

    tradeAudits = tradeAudits.concat(tradeAudit);

    console.log('audits', tradeAudits);
    publish('tradeaudits', tradeAudits);
    publish('addtradeaudit', tradeAudit);
  });
  provider.register('positions', updatePositions);

  provider.register(
    'updatetrade',
    (info: { primaryKey: string; columnId: string; newValue: any }) => {
      const id = ((info.primaryKey as any) as number) * 1;

      const index = trades.findIndex((trade) => trade.tradeId == id);
      if (index != -1) {
        trades[index] = { ...trades[index], [info.columnId]: info.newValue };
      }

      updateTrades();
    }
  );

  provider.register(
    'updateprice',
    (info: { primaryKey: string; columnId: string; newValue: any }) => {
      const index = prices.findIndex(
        (price) => price.instrumentId == info.primaryKey
      );
      if (index != -1) {
        prices[index] = { ...prices[index], [info.columnId]: info.newValue };
      }

      updatePrices();
    }
  );

  publish('trades', trades);
  publish('prices', prices);
  updatePositions();

  setInterval(() => {
    addTrade(createTrade());
  }, 9000);
  addTrade(createTrade());

  setTimeout(() => {
    addTrade(createTrade());
  }, 1000);

  setInterval(() => {
    const priceIndex = generateRandomInt(0, prices.length - 1);
    const priceObject = tickPrice(prices[priceIndex]);

    prices[priceIndex] = priceObject;

    provider.publish('tickprice', priceObject);
  }, 2000);

  console.log('PROVIDER DONE');
}
