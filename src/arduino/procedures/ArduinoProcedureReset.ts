import { ArduinoProcedure } from "./ArduinoProcedure";

export class ArduinoProcedureReset extends ArduinoProcedure<{}> {
  static getCommand() {
    return 'r'.charCodeAt(0);
  }

  getDataBuffer(): Buffer {
    return Buffer.alloc(0);
  }
}
