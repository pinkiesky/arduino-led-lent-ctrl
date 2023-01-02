import { ArduinoProcedure } from "./ArduinoProcedure";

interface IArduinoProcedureBrightnessData {
  bridgtness: number;
}

export class ArduinoProcedureBrightness extends ArduinoProcedure<IArduinoProcedureBrightnessData> {
  getCommand() {
    return 'b'.charCodeAt(0);
  }

  getDataBuffer(): Buffer {
    const b = Buffer.allocUnsafe(1);
    b.writeInt8(this.data.bridgtness);

    return b;
  }
}