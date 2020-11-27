import { ColumnFilter } from '@adaptabletools/adaptable/types';
import { useEffect, useLayoutEffect, useState } from 'react';
import type { Price } from '../../data/prices';
import type { Trade } from '../../data/trades';

type DispatchChannelData = (what: string, arr?: any) => void;

type TypeRegister = (name: string, callback: (data: any) => void) => void;

export type ChannelClient = {
  dispatch: DispatchChannelData;
  register: TypeRegister;
};

let theClient: ChannelClient = null;
const clientPromise = fin.InterApplicationBus.Channel.connect('AdapTable');

clientPromise.then((client) => {
  theClient = client;
});

const useChannelClient = (): ChannelClient | null => {
  const [client, setClient] = useState(null);

  useLayoutEffect(() => {
    if (!client) {
      clientPromise.then((c) => setClient(c));
    }
  }, [client]);

  return client;
};

export const useChannelData = (callbacks?: {
  data?: (data: { prices: Price[]; trades: Trade[] }) => void;
  filters?: (filters: ColumnFilter[]) => void;
  prices?: (prices: Price[]) => void;
  trades?: (trades: Trade[]) => void;
  positions?: (positions: Position[]) => void;
  addtrade?: (trade: Trade) => void;
  tickprice?: (price: Price) => void;
  tickpositions?: (positions: Position[]) => void;
  themechange?: (theme: string) => void;
}): {
  client: ChannelClient | null;
} => {
  const client = useChannelClient();

  useEffect(() => {
    if (!client) {
      return;
    }

    Object.keys(callbacks).forEach((name) => {
      const callback = callbacks[name];
      client.register(name, callback);
      client.dispatch(name);
    });
  }, [client]);

  return {
    client,
  };
};
