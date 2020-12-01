import {
  AdaptableApi,
  GridDataChangedEventArgs,
} from "@adaptabletools/adaptable/types";
import { MutableRefObject, useEffect } from "react";
import { ChannelClient } from "./useChannelData";

export const useDispatchOnDataChanged = ({
  client,
  adaptableApiRef,
  dispatchChannelName,
}: {
  client: ChannelClient;
  adaptableApiRef: MutableRefObject<AdaptableApi>;
  dispatchChannelName: string;
}) => {
  useEffect(() => {
    const eventApi = adaptableApiRef.current?.eventApi;
    if (!eventApi || !client) {
      return;
    }
    const off = eventApi.on(
      "GridDataChanged",
      (event: GridDataChangedEventArgs) => {
        const {
          dataChangedInfo,
        } = eventApi.getGridDataChangedInfoFromEventArgs(event);

        client.dispatch(dispatchChannelName, {
          primaryKey: dataChangedInfo.PrimaryKeyValue,
          columnId: dataChangedInfo.ColumnId,
          newValue: dataChangedInfo.NewValue,
        });
      }
    );

    return () => {
      off();
    };
  }, [client]);
};
