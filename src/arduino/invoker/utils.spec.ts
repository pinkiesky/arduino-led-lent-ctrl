import { ArduinoProcedureApply } from '../procedures/ArduinoProcedureApply';
import { ArduinoProcedureSet } from '../procedures/ArduinoProcedureSet';
import { ArduinoProcedureInvokerSerial } from './ArduinoProcedureInvokerSerial';
import { procedure2buffer } from './utils';

describe('utils', () => {
  describe('procedure2buffer', () => {
    it('should end with new line', () => {
      const { data } = procedure2buffer(new ArduinoProcedureApply({})).toJSON();
      expect(data[data.length - 1]).toEqual('\n'.charCodeAt(0));
    });

    it('should correct calculate xor', () => {
      const { data } = procedure2buffer(new ArduinoProcedureApply({})).toJSON();
      expect(data[data.length - 2]).toEqual(118);
    });

    it('should have correct length', () => {
      const { data } = procedure2buffer(new ArduinoProcedureApply({})).toJSON();
      expect(data).toHaveLength(5);
    });

    it('should start with command and subcommand', () => {
      const { data } = procedure2buffer(new ArduinoProcedureApply({})).toJSON();
      expect(data[0]).toEqual('a'.charCodeAt(0));
      expect(data[1]).toEqual('-'.charCodeAt(0));
    });
  });
});
