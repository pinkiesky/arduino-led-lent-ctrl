export interface IArduinoLedSegment {
  resetLeds(): void;
  setLed(index: number, value: number): void;
  fill(value: number): void;
  nextSegment(size: number): IArduinoLedSegment;
}