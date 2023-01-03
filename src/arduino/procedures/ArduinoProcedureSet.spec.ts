import { ArduinoProcedureSet } from './ArduinoProcedureSet';

describe('ArduinoProcedureSet', () => {
  test('getDataBuffer', () => {
    const c = new ArduinoProcedureSet({ leds: [1, 5, 8], offset: 257 });
    expect(c.getDataBuffer()).toEqual('257:158');
  });

  test('buildFromLeds', () => {
    const ps = ArduinoProcedureSet.buildFromLeds(
      3,
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      2,
    );
    expect(ps.map((p) => p.getDataBuffer())).toEqual([
      '3:12',
      '5:34',
      '7:56',
      '9:78',
      '11:9',
    ]);
  });
});
