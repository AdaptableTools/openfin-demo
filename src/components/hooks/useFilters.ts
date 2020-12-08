import {
  AdaptableApi,
  ColumnFilter,
  SearchChangedEventArgs,
} from '@adaptabletools/adaptable/types';

import { MutableRefObject, useCallback, useEffect } from 'react';
import { useChannelData } from './useChannelData';

const deleteExtraInfo = (filter) => {
  delete (filter as any).timestamp;
  return filter;
};

let lastFilterTimestamp = 0;

export const useFilters = (adaptableApiRef: MutableRefObject<AdaptableApi>) => {
  const { current: adaptableApi } = adaptableApiRef;
  useEffect(() => {
    if (!adaptableApi) {
      return;
    }
    fin.InterApplicationBus.subscribe(
      { uuid: '*' },
      'set-filters',
      (instrumentId: string) => {
        const instrumentIdColumn = adaptableApi.columnApi.getColumnFromId(
          'instrumentId'
        );
        if (!instrumentIdColumn) {
          return;
        }

        console.log('setting instrument id to', instrumentId)
        !instrumentId
          ? adaptableApi.filterApi.clearAllColumnFilter()
          : adaptableApi.filterApi.setColumnFilter([
            {
              ColumnId: 'instrumentId',
              Predicate: { PredicateId: 'Values', Inputs: [instrumentId] },
            },
          ]);
      }
    );
  }, [adaptableApi]);
};
