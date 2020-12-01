export const tradeColumns = [
  {
    field: 'tradeId',
    initialWidth: 110,
    type: 'abColDefNumber',
  },
  {
    field: 'instrumentId',
    initialWidth: 150,
    type: 'abColDefString',
  },
  {
    field: 'instrumentName',
    initialWidth: 250,
    type: 'abColDefString',
  },
  {
    field: 'notional',
    initialWidth: 180,
    editable: true,
    type: 'abColDefNumber',
  },
  {
    field: 'counterparty',
    type: 'abColDefString',
  },
  {
    field: 'currency',
    initialWidth: 150,
    type: 'abColDefString',
  },
  {
    field: 'rating',
    type: 'abColDefString',
  },
  {
    field: 'tradeDate',
    type: 'abColDefDate',
  },
  {
    field: 'settlementDate',
    type: 'abColDefDate',
  },
  {
    field: 'status',
    type: 'abColDefString',
    editable: true,
  },
  {
    field: 'lastUpdated',
    type: 'abColDefDate',
  },
  {
    field: 'lastUpdatedBy',
    type: 'abColDefString',
  },
].map(c => {
  return { ...c, colId: c.field }
})
