import { UnimplementedError } from "../../errors/UnimplementedError";

export class ArduinoProcedure<D> {
  constructor(protected readonly data: D) {
  }

  getCommand(): string {
    throw new UnimplementedError();
  }

  getSubCommand(): string {
    return '-';
  }

  getDataBuffer(): string {
    throw new UnimplementedError();
  }
}
