import { SerialPort } from 'serialport';
import { DelimiterParser } from '@serialport/parser-delimiter';
import { ArduinoProcedure } from '../procedures/ArduinoProcedure';
import { IArduinoProcedureInvoker } from './IArduinoProcedureInvoker';

export class ArduinoProcedureInvokerSerial implements IArduinoProcedureInvoker {
  private dataStream: DelimiterParser;

  constructor(private serial: SerialPort) {
    this.dataStream = serial.pipe(new DelimiterParser({ delimiter: '\n' }));
    this.dataStream.on('data', (chunk: Buffer) =>
      console.info(`[!] Got data from arduino: ${chunk}`),
    );
  }

  

  waitForInvoke(): Promise<void> {
    return new Promise((res, rej) =>
      this.serial.drain((err) => (err ? rej(err) : res())),
    );
  }

  invokeProcedure<R>(proc: ArduinoProcedure<R>) {
    console.log('[*] Invoke proc', proc);

    const buffer = Buffer.allocUnsafe(2);
    buffer.writeInt8(proc.getCommand(), 0);
    buffer.writeInt8(proc.getSubCommand(), 1);

    this.send(buffer);
    this.send(proc.getDataBuffer());
  }

  send(data: unknown) {
    this.serial.write(data);
    console.info('[*] Send data to buffer', data);
  }
}
