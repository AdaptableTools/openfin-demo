import {
  AdaptableApi,
  AuditLogEventArgs,
} from '@adaptabletools/adaptable/types';

import { MutableRefObject, useEffect } from 'react';
import type { Price } from '../../data/prices';
import type { CellEditAudit } from '../types';
import { useChannelData } from './useChannelData';


export const useAudit = (adaptableApiRef: MutableRefObject<AdaptableApi>) => {
  const { current: adaptableApi } = adaptableApiRef;

  const { client } = useChannelData()
  useEffect(() => {
    if (!adaptableApi || !client) {
      return;
    }
    const callback = (event: AuditLogEventArgs) => {
      const data = event.data[0].id as unknown as CellEditAudit<Price>
      data.client_timestamp = `${data.client_timestamp}`

      console.log('dispatch price audits', data)
      client.dispatch('priceaudits', data)

    }
    console.log('listening to cell edits')
    const off1 = adaptableApi.auditEventApi.on(
      'AuditCellEdited',
      callback
    );
    const off2 = adaptableApi.auditEventApi.on(
      'AuditStateChanged',
      callback
    );

    const off3 = adaptableApi.auditEventApi.on(
      'AuditTickingDataUpdated',
      callback
    );

    return () => {
      off1();
      off2();
      off3()
    };
  }, [adaptableApi, client]);
};
