import { withTimeout } from "../../utils/sleep";
import { ArduinoInputHandler, ArduinoReadyMsg, ArduinoResponseMsg } from "./ArduinoInputHandler";

export class ArduinoInputWaiter {
  private readyEmitted = false;

  constructor(private inputHandler: ArduinoInputHandler) {
    inputHandler.once('arduino_ready', () => {
      this.readyEmitted = true;
    });
  }

  async waitForReady(): Promise<void> {
    return new Promise<void>((res) => {
      if (this.readyEmitted) {
        res();
        return;
      }
  
      this.inputHandler.once('arduino_ready', () => {
        this.readyEmitted = true;
        res();
      });
    });
  }

  async waitForResponse(id: number) {
    const repsonsePromise = new Promise<void>((res) => {
      const listener = (msg: ArduinoResponseMsg) => {
        if (msg.id === id) {
          this.inputHandler.removeListener('arduino_response', listener);
          res();
        }
      };

      this.inputHandler.addListener('arduino_response', listener);
    });

    return withTimeout(repsonsePromise, 10000);
  }
}