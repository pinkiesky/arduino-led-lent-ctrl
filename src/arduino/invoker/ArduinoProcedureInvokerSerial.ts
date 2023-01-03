import { SerialPort } from 'serialport';
import { ArduinoInputWaiter } from '../input/ArduinoInputWaiter';
import { ArduinoProcedure } from '../procedures/ArduinoProcedure';
import { IArduinoProcedureInvoker } from './IArduinoProcedureInvoker';
import { procedure2buffer } from './utils';


const SHORT_MAX_SIZE = 2**16;

export class ArduinoProcedureInvokerSerial implements IArduinoProcedureInvoker {
  private commandId = 0;
  private sendCount = 0;
  private start = 0;

  constructor(private serial: SerialPort) {
    this.start = Date.now();
    setInterval(() => {
      const secPass = (Date.now() - this.start) / 1000;
      console.log('speed info', (this.sendCount / secPass).toFixed(1), 'bytes/sec');
      this.sendCount = 0;
      this.start = Date.now();
    }, 1000);
  }

  async invokeProcedure<R>(proc: ArduinoProcedure<R>): Promise<void> {
    this.send(procedure2buffer(proc));
  }

  private send(data: Buffer) {
    if (!data.length) {
      return;
    }

    this.serial.write(data);
    this.sendCount += data.length;
    this.serial.drain();
  }

  private get nextId(): number {
    this.commandId = (this.commandId + 1) % SHORT_MAX_SIZE;
    return this.commandId;
  }
}
