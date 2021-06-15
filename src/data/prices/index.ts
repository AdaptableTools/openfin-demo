import {
  getMeaningfulDouble,
  getRandomItem,
  getInstrumentIds,
  roundTo4Dp,
  getBidOfferSpreads,
  generateRandomBool,
  generateRandomDouble,
  generateRandomInt,
  roundTo1Dp,
} from "../utils";

export const getDataSource = () => {
  return getInstrumentIds().map(createPrice);
};

export type Price = {
  instrumentId: string;
  price: number;
  bidOfferSpread: number;
  bid: number;
  ask: number;
  close: number;
  // changeOnDay: number;
  bbgBid: number;
  bbgAsk: number;
};

const createPrice = (instrument: string): Price => {
  var price = getMeaningfulDouble();
  var closingPrice = getMeaningfulDouble();
  var bidOfferSpread = getRandomItem(getBidOfferSpreads());
  var ask = roundTo4Dp(price + bidOfferSpread / 2);
  var bid = roundTo4Dp(price - bidOfferSpread / 2);
  return {
    instrumentId: instrument,
    price: price,
    bidOfferSpread,
    bid: bid,
    ask: ask,
    close: closingPrice,
    // changeOnDay: price - closingPrice,
    bbgBid: roundTo4Dp(bid - 0.01),
    bbgAsk: roundTo4Dp(ask + 0.01),
  };
};

export const tickPrice = (priceObj: Price) => {
  const num = roundTo1Dp(generateRandomInt(0, 100) / 100);
  const numberToAdd = generateRandomBool() ? -num : num;

  priceObj.price += numberToAdd;
  priceObj.price = Math.max(priceObj.price, 0);
  return priceObj;
};
