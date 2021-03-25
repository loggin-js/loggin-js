import { Logger, LoggerOptions } from '../logger';
import { throwIf } from '../utils/type-checks';
import { EmptyRegistry } from './empty-registry';
import { NotifierRegistry } from './notifier-registry';

export class LoggerRegistry extends EmptyRegistry<Logger, LoggerOptions> {
  private notifierRegistry: NotifierRegistry;

  constructor(notifierRegistry: NotifierRegistry) {
    super();
    this.notifierRegistry = notifierRegistry;
  }

  add(name, notifierName) {
    throwIf.not.string(name, 'name');
    throwIf.not.string(notifierName, 'notifierName');

    this.registry[name] = notifierName;

    return this;
  }

  register(name, notifierName) {
    throwIf.not.string(name, 'name');
    throwIf.not.string(notifierName, 'notifierName');

    const nameUpper = name.toUpperCase();
    const nameLower = name.toLowerCase();

    this.registry[nameUpper] = notifierName;
    this.registry[nameLower] = notifierName;

    return this;
  }

  get(opts, args: any = {}) {
    const badArgs = typeof opts !== 'string' && typeof opts !== 'object';

    if (badArgs) throw new Error('Bad arguments for .logger');
    if (typeof opts === 'object') return new Logger(opts);

    const notifierExists = this.notifierRegistry.has(opts);
    if (!notifierExists) throw new Error(`Notifier ${opts} not found`);

    const notifier = this.notifierRegistry.get(opts, args);
    args.notifiers = [notifier];
    return new Logger(args);
  }

  search(query) {
    throwIf.not.in(query, this.registry, 'Logger', {
      additionalMessage: '| Make sure it has been registered using, Logger.registry',
    });
    return this.registry[query];
  }

  has(query) {
    return !!this.registry[query];
  }
}
