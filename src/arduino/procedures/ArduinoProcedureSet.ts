import { ArduinoProcedure } from "./ArduinoProcedure";

interface IArduinoProcedureSetData {
  offset: number;
  leds: number[];
}

export class ArduinoProcedureSet extends ArduinoProcedure<IArduinoProcedureSetData> {
  static getCommand() {
    return 'r'.charCodeAt(0);
  }

  getDataBuffer(): Buffer {
    const { leds, offset } = this.data;

    const b = Buffer.allocUnsafe(2 + 2 + leds.length * 3);
    let bOffset = 0;

    b.writeInt16BE(offset, bOffset);
    bOffset += 2;
    b.writeInt16BE(leds.length, bOffset);
    bOffset += 2;

    for (let i = 0; i < leds.length; i++) {
      const v = leds[i];

      b.writeUInt8((v & 0xff0000) >> 16, bOffset);
      bOffset += 1;
      b.writeUInt8((v & 0x00ff00) >> 8, bOffset);
      bOffset += 1;
      b.writeUInt8(v & 0x0000ff, bOffset);
      bOffset += 1;
    }


    return b;
  }
}
