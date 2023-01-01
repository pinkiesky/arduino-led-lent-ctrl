import PQueue from 'p-queue';
import { ArduinoProcedure } from '../procedures/ArduinoProcedure';
import { IArduinoProcedureInvoker } from './IArduinoProcedureInvoker';
import { ArduinoProcedureResponse } from './types';

export class ArduinoProcedureCallQueue {
  private queue = new PQueue({ autoStart: true });

  constructor(private parentAPI: IArduinoProcedureInvoker) {}

  invokeProcedure<R>(
    proc: ArduinoProcedure<R>
  ): Promise<ArduinoProcedureResponse> {
    return this.queue.add(() => this.parentAPI.invokeProcedure(proc));
  }
}
