import { ArduinoProcedure } from "./ArduinoProcedure";

export class ArduinoProcedureApply extends ArduinoProcedure<{}> {
  getCommand() {
    return 'a';
  }

  getDataBuffer(): string {
    return '';
  }
}
