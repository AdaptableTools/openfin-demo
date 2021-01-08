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
  generateRandomBool,
  getCusip,
} from "../utils";

type DataSourceParams = {
  size: number;
};

export const getDataSource = ({ size }: DataSourceParams) => {
  var trades = [];
  for (var i = 1; i <= size; i++) {
    var trade = createTrade();
    trades.push(trade);
  }
  return trades;
};

export type Trade = {
  tradeId: number;
  instrumentId: string;
  instrumentName: string;
  cusip: string;
  notional: number;
  counterparty: string;
  currency: string;
  buySell: "buy" | "sell";
  rating: string;
  status: "active" | "inactive";
  tradeDate: Date;
  settlementDate: Date;
  lastUpdated: Date;
  lastUpdatedBy: string;
};

let tradeIndex = 0;

export const createTrade = (overrides?: Partial<Trade>): Trade => {
  const tradeDate = generateRandomDateAndTime(1, 1000);
  const moodyRating = getRandomItem(getMoodysRatings());

  const sell = generateRandomBool();
  const status = generateRandomBool() ? "active" : "inactive";
  tradeIndex++;

  let instrumentId = getRandomItem(getInstrumentIds());

  if (overrides && overrides.instrumentId) {
    instrumentId = overrides.instrumentId;
  }
  return {
    tradeId: tradeIndex,
    instrumentId: instrumentId,
    instrumentName: getInstrumentName(instrumentId),
    cusip: getCusip(instrumentId),
    notional: getRandomItem(getNotionals()),
    buySell: sell ? "sell" : "buy",
    counterparty: getRandomItem(getCounterparties()),
    currency: getRandomItem(getCurrencies()),
    rating: moodyRating,
    tradeDate: tradeDate,
    status,
    settlementDate: addDays(tradeDate, 3),
    lastUpdated: generateRandomDateAndTime(-7, 0),
    lastUpdatedBy: getRandomItem(getNames()),
    ...overrides,
  };
};

export const createNewTrade = (index: number) => {
  return createTrade({
    tradeDate: generateRandomDateAndTime(1, 1000),
    status: "active",
  });
};
