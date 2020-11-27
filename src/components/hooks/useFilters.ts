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
  const { client } = useChannelData({
    filters: useCallback(
      (columnFilters: ColumnFilter[]) => {
        const firstFilter = columnFilters[0] ? { ...columnFilters[0] } : null;

        const timestamp = firstFilter
          ? (firstFilter as any).filterTimestamp * 1
          : 0;

        if (firstFilter && timestamp <= lastFilterTimestamp) {
          return;
        }
        columnFilters.forEach(deleteExtraInfo);
        const currentFilters = adaptableApi.filterApi
          .getAllColumnFilter()
          .map(deleteExtraInfo);

        columnFilters = columnFilters.filter((filter) => {
          return adaptableApi.columnApi.getColumnFromId(filter.ColumnId);
        });

        if (JSON.stringify(columnFilters) === JSON.stringify(currentFilters)) {
          // console.log('same filters, so skip');
          return;
        }

        columnFilters.forEach((filter) => {
          (filter as any).timestamp = timestamp;
        });
        !columnFilters.length
          ? adaptableApi.filterApi.clearAllColumnFilter()
          : adaptableApi.filterApi.setColumnFilter(columnFilters);
      },
      [adaptableApi]
    ),
  });

  useEffect(() => {
    if (!adaptableApi || !client) {
      return;
    }
    const off = adaptableApi.eventApi.on(
      'SearchChanged',
      (event: SearchChangedEventArgs) => {
        const searchInfo = adaptableApi.eventApi.getSearchChangedInfoFromEventArgs(
          event
        );

        if (searchInfo.searchChangedTrigger === 'Filter') {
          const firstFilter = searchInfo.adaptableSearchState.columnFilters[0];
          const firstFilterTimestamp = firstFilter
            ? ((firstFilter as any).timestamp as number)
            : 0;

          if (firstFilter && firstFilterTimestamp > lastFilterTimestamp) {
            lastFilterTimestamp = Date.now();
            return;
          }

          const columnFilters = searchInfo.adaptableSearchState.columnFilters.map(
            (f) => {
              return { ...f };
            }
          );

          columnFilters.forEach((filter) => {
            (filter as any).timestamp = lastFilterTimestamp;
          });
          lastFilterTimestamp = Date.now();

          client.dispatch('set-filters', columnFilters);
        }
      }
    );

    return () => {
      off();
    };
  }, [adaptableApi, client]);
};
