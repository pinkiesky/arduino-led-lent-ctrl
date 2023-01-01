import { ArduinoProcedureSet } from './ArduinoProcedureSet';

describe('ArduinoProcedureSet', () => {
  test('getDataBuffer', () => {
    const c = new ArduinoProcedureSet({ leds: [0x010203, 0xff00ff], offset: 257 });
    expect(c.getDataBuffer().toJSON().data).toEqual([
      1, 1, 0, 2, 1, 2, 3, 255, 0, 255,
    ]);
  });
});
