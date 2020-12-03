import { ColDef } from "@ag-grid-enterprise/all-modules";

export const positionColumns: ColDef[] = [
  {
    field: "instrumentId",
    initialWidth: 130,
    type: "abColDefString",
  },
  {
    field: "position",
    type: "abColDefNumber",
  },
  {
    field: "currentPrice",
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
