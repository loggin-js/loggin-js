'use strict';

const Severity = require('./severity');
const Notifier = require('./notifier');
const Log = require('./log');
const { isFunction } = require('./util');

class Loggable {
    constructor(options) {
        this.options = options;
        let notifiers = options.notifiers;
        if (!notifiers || notifiers.length === 0) {
            notifiers = [Notifier.registry.get('default')];
        }

        // .setNotifiers must be done before setting other options
        // as some of them propagate down options to the notifiers
        this.setNotifiers(notifiers);
    }

    // Notifier stuff
    notifier(...notifiers) {
        this._notifiers = [
            ...this._notifiers,
            ...notifiers
        ];
        return this;
    }

    setNotifiers(notifiers) {
        this._notifiers = notifiers;
        return this;
    }

    hasNotifier(name) {
        return this._notifiers.some(notif =>
            notif.name === name);
    }

    getNotifier(name) {
        if (this.hasNotifier(name)) {
            return this._notifiers.filter(notif =>
                notif.name === name).pop();
        }

        return null;
    }

    // Log methods
    log(message, data, options = {}) {
        const opts = {
            level: options.level || this.options.level,
            channel: options.channel || this.options.channel,
            user: options.user || this.options.user,
            time: options.time || Date.now(),
            data,
            message,
        };

        if (!this.options.enabled) return;

        let log = message;
        if (!(message instanceof Log)) {
            log = Log.fromObject(opts);
        }

        this._notifiers
            .forEach(notifier => {
                if (!notifier.canOutput(log) || !notifier.options.enabled) {
                    return;
                }

                if (isFunction(this.options.preNotify)) {
                    this.options.preNotify(log, notifier);
                }

                if (
                    isFunction(this.options.ignore) &&
                    this.options.ignore(log, notifier)
                ) return;

                notifier.notify(log);
            });

        return this;
    }

    debug(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.registry.get('DEBUG'),
            ...opts
        });

        return this;
    }

    default(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.registry.get('DEFAULT'),
            ...opts
        });

        return this;
    }

    warning(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.registry.get('WARNING'),
            ...opts
        });

        return this;
    }

    alert(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.registry.get('ALERT'),
            ...opts
        });

        return this;
    }

    emergency(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.registry.get('EMERGENCY'),
            ...opts
        });

        return this;
    }

    critical(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.registry.get('CRITICAL'),
            ...opts
        });

        return this;
    }

    error(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.registry.get('ERROR'),
            ...opts
        });

        return this;
    }

    notice(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.registry.get('NOTICE'),
            ...opts
        });

        return this;
    }

    info(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.registry.get('INFO'),
            ...opts
        });

        return this;
    }

    silly(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.registry.get('SILLY'),
            ...opts
        });

        return this;
    }
}

module.exports = Loggable;