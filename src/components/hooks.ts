import { useChannelClient } from 'openfin-react-hooks';
import { useCallback, useEffect, useRef } from 'react';
import type { Price } from '../data/prices';
import type { Trade } from '../data/trades';

type DispatchChannelData = (
  what: 'set-trades' | 'set-prices' | 'refresh',
  arr: Trade[] | Price[]
) => void;

export const useChannelData = (
  callback?: (data: { prices: Price[]; trades: Trade[] }) => void
): {
  dispatch: DispatchChannelData;
} => {
  const { client } = useChannelClient('AdapTable');

  const dataToDispatchRef = useRef<any>(null);

  useEffect(() => {
    if (!client) {
      return;
    }
    console.log('client defined', client, callback);
    if (callback) {
      client.register('data', (data) => {
        console.log('data coming back', data);
        try {
          callback(data);
        } catch (ex) {
          console.error(ex);
        }
      });
    }
    client.dispatch('refresh');
  }, [client]);

  useEffect(() => {
    if (client && dataToDispatchRef.current) {
      const [what, data] = dataToDispatchRef.current;
      client.dispatch(what, data);
      dataToDispatchRef.current = null;
    }
  }, [client]);

  const dispatch: DispatchChannelData = useCallback((what, data) => {
    if (client) {
      client.dispatch(what, data);
    } else {
      dataToDispatchRef.current = [what, data];
    }
  }, []);

  return {
    dispatch,
  };
};
