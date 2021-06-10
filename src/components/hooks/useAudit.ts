import { AdaptableApi } from "@adaptabletools/adaptable/types";

import { MutableRefObject, useEffect } from "react";
import type { Price } from "../../data/prices";
import type { CellEditAudit } from "../types";
import { useChannelData } from "./useChannelData";

export const useAudit = (
  channelName: string,
  adaptableApiRef: MutableRefObject<AdaptableApi>
) => {
  const { current: adaptableApi } = adaptableApiRef;

  const { client } = useChannelData();
  useEffect(() => {
    if (!adaptableApi || !client) {
      return;
    }
    // const callback = (event: AdaptableStateChangedInfo) => {
    //   // if (event.actionName  === 'A')
    //   // return
    //   const data = (event.data[0].id as unknown) as CellEditAudit<Price>;
    //   data.client_timestamp = `${data.client_timestamp}`;

    //   console.log("audit:", data);
    //   client.dispatch(channelName, data);
    // };
    console.log("listening to cell edits");

    //adaptableApi.eventApi.on('AdaptableStateChanged',callback)
    const off = adaptableApi.eventApi.on("CellChanged", (info) => {
      const data: CellEditAudit<Price> = {
        audit_trigger: info.cellChange.trigger,
        username: "adaptable",
        client_timestamp: new Date(info.cellChange.changedAt).toDateString(),
        data_change_details: {
          column_id: info.cellChange.columnId,
          new_value: info.cellChange.newValue,
          previous_value: info.cellChange.oldValue,
          row_data: info.cellChange.rowData,
        },
      };

      console.log("cell changed", info);
      client.dispatch(channelName, data);
    });
    /*const off1 = adaptableApi.auditEventApi.on("AuditCellEdited", callback);
    const off2 = adaptableApi.auditEventApi.on("AuditStateChanged", callback);

    const off3 = adaptableApi.auditEventApi.on(
      "AuditTickingDataUpdated",
      callback
    );*/

    return () => {
      off();
    };
  }, [adaptableApi, client, channelName]);
};
