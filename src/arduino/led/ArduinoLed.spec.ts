import { ArduinoLed } from './ArduinoLed';

describe('ArduinoLed', () => {
  const invoker = { invokeProcedure: jest.fn() };

  beforeEach(() => {
    invoker.invokeProcedure.mockReset();
    invoker.invokeProcedure.mockResolvedValue({});
  });

  test('should set all values in first apply', async () => {
    const s = new ArduinoLed(invoker, { ledsCount: 10 });
    await s.apply();

    expect(invoker.invokeProcedure.mock.calls).toEqual([
      [{ data: { bridgtness: 127 } }],
      [{ data: { leds: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], offset: 0 } }],
    ]);
  });

  test('should do nothing, if values not changed', async () => {
    const s = new ArduinoLed(invoker, { ledsCount: 10 });
    await s.apply();
    invoker.invokeProcedure.mockReset();

    await s.apply();

    expect(invoker.invokeProcedure.mock.calls).toEqual([]);
  });

  test('should apply brightness, if changed', async () => {
    const s = new ArduinoLed(invoker, { ledsCount: 10 });
    await s.apply();
    invoker.invokeProcedure.mockReset();

    s.setBridgtness(0.1);
    await s.apply();

    expect(invoker.invokeProcedure.mock.calls).toEqual([
      [{ data: { bridgtness: 25 } }],
    ]);
  });

  test('should calc correct Set params (one led)', async () => {
    const s = new ArduinoLed(invoker, { ledsCount: 10 });
    await s.apply();
    invoker.invokeProcedure.mockReset();

    s.setLed(0, 0xffffff);
    await s.apply();

    expect(invoker.invokeProcedure.mock.calls).toEqual([
      [{ data: { leds: [16777215], offset: 0 } }],
    ]);
  });

  test('should calc correct Set params (led in end)', async () => {
    const s = new ArduinoLed(invoker, { ledsCount: 10 });
    await s.apply();
    invoker.invokeProcedure.mockReset();

    s.setLed(9, 0xffffff);
    await s.apply();

    expect(invoker.invokeProcedure.mock.calls).toEqual([
      [{ data: { leds: [16777215], offset: 9 } }],
    ]);
  });

  test('should calc correct Set params (start and end)', async () => {
    const s = new ArduinoLed(invoker, { ledsCount: 10 });
    await s.apply();
    invoker.invokeProcedure.mockReset();

    s.setLed(0, 0xffffff);
    s.setLed(1, 0xffffff);
    s.setLed(9, 0xffffff);
    await s.apply();

    expect(invoker.invokeProcedure.mock.calls).toEqual([
      [{ data: { leds: [16777215, 16777215], offset: 0 } }],
      [{ data: { leds: [16777215], offset: 9 } }],
    ]);
  });

  test('should calc correct Set params (seq)', async () => {
    const s = new ArduinoLed(invoker, { ledsCount: 10 });
    await s.apply();
    invoker.invokeProcedure.mockReset();

    s.setLed(1, 0xffffff);
    s.setLed(2, 0xffffff);
    s.setLed(3, 0xffffff);
    await s.apply();

    expect(invoker.invokeProcedure.mock.calls).toEqual([
      [{ data: { leds: [16777215, 16777215, 16777215], offset: 1 } }],
    ]);
  });
});
