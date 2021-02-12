export const setInstrumentId = (instrumentId: string) => {
  fin.InterApplicationBus.publish("set-instrumentid", instrumentId);
};
