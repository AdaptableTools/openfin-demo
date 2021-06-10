import { AdaptableReadyInfo } from "@adaptabletools/adaptable-react-aggrid";
import { useState } from "react";

type OnAdaptableReady = (info: AdaptableReadyInfo) => void;

export const useAdaptableReady = (callback: OnAdaptableReady) => {
  const [_, repaint] = useState(0);
  const onReady: OnAdaptableReady = (info) => {
    callback(info);
    repaint((x) => x + 1);
  };

  return onReady;
};
