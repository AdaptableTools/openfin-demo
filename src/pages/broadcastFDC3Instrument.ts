import { InstrumentContext } from "@adaptabletools/adaptable/types";

export const broadcastFDC3Instrument = (instrument: InstrumentContext) => {
  //add skipFilter to skip filtering our own app
  instrument.skipFilter = true;
  fin.InterApplicationBus.publish("broadcast-instrument", instrument);
};
