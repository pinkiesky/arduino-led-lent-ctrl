import { ArduinoProcedureResponse } from './types';
import { ArduinoProcedure } from '../procedures/ArduinoProcedure';

export interface IArduinoProcedureInvoker {
  invokeProcedure<R>(
    proc: ArduinoProcedure<R>
  ): Promise<ArduinoProcedureResponse>;
}
