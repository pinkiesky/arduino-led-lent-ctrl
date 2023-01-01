import { SerialPort } from 'serialport';
import { DelimiterParser } from '@serialport/parser-delimiter';
import { ArduinoProcedure } from '../procedures/ArduinoProcedure';
import {
  ArduinoProcedureErrorCode,
  ArduinoProcedureResponse,
  responseError,
  responseOk,
} from './types';

export class ArduinoProcedureCallSerial {
  private currentProcedure: ArduinoProcedure<unknown> | null = null;
  private currentPromiseDef:
    | ((parsed: ArduinoProcedureResponse) => void)
    | null = null;

  private dataStream: DelimiterParser;

  constructor(private serial: SerialPort) {
    this.dataStream = serial.pipe(new DelimiterParser({ delimiter: [0] }));
    this.dataStream.on('data', (chunk: Buffer) => this.handleResponse(chunk));
  }

  invokeProcedure<R>(
    proc: ArduinoProcedure<R>
  ): Promise<ArduinoProcedureResponse> {
    if (this.currentProcedure !== null) {
      throw new Error('Procedure already wait...');
    }

    this.currentProcedure = proc;
    this.serial.write(this.currentProcedure.getDataBuffer());

    return new Promise((res) => {
      this.currentPromiseDef = res;
    });
  }

  handleResponse(chunk: Buffer) {
    const resp = this.parseResponse(chunk);
    this.currentPromiseDef?.call(null, resp);

    this.currentProcedure = null;
    this.currentPromiseDef = null;
  }

  parseResponse(chunk: Buffer): ArduinoProcedureResponse {
    const response = {
      command: chunk.readInt8(0),
      subcommand: chunk.readInt8(1),
    };
    const status = chunk.readInt8(2);

    if (!this.currentProcedure || !this.currentPromiseDef) {
      console.warn('No procedure');
      return responseError(response, ArduinoProcedureErrorCode.UNEXPECTED_DATA);
    }

    if (this.currentProcedure.getCommand() !== response.command) {
      return responseError(response, ArduinoProcedureErrorCode.WRONG_COMMAND);
    }

    if (this.currentProcedure.getSubCommand() !== response.subcommand) {
      return responseError(
        response,
        ArduinoProcedureErrorCode.WRONG_SUBCOMMAND
      );
    }

    if (status !== 0) {
      return responseError(response, status);
    }

    return responseOk(response);
  }
}
