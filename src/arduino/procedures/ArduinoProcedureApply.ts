import { ArduinoProcedure } from "./ArduinoProcedure";

export class ArduinoProcedureApply extends ArduinoProcedure<{}> {
  getCommand() {
    return 'a'.charCodeAt(0);
  }

  getDataBuffer(): Buffer {
    return Buffer.alloc(0);
  }
}
