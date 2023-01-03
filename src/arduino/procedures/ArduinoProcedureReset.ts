import { ArduinoProcedure } from "./ArduinoProcedure";

export class ArduinoProcedureReset extends ArduinoProcedure<{}> {
  getCommand() {
    return 'r';
  }

  getDataBuffer(): string {
    return '';
  }
}
