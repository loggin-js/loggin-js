import { Formatter } from '../formatter';
import { throwIf } from '../utils/type-checks';
import { EmptyRegistry } from './empty-registry';

export class FormatterRegistry extends EmptyRegistry<Formatter> {
  constructor() {
    super();
  }

  add(name, instance) {
    this.registry[name] = instance;
  }

  register(name, template, options = {}) {
    throwIf.not.string(name, 'name');

    const formatter = Formatter.create(template, options);

    const nameUpper = name.toUpperCase();
    const nameLower = name.toLowerCase();

    this.registry[nameLower] = this.registry[nameUpper] = formatter;

    return this;
  }

  get(query) {
    if (query instanceof Formatter) return query;
    throwIf.not.string(query, 'query');
    return this.search(query);
  }

  search(query) {
    throwIf.not.in(query, this.registry, 'Formatter', {
      additionalMessage: '| Make sure it has been registered using, Formatter.registry',
    });

    return this.registry[query];
  }

  has(query) {
    return !!this.registry[query];
  }
}
