import { AdaptableApi, CellChangedInfo } from "@adaptabletools/adaptable/types";
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
      "CellChanged",
      ({ cellChange: dataChangedInfo }: CellChangedInfo) => {
        client.dispatch(dispatchChannelName, {
          primaryKey: dataChangedInfo.primaryKeyValue,
          columnId: dataChangedInfo.columnId,
          newValue: dataChangedInfo.newValue,
        });
      }
    );

    return () => {
      off();
    };
  }, [client]);
};
