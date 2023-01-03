import { ArduinoLed } from './ArduinoLed';
import { IArduinoLedSegment } from './types';

export class ArduinoLedSegment implements IArduinoLedSegment {
  constructor(
    public readonly first: number,
    public readonly size: number,
    private led: ArduinoLed,
  ) {
    if (size <= 0) {
      throw new Error('Size cannot be zero');
    }

    if (first + size > led.params.ledsCount) {
      throw new Error('Illegal size for segment');
    }
  }

  public get last(): number {
    return this.first + this.size - 1;
  }

  resetLeds() {
    this.fill(0);
  }

  setLed(index: number, value: number) {
    if (index < 0 || index >= this.size) {
      throw new Error(`Illegal index value: ${index}`);
    }

    this.led.setLed(this.first + index, value);
  }

  fill(value: number) {
    for (let i = 0; i < this.size; i++) {
      this.setLed(i, value);
    }
  }

  nextSegment(size: number): IArduinoLedSegment {
    return new ArduinoLedSegment(this.last + 1, size, this.led);
  }
}
