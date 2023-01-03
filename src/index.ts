import { SerialPort } from 'serialport';
import { ArduinoProcedureInvokerSerial } from './arduino/invoker/ArduinoProcedureInvokerSerial';
import { ArduinoLed } from './arduino/led/ArduinoLed';
import { ArduinoLedSegment } from './arduino/led/ArduinoLedSegment';
import { sleep } from './utils/sleep';
import ioHook from 'iohook';
import os from 'os';
import Queue from 'p-queue';
import { ArduinoInputHandler } from './arduino/input/ArduinoInputHandler';
import { ArduinoInputWaiter } from './arduino/input/ArduinoInputWaiter';
import { ArduinoConfig } from './arduino/input/ArduinoConfig';

const SCREEN_MAX = {
  x: 2559,
  y: 1079,
};

const positionSetQ = new Queue({
  concurrency: 1,
});

async function main() {
  const serial = new SerialPort({
    path: '/dev/ttyUSB0',
    baudRate: 115200,
    autoOpen: false,
  });

  const arduinoHandler = new ArduinoInputHandler(serial);
  const config = new ArduinoConfig(arduinoHandler);
  const arduinoWaiter = new ArduinoInputWaiter(arduinoHandler);
  const as = new ArduinoProcedureInvokerSerial(serial);

  arduinoHandler.on('arduino_raw', (msg) => {
    console.info('[!] got msg', msg);
  });

  serial.open();

  await arduinoWaiter.waitForReady();
  console.log('Arduino ready', config);

  const led = new ArduinoLed(as, { ledsCount: config.ledNum });
  const top = new ArduinoLedSegment(0, 55, led);
  const left = top.nextSegment(34);
  const bottom = left.nextSegment(58);
  const right = bottom.nextSegment(34);

  led.setBridgtness(0.3);
  led.fill(1);

  let offset = 0;
  setInterval(async () => {
    led.fill(offset % 2 === 0 ? 6 : 0);
    // led.setBridgtness((offset % 101) / 100);

    await led.apply();
    offset++;
  }, 50);

  // await sleep(2000);
  // serial.close();
}

let timesBefore = os.cpus().map(c => c.times);
// Call this function periodically e.g. using setInterval, 
function getAverageUsage() {
  let timesAfter = os.cpus().map(c => c.times);
  let timeDeltas = timesAfter.map((t, i) => ({
      user: t.user - timesBefore[i].user,
      sys: t.sys - timesBefore[i].sys,
      idle: t.idle - timesBefore[i].idle
  }));

  timesBefore = timesAfter;

  return timeDeltas
      .map(times => 1 - times.idle / (times.user + times.sys + times.idle))
      .reduce((l1, l2) => l1 + l2) / timeDeltas.length;
}

main();
