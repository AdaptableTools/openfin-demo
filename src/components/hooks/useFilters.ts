import { AdaptableApi } from "@adaptabletools/adaptable/types";

import { MutableRefObject, useCallback, useEffect } from "react";

export const useFilters = (adaptableApiRef: MutableRefObject<AdaptableApi>) => {
  const { current: adaptableApi } = adaptableApiRef;
  useEffect(() => {
    if (!adaptableApi) {
      return;
    }
    const onSetFilters = (instrumentId: string) => {
      const instrumentIdColumn = adaptableApi.columnApi.getColumnFromId(
        "instrumentId"
      );
      if (!instrumentIdColumn) {
        return;
      }

      console.log("setting instrument id to", instrumentId);

      adaptableApi.filterApi.clearColumnFilterByColumn("instrumentId");
      if (instrumentId) {
        adaptableApi.filterApi.setColumnFilter([
          {
            ColumnId: "instrumentId",
            Predicate: { PredicateId: "Values", Inputs: [instrumentId] },
          },
        ]);
      }
    };

    if (window?.location?.search === "?pack") {
      let view = fin.View.getCurrentSync();

      view
        .getCurrentWindow()
        .then((win) => {
          console.log("Got window: " + JSON.stringify(win.me));

          win.on("context-changed", (data) => {
            if (data?.context?.instrument?.id) {
              onSetFilters(data.context.instrument.id.ticker);
            }
          });
        })
        .catch((err) => console.log(err));

      const onViewTargetChanged = () => {
        let platform = fin.Platform.getCurrentSync();

        platform.getWindowContext().then((context) => {
          console.log("Current context: " + JSON.stringify(context));

          if (context?.instrument?.id) {
            onSetFilters(context.instrument.id.ticker);
          }
        });
      };

      view.addEventListener("target-changed", onViewTargetChanged);
    } else {
      fin.InterApplicationBus.subscribe(
        { uuid: "*" },
        "set-filters",
        onSetFilters
      );
    }
  }, [adaptableApi]);
};
