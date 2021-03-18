const Severity = require('../severity');
const EmptyRegistry = require('./empty-registry');
const { throwIf } = require('../utils/type-checks');

class SeverityRegistry extends EmptyRegistry {
    constructor() {
        super();
        this._severities = {};
    }

    add(name, instance) {
        this._severities[name] = instance;
    }

    register(level, name) {
        throwIf.not.string(name, 'name');
        throwIf.not.number(level, 'level');

        const severity = new Severity(level, name);

        const nameUpper = name.toUpperCase();
        const nameLower = name.toLowerCase();

        this._severities[nameUpper] = severity;
        this._severities[nameLower] = severity;

        return this;
    }

    get(query) {
        if (query instanceof Severity) return query;
        return this.search(query);
    }

    search(query) {
        throwIf.not.in(query, this._severities, 'Severity', { additionalMessage: '| Make sure it has been registered using, Severity.registry' });
        return this._severities[query];
    }

    has(query) {
        return !!this._severities[query];
    }
}

module.exports = SeverityRegistry;