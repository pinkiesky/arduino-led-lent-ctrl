import { IArduinoProcedureInvoker } from '../invoker/IArduinoProcedureInvoker';
import { ArduinoProcedureApply } from '../procedures/ArduinoProcedureApply';
import { ArduinoProcedureBrightness } from '../procedures/ArduinoProcedureBrightness';
import { ArduinoProcedureReset } from '../procedures/ArduinoProcedureReset';
import { ArduinoProcedureSet } from '../procedures/ArduinoProcedureSet';

interface IState {
  leds: number[];
  bridgtness: number;
}

interface IParams {
  ledsCount: number;
}

export class ArduinoLed {
  private state: IState;
  private prevState: IState;

  constructor(
    private invoker: IArduinoProcedureInvoker,
    public readonly params: IParams,
  ) {
    this.state = {
      leds: new Array(params.ledsCount).fill(0),
      bridgtness: 0.5,
    };
    this.prevState = {
      leds: new Array(params.ledsCount).fill(-1),
      bridgtness: -1,
    };
  }

  async apply(): Promise<void> {
    let invokedAny = false;

    if (this.state.bridgtness !== this.prevState.bridgtness) {
      await this.invoker.invokeProcedure(
        new ArduinoProcedureBrightness({
          bridgtness: Math.floor(this.state.bridgtness * 255),
        }),
      );
      this.setForPrevState('bridgtness', this.state.bridgtness);
      invokedAny = true;
    }

    let indexOffset: number | null = null;
    for (let i = 0; i < this.state.leds.length + 1; i++) {
      const isLedChange = this.state.leds[i] !== this.prevState.leds[i];
      if (isLedChange) {
        if (indexOffset === null) {
          indexOffset = i;
        }
      } else {
        if (indexOffset !== null) {
          const procedures = ArduinoProcedureSet.buildFromLeds(indexOffset, [
            ...this.state.leds.slice(indexOffset, i),
          ]);
          for (const p of procedures) {
            await this.invoker.invokeProcedure(p);
          }

          invokedAny = true;
          indexOffset = null;
        }
      }
    }

    this.setForPrevState('leds', [...this.state.leds]);

    if (invokedAny) {
      await this.invoker.invokeProcedure(new ArduinoProcedureApply({}));
    }
  }

  reset() {
    this.state = {
      leds: new Array(this.state.leds.length).fill(0),
      bridgtness: 0.5,
    };
    this.prevState = {
      bridgtness: -1,
      leds: new Array(this.state.leds.length).fill(-1),
    };
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

  fill(value: number) {
    for (let i = 0; i < this.state.leds.length; i++) {
      this.setLed(i, value);
    }
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
