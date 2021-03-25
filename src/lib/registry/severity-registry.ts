import { Severity } from '../severity';
import { throwIf } from '../utils/type-checks';
import { EmptyRegistry } from './empty-registry';

export class SeverityRegistry extends EmptyRegistry<Severity> {
  add(name, instance) {
    throwIf.not.string(name, 'name');
    throwIf.not.instanceof(instance, Severity, 'instance', 'Severity');

    this.registry[name] = instance;
  }

  register(level, name) {
    throwIf.not.string(name, 'name');
    throwIf.not.number(level, 'level');

    const severity = new Severity(level, name);

    const nameUpper = name.toUpperCase();
    const nameLower = name.toLowerCase();

    this.registry[nameUpper] = severity;
    this.registry[nameLower] = severity;

    return this;
  }

  get(query) {
    if (query instanceof Severity) return query;
    return this.search(query);
  }

  search(query) {
    throwIf.not.in(query, this.registry, 'Severity', {
      additionalMessage: '| Make sure it has been registered using, Severity.registry',
    });
    return this.registry[query];
  }

  has(query) {
    return !!this.registry[query];
  }
}
