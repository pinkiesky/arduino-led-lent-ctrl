export enum ArduinoProcedureStatus {
  OK = 'ok',
  ERROR = 'error',
}

export enum ArduinoProcedureErrorCode {
  NO_ERROR = 0,
  // from 1 to 255 is for arduino error codes
  UNEXPECTED_DATA = 256,
  WRONG_COMMAND = 257,
  WRONG_SUBCOMMAND = 258,
}

export interface ArduinoProcedureResponse {
  command: number;
  subcommand: number;
  status: ArduinoProcedureStatus;
  error: ArduinoProcedureErrorCode;
}

export function responseError(
  cmdData: Pick<ArduinoProcedureResponse, 'command' | 'subcommand'>,
  error: ArduinoProcedureErrorCode
): ArduinoProcedureResponse {
  return {
    ...cmdData,
    status: ArduinoProcedureStatus.ERROR,
    error,
  };
}

export function responseOk(
  cmdData: Pick<ArduinoProcedureResponse, 'command' | 'subcommand'>
): ArduinoProcedureResponse {
  return {
    ...cmdData,
    status: ArduinoProcedureStatus.OK,
    error: ArduinoProcedureErrorCode.NO_ERROR,
  };
}
