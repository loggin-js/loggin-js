const Logger = require('../logger');
const Notifier = require('../notifier');
const EmptyRegistry = require('./empty-registry');
const { throwIf } = require('../utils/type-checks');

class LoggerRegistry extends EmptyRegistry {
    constructor() {
        super();
        this._loggers = {};
    }

    add(name, instance) {
        this._loggers[name] = instance;
    }

    register(name, notifierName) {
        throwIf.not.string(name, 'name');
        throwIf.not.string(notifierName, 'notifierName');


        const nameUpper = name.toUpperCase();
        const nameLower = name.toLowerCase();

        this._loggers[nameUpper] = notifierName;
        this._loggers[nameLower] = notifierName;

        return this;
    }

    get(opts = 'default', args = {}) {
        let notifier;
        if (typeof opts === 'string' && (notifier = Notifier.registry.get(opts, args))) {
            args.notifiers = [notifier];
            return new Logger(args);
        } else if (typeof opts === 'object') {
            return new Logger(opts);
        } else {
            throw new Error('Bad arguments for .logger, (' + opts + ')');
        }
    }

    search(query) {
        throwIf.not.in(query, this._loggers, 'Logger', { additionalMessage: '| Make sure it has been registered using, Logger.registry' });
        return this._loggers[query];
    }

    has(query) {
        return !!this._loggers[query];
    }
}

module.exports = LoggerRegistry;