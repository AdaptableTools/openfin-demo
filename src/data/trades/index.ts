import {
  getMeaningfulDouble,
  generateRandomDateAndTime,
  getRandomItem,
  getMoodysRatings,
  getInstrumentIds,
  getInstrumentName,
  getNotionals,
  generateRandomInt,
  getCounterparties,
  getCurrencies,
  getCountries,
  getMeaningfulPositiveNegativeDouble,
  getRatingFromMoodyRating,
  addDays,
  getNames,
} from '../utils';

type DataSourceParams = {
  size: number;
};

export const getDataSource = ({ size }: DataSourceParams) => {
  var trades = [];
  for (var i = 1; i <= size; i++) {
    var trade = createTrade(i);
    trades.push(trade);
  }
  return trades;
};

export type Trade = {
  tradeId: number;
  instrumentId: string;
  instrumentName: string;
  notional: number;
  deskId: number;
  counterparty: string;
  currency: string;
  country: string;
  changeOnYear: number;
  price: number;
  moodysRating: string;
  fitchRating: string;
  sandpRating: string;
  tradeDate: Date;
  settlementDate: Date;
  lastUpdated: Date;
  lastUpdatedBy: string;
};

export const createTrade = (index: number): Trade => {
  const price = getMeaningfulDouble();
  const tradeDate = generateRandomDateAndTime(-1000, 1000);
  const moodyRating = getRandomItem(getMoodysRatings());
  const instrumentId = getRandomItem(getInstrumentIds());
  return {
    tradeId: index,
    instrumentId: instrumentId,
    instrumentName: getInstrumentName(instrumentId),
    notional: getRandomItem(getNotionals()),
    deskId: generateRandomInt(0, 250),
    counterparty: getRandomItem(getCounterparties()),
    currency: getRandomItem(getCurrencies()),
    country: getRandomItem(getCountries()),
    changeOnYear: getMeaningfulPositiveNegativeDouble(),
    price: price,
    moodysRating: moodyRating,
    fitchRating: getRatingFromMoodyRating(moodyRating),
    sandpRating: getRatingFromMoodyRating(moodyRating),
    tradeDate: tradeDate,
    settlementDate: addDays(tradeDate, 3),
    lastUpdated: generateRandomDateAndTime(-7, 0),
    lastUpdatedBy: getRandomItem(getNames()),
  };
};
