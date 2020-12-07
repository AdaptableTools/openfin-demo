import { AdaptableFormat } from "@adaptabletools/adaptable/types";

export const DisplayFormat4Digits = {
  Formatter: "NumberFormatter" as "NumberFormatter",

  Options: {
    FractionDigits: 4,
  },
};

export const DisplayFormatInteger = {
  Formatter: "NumberFormatter" as "NumberFormatter",
  Options: {
    FractionDigits: 0,
  },
};

export const DateFormat: AdaptableFormat = {
  Formatter: "DateFormatter",
  Options: {
    Pattern: "dd-MM-yyyy",
  },
};
