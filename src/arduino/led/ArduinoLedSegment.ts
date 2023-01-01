import { ArduinoLed } from "./ArduinoLed";
import { IArduinoLedSegment } from "./types";

export class ArduinoLedSegment implements IArduinoLedSegment {
  constructor(private start: number, private size: number, private led: ArduinoLed) {
  }

  resetLeds() {
    this.fill(0);
  }

  setLed(index: number, value: number) {
    if (index < 0 || index >= this.size) {
      throw new Error(`Illegal index value: ${index}`);
    }

    this.led.setLed(index + this.start, value);
  }

  fill(value: number) {
    for (let i = this.start; i < this.start + this.size; i++) {
      this.setLed(i, value);
    }
  }
}