import {
  getMeaningfulDouble,
  getRandomItem,
  getInstrumentIds,
  roundTo4Dp,
  getBidOfferSpreads,
  generateRandomBool,
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
  closingPrice: number;
  changeOnDay: number;
  bloombergBid: number;
  bloombergAsk: number;
};

const createPrice = (instrument: string) => {
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
    closingPrice: closingPrice,
    changeOnDay: price - closingPrice,
    bloombergBid: roundTo4Dp(bid - 0.01),
    bloombergAsk: roundTo4Dp(ask + 0.01),
  };
};

export const tickPrice = (priceObj: Price) => {
  const numberToAdd = generateRandomBool() ? -0.5 : 0.5;

  priceObj.price += numberToAdd;
  priceObj.price = Math.max(priceObj.price, 0);
  return priceObj;
};
