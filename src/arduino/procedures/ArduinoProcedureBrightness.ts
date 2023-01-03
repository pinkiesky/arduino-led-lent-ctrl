import { ArduinoProcedure } from "./ArduinoProcedure";

interface IArduinoProcedureBrightnessData {
  bridgtness: number;
}

export class ArduinoProcedureBrightness extends ArduinoProcedure<IArduinoProcedureBrightnessData> {
  getCommand() {
    return 'b';
  }

  getDataBuffer(): string {
    return this.data.bridgtness.toString();
  }
}