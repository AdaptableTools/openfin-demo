import { ColumnFilter } from '@adaptabletools/adaptable/types';
import { useChannelClient } from 'openfin-react-hooks';
import { useCallback, useEffect, useRef } from 'react';
import type { Price } from '../../data/prices';
import type { Trade } from '../../data/trades';

type DispatchChannelData = (what: string, arr?: any) => void;

export const useChannelData = (callbacks?: {
  data?: (data: { prices: Price[]; trades: Trade[] }) => void;
  filters?: (filters: ColumnFilter[]) => void;
  prices?: (prices: Price[]) => void;
  trades?: (trades: Trade[]) => void;
  addtrade?: (trade: Trade) => void;
}): {
  dispatch: DispatchChannelData;
} => {
  const { client } = useChannelClient('AdapTable');

  const dataToDispatchRef = useRef<any>(null);

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

  useEffect(() => {
    if (client && dataToDispatchRef.current) {
      const [what, data] = dataToDispatchRef.current;
      client.dispatch(what, data);
      dataToDispatchRef.current = null;
    }
  }, [client]);

  const dispatch: DispatchChannelData = useCallback(
    (what, data) => {
      if (client) {
        client.dispatch(what, data);
      } else {
        dataToDispatchRef.current = [what, data];
      }
    },
    [client]
  );

  return {
    dispatch,
  };
};
