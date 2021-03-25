import { Notifier, NotifierOptions } from '../notifier';
import { throwIf } from '../utils/type-checks';
import { EmptyRegistry } from './empty-registry';

export class NotifierRegistry extends EmptyRegistry<Notifier, NotifierOptions> {
  add(name, instance) {
    throwIf.not.string(name, 'name');
    throwIf.not.constructor(instance, 'instance');
    this.registry[name] = instance;
  }

  register(name, ctor) {
    throwIf.not.string(name, 'name');
    throwIf.not.constructor(ctor, 'ctor');

    const nameUpper = name.toUpperCase();
    const nameLower = name.toLowerCase();

    this.registry[nameLower] = this.registry[nameUpper] = ctor;

    return this;
  }

  get(query, opts = {}) {
    if (query instanceof Notifier) return query;

    const Ctor = this.search(query);
    return new Ctor(opts);
  }

  search(query) {
    throwIf.not.in(query, this.registry, 'Notifier', {
      additionalMessage: '| Make sure it has been registered using, Notifier.registry',
    });
    return this.registry[query];
  }

  has(query) {
    return !!this.registry[query];
  }
}
