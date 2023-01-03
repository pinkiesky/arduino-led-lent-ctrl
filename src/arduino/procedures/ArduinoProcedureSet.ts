import { ArduinoProcedure } from './ArduinoProcedure';
import { chunk } from 'lodash';

const MAX_LED_PER_PROCEDURE = 40;

interface IArduinoProcedureSetData {
  offset: number;
  leds: number[];
}

export class ArduinoProcedureSet extends ArduinoProcedure<IArduinoProcedureSetData> {
  getCommand() {
    return 's';
  }

  getDataBuffer(): string {
    const { leds, offset } = this.data;
    return `${offset}:${leds.join('')}`;
  }

  static buildFromLeds(
    offset: number,
    leds: number[],
    chunkSize = MAX_LED_PER_PROCEDURE,
  ): ArduinoProcedureSet[] {
    const chunks = chunk(leds, chunkSize);
    return chunks.map(
      (l, i) =>
        new ArduinoProcedureSet({ leds: l, offset: offset + i * chunkSize }),
    );
  }
}
