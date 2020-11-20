import { getRandomItem, getCurrencies, groupByAndSum } from '../utils';

import type { Trade } from '../trades';
import type { Price } from '../prices';

export type Position = {
  instrumentId: string;
  position: number;

  currentPrice: number;
  closingPrice: number;
  pnl: number;
};
export const getPositions = (
  instruments: string[],
  trades: Trade[],
  prices: Price[]
) => {
  const positionSum = groupByAndSum(
    trades,
    'instrumentId',
    'notional',
    (t: Trade) => t.status === 'active'
  );
  const positions = [];

  for (let instrument of instruments) {
    let priceObj: Price = prices.find((y) => y.instrumentId === instrument);
    if (priceObj) {
      const position = positionSum[instrument] || 0;
      positions.push({
        instrumentId: instrument,
        position,
        currentPrice: priceObj.price,
        closingPrice: priceObj.closingPrice,
        pnl: (priceObj.price - priceObj.closingPrice) * position,
      });
    }
  }
  return positions;
};
