import { ArduinoInputHandler, ArduinoReadyMsg } from "./ArduinoInputHandler";

export class ArduinoConfig {
  public initialized: boolean = false;
  public ledNum: number = 0;

  constructor(handler: ArduinoInputHandler) {
    handler.once('arduino_ready', (msg: ArduinoReadyMsg) => {
      this.initialized = true;
      this.ledNum = msg.ledNum;
    });
  }
}
