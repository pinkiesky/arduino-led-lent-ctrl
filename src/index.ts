import { SerialPort } from "serialport";
import { ArduinoProcedureInvokerSerial } from "./arduino/invoker/ArduinoProcedureInvokerSerial";
import { ArduinoLed } from "./arduino/led/ArduinoLed";
import { ArduinoLedSegment } from "./arduino/led/ArduinoLedSegment";
import { sleep } from "./utils/sleep";

async function main() {
  const serial = new SerialPort({
    path: '/dev/ttyUSB1',
    baudRate: 115200,
  });
  const as = new ArduinoProcedureInvokerSerial(serial);
  console.info('Open arduoino serial!');
  await sleep(2000);

  const led = new ArduinoLed(as, { ledsCount: 181 });
  const top = new ArduinoLedSegment(0, 5, led);

  await led.apply();

  for (let i = 0; i < 181; i++) {
    led.setLed(i, Math.floor(Math.random() * 0xff));
    await led.apply();

    await sleep(16);
  }


  serial.close();
}

main();