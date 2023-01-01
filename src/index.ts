import { SerialPort } from "serialport";
import { ArduinoProcedureCall } from "./arduino/invoker/ArduinoProcedureCallSerial";
import { ArduinoProcedureReset } from "./arduino/procedures/ArduinoProcedureReset";

async function main() {
  const serial = new SerialPort({
    path: '/dev/null',
    baudRate: 9600,
  });
  const as = new ArduinoProcedureCall(serial);
}