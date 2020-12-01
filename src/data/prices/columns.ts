import { ColDef } from "@ag-grid-enterprise/all-modules";

export const priceColumns: ColDef[] = [
  {
    field: "instrumentId",
    initialWidth: 130,
    type: "abColDefString",
  },
  {
    field: "price",
    type: "abColDefNumber",
  },
  {
    field: "bidOfferSpread",
    type: "abColDefNumber",
    // cellEditor: 'numericCellEditor',
    editable: true,
  },
  // {
  //   field: 'bid',
  //   type: 'abColDefNumber',
  // },
  // {
  //   field: 'ask',
  //   type: 'abColDefNumber',
  // },
  {
    field: "closingPrice",
    type: "abColDefNumber",
  },
  {
    field: "changeOnDay",
    type: "abColDefNumber",
  },
  {
    field: "bloombergBid",
    type: "abColDefNumber",
  },
  {
    field: "bloombergAsk",
    type: "abColDefNumber",
  },
];
