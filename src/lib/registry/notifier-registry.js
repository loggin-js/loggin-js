const Notifier = require('../notifier');
const { throwIf } = require('../utils/type-checks');
const { isConstructor } = require('../util');

const EmptyRegistry = require('./empty-registry');

class NotifiersRegistry extends EmptyRegistry {
    constructor() {
        super();
        this._notifiers = {};
    }

    add(name, instance) {
        this._notifiers[name] = instance;
    }

    register(name, ctor) {
        throwIf.not.string(name, 'name');
        throwIf.not.constructor(ctor, 'ctor');

        const nameUpper = name.toUpperCase();
        const nameLower = name.toLowerCase();

        this._notifiers[nameLower] = this._notifiers[nameUpper] = ctor;

        return this;
    }

    get(query, opts = {}) {
        if (query instanceof Notifier) return query;

        const Ctor = this.search(query);
        if (!isConstructor(Ctor)) {
            throw new Error(`Could not find Notifier with name (${query}) | If it's a custom made notifier, please register it before using it. I.e: Notifier.registry.register('name', Constructor)`);
        }

        return new Ctor(opts);
    }

    search(query) {
        throwIf.not.in(query, this._notifiers, 'Notifier', { additionalMessage: '| Make sure it has been registered using, Notifier.registry' });
        return this._notifiers[query];
    }

    has(query) {
        return !!this._notifiers[query];
    }
}

module.exports = NotifiersRegistry;