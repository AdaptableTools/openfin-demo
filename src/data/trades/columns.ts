export const tradeColumns = [
  {
    field: 'tradeId',
    editable: false,
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
    type: 'abColDefNumber',
  },

  {
    field: 'deskId',
    initialWidth: 120,
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
    field: 'country',
    initialWidth: 180,
    type: 'abColDefString',
  },
  {
    field: 'changeOnYear',
    type: 'abColDefNumber',
  },
  {
    field: 'price',
    type: 'abColDefNumber',
  },
  {
    field: 'moodysRating',
    type: 'abColDefString',
  },
  {
    field: 'fitchRating',
    type: 'abColDefString',
  },
  {
    field: 'sandpRating',
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
    field: 'lastUpdated',
    type: 'abColDefDate',
  },
  {
    field: 'lastUpdatedBy',
    type: 'abColDefString',
  },
];
