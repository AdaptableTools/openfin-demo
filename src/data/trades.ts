import {
  getMeaningfulDouble,
  generateRandomDateAndTime,
  getRandomItem,
  getMoodysRatings,
  getInstrumentId,
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
} from './utils';

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

const createTrade = (index: number) => {
  var price = getMeaningfulDouble();
  var tradeDate = generateRandomDateAndTime(-1000, 1000);
  var moodyRating = getRandomItem(getMoodysRatings());
  var instrumentId = getRandomItem(getInstrumentId());
  var trade = {
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
  return trade;
};
