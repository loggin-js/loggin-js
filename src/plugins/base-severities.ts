import { LogginJS } from '../lib';

export default function plugin({ severityRegistry, Logger, Severity }: LogginJS) {
  severityRegistry
    .register(0, 'EMERGENCY')
    .register(1, 'ALERT')
    .register(2, 'CRITICAL')
    .register(3, 'ERROR')
    .register(4, 'WARNING')
    .register(5, 'NOTICE')
    .register(6, 'INFO')
    .register(7, 'DEBUG')
    .register(7, 'DEFAULT')
    .register(8, 'SILLY');

  const logWithLevel = (level) =>
    function (message, data, opts = {}) {
      this.log(message, data, {
        level: Severity.registry.get(level),
        ...opts,
      });
      return this;
    };

  const addMethodToLogger = (name: string) =>
    Object.defineProperty(Logger.prototype, name.toLowerCase(), {
      value: logWithLevel(name.toUpperCase()),
      writable: false,
      enumerable: true,
    });

  addMethodToLogger('DEBUG');
  addMethodToLogger('DEFAULT');
  addMethodToLogger('WARNING');
  addMethodToLogger('ALERT');
  addMethodToLogger('EMERGENCY');
  addMethodToLogger('CRITICAL');
  addMethodToLogger('ERROR');
  addMethodToLogger('NOTICE');
  addMethodToLogger('INFO');
  addMethodToLogger('SILLY');
}
