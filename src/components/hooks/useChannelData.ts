import { ColumnFilter } from '@adaptabletools/adaptable/types';
import { useChannelClient } from 'openfin-react-hooks';
import { useCallback, useEffect, useRef } from 'react';
import type { Price } from '../../data/prices';
import type { Trade } from '../../data/trades';

type DispatchChannelData = (
  what: 'set-trades' | 'set-prices' | 'refresh' | 'set-filters',
  arr: any
) => void;

export const useChannelData = (callbacks?: {
  data?: (data: { prices: Price[]; trades: Trade[] }) => void;
  filters?: (filters: ColumnFilter[]) => void;
}): {
  dispatch: DispatchChannelData;
} => {
  const { client } = useChannelClient('AdapTable');

  const dataToDispatchRef = useRef<any>(null);

  useEffect(() => {
    if (!client) {
      return;
    }

    const dataCallback = callbacks?.data;
    const filtersCallback = callbacks?.filters;
    if (dataCallback) {
      client.register('data', dataCallback);
    }
    if (filtersCallback) {
      client.register('filters', filtersCallback);
    }
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
