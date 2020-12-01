import {
  AdaptableApi,
  AuditLogEventArgs,
} from '@adaptabletools/adaptable/types';

import { MutableRefObject, useEffect } from 'react';

export const useAudit = (adaptableApiRef: MutableRefObject<AdaptableApi>) => {
  const { current: adaptableApi } = adaptableApiRef;

  useEffect(() => {
    if (!adaptableApi) {
      return;
    }
    const callback = (event: AuditLogEventArgs) => {
      const data = event.data[0].id

      console.log({ data })
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
  }, [adaptableApi]);
};
