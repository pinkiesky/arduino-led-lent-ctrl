import EventEmitter from "events";
import { DelimiterParser, SerialPort } from "serialport";
import { Readable } from "stream";

export interface ArduinoReadyMsg {
  type: 'r';
  ledNum: number;
}

export interface ArduinoLogMsg {
  type: 'l';
  log: string;
}

export interface ArduinoResponseMsg {
  type: 'l';
  id: number;
}

export class ArduinoInputHandler extends EventEmitter {
  private dataStream: DelimiterParser;

  constructor(serial: Readable) {
    super();

    this.dataStream = serial.pipe(new DelimiterParser({ delimiter: '\n' }));
    this.dataStream.on('data', (chunk: Buffer) =>{
      this.handleChunk(chunk.toString());
    });
  }

  handleChunk(chunk: string) {
    const [type, ...msgs] = chunk.split(':');

    this.emit('arduino_raw', { type, msgs });

    switch (type) {
      case 'r': {
        this.emit('arduino_ready', { type, ledNum: Number(msgs[0]) });
      } break;
      case 'l': {
        this.emit('arduino_log', { type, log: msgs.join('') });
      } break;
      case 're': {
        this.emit('arduino_response', { type, id: Number(msgs[0]) });
      } break;
      case 'e': {
        this.emit('arduino_error', { type, error: msgs.join('') });
      } break;
      default: {
        this.emit('arduino_unknown', { type, data: msgs.join('') });
      }
    }
  }
}