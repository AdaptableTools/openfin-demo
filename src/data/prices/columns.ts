import { ColDef } from "@ag-grid-enterprise/all-modules";

export const priceColumns: ColDef[] = [
  {
    field: "instrumentId",
    headerName: "Instrument",
    initialWidth: 130,
    type: ["abColDefString"],
  },
  {
    field: "price",
    type: "abColDefNumber",
  },
  {
    field: "bidOfferSpread",
    headerName: "B/O Spread",
    type: "abColDefNumber",
    editable: true,
  },
  {
    field: "closingPrice",
    type: "abColDefNumber",
  },
  {
    field: "bbgBid",
    type: "abColDefNumber",
  },
  {
    field: "bbgAsk",
    type: "abColDefNumber",
  },
];
