import { getRandomItem, getCurrencies, groupByAndSum } from '../utils';

import type { Trade } from '../trades';
import type { Price } from '../prices';

export type Position = {
  instrumentId: string;
  position: number;
  currency: string;
  currentPrice: number;
  closingPrice: number;
  pnl: number;
};
export const getPositions = (
  instruments: string[],
  trades: Trade[],
  prices: Price[]
) => {
  const positionSum = groupByAndSum(trades, 'instrumentId', 'notional');
  const positions = [];

  for (let instrument of instruments) {
    let priceObj: Price = prices.find((y) => y.instrumentId === instrument);
    if (priceObj) {
      positions.push({
        instrumentId: instrument,
        position: positionSum[instrument] || 0,
        currency: getRandomItem(getCurrencies()),
        currentPrice: priceObj.price,
        closingPrice: priceObj.closingPrice,
        pnl:
          (priceObj.price - priceObj.closingPrice) * positionSum[instrument] ||
          0,
      });
    }
  }
  return positions;
};
