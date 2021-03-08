import { ColDef } from "@ag-grid-enterprise/all-modules";

export const positionColumns: ColDef[] = [
  {
    field: "instrumentId",
    headerName: "Instrument",
    initialWidth: 130,
    type: ["abColDefFDC3Instrument", "fdc3-type-CUSIP"],
  },
  {
    field: "position",
    type: "abColDefNumber",
  },
  {
    field: "currentPrice",
    headerName: "Price",
    type: "abColDefNumber",
  },
  {
    field: "closingPrice",
    type: "abColDefNumber",
  },
  {
    field: "pnl",
    headerName: "PnL",
    type: "abColDefNumber",
  },
];
