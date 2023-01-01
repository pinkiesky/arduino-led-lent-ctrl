import { IArduinoProcedureInvoker } from '../invoker/IArduinoProcedureInvoker';
import { ArduinoProcedureBrightness } from '../procedures/ArduinoProcedureBrightness';
import { ArduinoProcedureReset } from '../procedures/ArduinoProcedureReset';
import { ArduinoProcedureSet } from '../procedures/ArduinoProcedureSet';
import { IArduinoLedSegment } from './types';

interface IState {
  leds: number[];
  bridgtness: number;
}

interface IParams {
  ledsCount: number;
}

export class ArduinoLed {
  private state: IState;
  private prevState: IState | null = null;

  constructor(private invoker: IArduinoProcedureInvoker, params: IParams) {
    this.state = {
      leds: new Array(params.ledsCount).fill(0),
      bridgtness: 0.5,
    };
  }

  async apply(): Promise<void> {
    const applyPromieses = [];

    if (this.state.bridgtness !== this.prevState?.bridgtness) {
      applyPromieses.push(
        this.invoker.invokeProcedure(
          new ArduinoProcedureBrightness({
            bridgtness: Math.floor(this.state.bridgtness * 255),
          }),
        ),
      );
      this.setForPrevState('bridgtness', this.state.bridgtness);
    }

    let indexOffset: number | null = null;
    for (let i = 0; i < this.state.leds.length + 1; i++) {
      const isLedChange = this.state.leds[i] !== this.prevState?.leds[i];
      if (isLedChange) {
        if (indexOffset === null) {
          indexOffset = i;
        }
      } else {
        if (indexOffset !== null) {
          const cmd = new ArduinoProcedureSet({
            leds: [...this.state.leds.slice(indexOffset, i)],
            offset: indexOffset,
          });
  
          applyPromieses.push(this.invoker.invokeProcedure(cmd));
          indexOffset = null;
        }
      }
    }

    this.setForPrevState('leds', [...this.state.leds]);

    await Promise.all(applyPromieses);
  }

  reset() {
    this.state = {
      leds: new Array(this.state.leds.length).fill(0),
      bridgtness: 0.5,
    };
    this.prevState = null;
  }

  async hardwareReset() {
    return this.invoker.invokeProcedure(new ArduinoProcedureReset({}));
  }

  setLed(index: number, value: number) {
    if (index < 0 || index >= this.state.leds.length) {
      throw new Error(`Illegal index value: ${index}`);
    }

    if (value < 0 || value > 0xffffff) {
      throw new Error(`Illegal color value: ${value}`);
    }

    this.state.leds[index] = value;
  }

  setBridgtness(value: number) {
    if (value < 0 || value > 1) {
      throw new Error(`Illegal bridgtness value: ${value}`);
    }

    this.state.bridgtness = value;
  }

  private setForPrevState(key: keyof IState, value: unknown) {
    if (!this.prevState) {
      this.prevState = {
        bridgtness: 0,
        leds: [],
      };
    }

    this.prevState[key] = value as any;
  }
}
