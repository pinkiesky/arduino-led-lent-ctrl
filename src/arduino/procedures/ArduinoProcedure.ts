import { UnimplementedError } from "../../errors/UnimplementedError";

export class ArduinoProcedure<D> {
  constructor(protected readonly data: D) {
  }

  getCommand(): number {
    throw new UnimplementedError();
  }

  getSubCommand(): number {
    return 0;
  }

  getDataBuffer(): Buffer {
    throw new UnimplementedError();
  }
}
