'use strict';

const Log = require('./log');
const Notifiers = require('./notifiers');
const Severity = require('./severity');
const Formatter = require('./formatters');
const os = require('os');
const path = require('path');

class Logger {
  constructor(options) {
    this.options = {
      ...Logger.DefaultOptions,
      ...options
    };

    this._profiles = {};
    let notifiers = options.notifiers;
    if (!notifiers || notifiers.length === 0) {
      notifiers = [Notifiers.get('default')];
    }

    this._level;
    this._user;
    this._channel;
    this._enabled;
    this._color;
    this._formatter;
    this._lineNumbers;

    // .setNotifiers must be done before setting other options
    // as some of them propagate down options to the notifiers
    this.setNotifiers(notifiers);

    this.level(this.options.level);
    this.user(this.options.user);
    this.channel(this.options.channel);
    this.enabled(this.options.enabled);
    this.color(this.options.color);
    this.formatter(this.options.formatter);
    this.lineNumbers(this.options.lineNumbers);
  }

  clone(options = {}) {
    let logger = new Logger({ ...this.options, ...options }, [...this._notifiers]);
    return logger;
  }

  fork(options = {}) {
    return this.clone(options);
  }

  enabled(enabled) {
    this.options.enabled = enabled;
    return this;
  }

  user(user) {
    this.options.user = user;
    return this;
  }

  channel(channel) {
    this.options.channel = channel;
    return this;
  }

  level(level) {
    if (typeof level === 'string') {
      this.options.level = Severity.fromString(level);
    } else if (typeof level === 'number') {
      this.options.level = Severity.fromInt(level);
    } else if (level && level.constructor.name === 'Severity') {
      this.options.level = level;
    } else {
      this.options.level = Severity.DEBUG;
    }

    this._notifiers.forEach(notif =>
      notif.level(this.options.level));

    return this;
  }

  formatter(formatter) {
    this.options.formatter = formatter;
    this._notifiers.forEach(notif =>
      notif.formatter(this.options.formatter));
    return this;
  }

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
    if (!this.hasNotifier(name)) {
      return null;
    } else {
      return this._notifiers.filter(notif =>
        notif.name === name).pop();
    }
  }

  color(color = true) {
    this.options.color = color;
    this._notifiers.forEach(notif =>
      notif.color(this.options.color));

    return this;
  }

  lineNumbers(show) {
    this.options.lineNumbers = show;
    this._notifiers.forEach(notif =>
      notif.lineNumbers(this.options.lineNumbers));

    return this;
  }

  canLog(severity) {
    return this.options.level.canLogSeverity(severity);
  }

  log(message, data = null, opts = {}) {
    const { level, channel, time, user } = {
      level: this.options.level,
      channel: this.options.channel,
      user: this.options.user,
      time: Date.now(),
      ...opts
    };

    if (this.options.enabled) {
      let log = message;
      if (!(message instanceof Log)) {
        log = new Log(message, data, level, channel, time, user);
      }

      return this._notifiers
        .forEach(notifier => {
          if (notifier.canOutput(level)) {
            if (this.options.preNotify && typeof this.options.preNotify === 'function') {
              this.options.preNotify(log, notifier);
            }
            if (
              this.options.ignore &&
              typeof this.options.ignore === 'function' &&
              this.options.ignore(log, notifier)
            ) return;

            notifier.notify(log);
          }
        });
    }

    return this;
  }


  debug(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.DEBUG,
      ...opts
    });

    return this;
  }

  warning(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.WARNING,
      ...opts
    });

    return this;
  }

  alert(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.ALERT,
      ...opts
    });

    return this;
  }

  emergency(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.EMERGENCY,
      ...opts
    });

    return this;
  }

  critical(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.CRITICAL,
      ...opts
    });

    return this;
  }

  error(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.ERROR,
      ...opts
    });

    return this;
  }

  notice(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.NOTICE,
      ...opts
    });

    return this;
  }

  info(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.INFO,
      ...opts
    });

    return this;
  }

  silly(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.SILLY,
      ...opts
    });

    return this;
  }
}

Logger.get = (opts = 'default', args = {}) => {
  if (
    typeof opts === 'string' && ['file', 'console', 'remote', 'memory', 'default'].includes(opts)
  ) {
    let notifier = new Notifiers.Console(args);
    switch (opts) {
      case 'file':
        notifier = new Notifiers.File(args);
        break;
      case 'console':
      case 'default':
        notifier = new Notifiers.Console(args);
        break;
      case 'remote':
        notifier = new Notifiers.Remote(args);
        break;
      case 'memory':
        notifier = new Notifiers.Memory(args);
        break;
    }

    args.notifiers = [notifier];
    return new Logger(args);
  } else if (typeof opts === 'object') {
    return new Logger(opts);
  } else {
    throw new Error('Bad arguments for .logger, (' + opts + ')');
  }
};

Logger.DefaultOptions = {
  user: os.userInfo().username,
  ignore: null,
  level: Severity.DEBUG,
  channel: path.basename(__filename),
  formatter: Formatter.get('detailed'),
  enabled: true,
  color: true,
};

module.exports = Logger;