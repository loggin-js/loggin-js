'use strict';

const Severity = require('./severity');
const Log = require('./log');
const { isFunction } = require('./util');

class Loggable {

    constructor(options) {
        this.options = options;
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
            level: Severity.DEBUG,
            ...opts
        });

        return this;
    }

    default(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.DEFAULT,
            ...opts
        });

        return this;
    }

    warning(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.WARNING,
            ...opts
        });

        return this;
    }

    alert(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.ALERT,
            ...opts
        });

        return this;
    }

    emergency(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.EMERGENCY,
            ...opts
        });

        return this;
    }

    critical(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.CRITICAL,
            ...opts
        });

        return this;
    }

    error(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.ERROR,
            ...opts
        });

        return this;
    }

    notice(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.NOTICE,
            ...opts
        });

        return this;
    }

    info(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.INFO,
            ...opts
        });

        return this;
    }

    silly(message, data, opts = {}) {
        this.log(message, data, {
            level: Severity.SILLY,
            ...opts
        });

        return this;
    }
}

module.exports = Loggable;