import { ArduinoProcedure } from '../procedures/ArduinoProcedure';

export interface IArduinoProcedureInvoker {
  invokeProcedure<R>(proc: ArduinoProcedure<R>): Promise<void>;
}
