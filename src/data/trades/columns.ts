export const tradeColumns = [
  {
    field: "tradeId",
    initialWidth: 110,
    type: "abColDefNumber",
  },
  {
    field: "instrumentId",
     headerName: "Instrument",
    initialWidth: 150,
    type: "abColDefString",
  },
  {
    field: "instrumentName",
     headerName: "Name",
    initialWidth: 250,
    type: "abColDefString",
  },
  {
    field: "notional",
    initialWidth: 180,
    editable: true,
    type: "abColDefNumber",
  },
  {
    field: "counterparty",
     headerName: "Cpty",
    enableRowGroup: true,
    type: "abColDefString",
  },
  {
    field: "currency",
     headerName: "Ccy",
    initialWidth: 150,
    type: "abColDefString",
  },
  {
    field: "rating",
    type: "abColDefString",
  },
  {
    field: "tradeDate",
    type: "abColDefDate",
  },
  {
    field: "settlementDate",
    type: "abColDefDate",
  },
  {
    field: "status",
    type: "abColDefString",
    editable: true,
  },
  {
    field: "lastUpdated",
     headerName: "Updated",
    type: "abColDefDate",
  },
  {
    field: "lastUpdatedBy",
     headerName: "Updated By",
    type: "abColDefString",
  },
].map((c) => {
  return { ...c, colId: c.field };
});
