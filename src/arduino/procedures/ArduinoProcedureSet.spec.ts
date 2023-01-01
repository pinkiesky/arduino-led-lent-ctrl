import { ArduinoProcedureSet } from './ArduinoProcedureSet';

describe('ArduinoProcedureSet', () => {
  test('getDataBuffer', () => {
    const c = new ArduinoProcedureSet({ leds: [0x010203, 0xff00ff] });
    expect(c.getDataBuffer().toJSON().data).toEqual([
      2, 0, 1, 2, 3, 255, 0, 255,
    ]);
  });
});
