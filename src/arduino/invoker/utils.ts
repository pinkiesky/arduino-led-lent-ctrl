import { ArduinoProcedure } from "../procedures/ArduinoProcedure";

export function procedure2buffer<R>(proc: ArduinoProcedure<R>): Buffer {
  const cmd = `${proc.getCommand()}${proc.getSubCommand()}:${proc.getDataBuffer()}`;
  const buff = Buffer.allocUnsafe(cmd.length + 1 + 1);
  let xor = 0;

  for (let i = 0; i < cmd.length; i++) {
    const ch = cmd.charCodeAt(i);
    buff.writeUInt8(ch, i);

    xor ^= ch;
  }

  buff.writeUInt8(xor, buff.length - 2);
  buff.writeUInt8('\n'.charCodeAt(0), buff.length - 1);

  return buff;
}