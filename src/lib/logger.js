'use strict';

const os = require('os');
const path = require('path');

const Log = require('./log');
const Notifier = require('./notifier');
const Severity = require('./severity');
const Formatter = require('./formatter');
const { isFunction } = require('./util');


class Logger {
  constructor(options) {
    this.options = {
      ...Logger.DefaultOptions,
      ...options
    };

    this._profiles = {};
    let notifiers = options.notifiers;
    if (!notifiers || notifiers.length === 0) {
      notifiers = [Notifier.get('default')];
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
    return new Logger({ ...this.options, ...options });
  }

  fork(options = {}) {
    return this.clone(options);
  }

  // Options
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
    this.options.level = Severity.get(level) || Severity.DEBUG;

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

  lineNumbers(show) {
    this._notifiers.forEach(notif =>
      notif.lineNumbers(show));

    return this;
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
    return this.options.level.canLog(severity);
  }

  log(message, data = null, options = {}) {
    const opts = {
      level: options.level || this.options.level,
      channel: options.channel || this.options.channel,
      user: options.user || this.options.user,
      time: options.time || Date.now(),
      data,
      message,
    };

    if (this.options.enabled) {
      let log = message;
      if (!(message instanceof Log)) {
        log = Log.fromObject(opts);
      }

      return this._notifiers
        .forEach(notifier => {
          if (notifier.canOutput(log) && notifier.options.enabled) {

            if (isFunction(this.options.preNotify)) {
              this.options.preNotify(log, notifier);
            }

            if (
              isFunction(this.options.ignore) &&
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

  static search(value) {
    for (let key in Logger._loggers) {
      let logger = Logger._loggers[key];
      if ((key).toLowerCase() === String(value).toLowerCase()) {
        return logger;
      }
    }

    return Notifier.File;
  }

  static get(opts = 'default', args = {}) {
    let notifier;
    if (typeof opts === 'string' && (notifier = Notifier.get(opts, args))) {
      args.notifiers = [notifier];
      return new Logger(args);
    } else if (typeof opts === 'object') {
      return new Logger(opts);
    } else {
      throw new Error('Bad arguments for .logger, (' + opts + ')');
    }
  }

  static merge(loggers, opts = {
    mergeOptions: true,
    mergeNotifiers: true
  }) {
    let notifiers = [];
    let options = {};
    for (let logger of loggers) {
      if (!(logger instanceof Logger)) {
        throw new Error('loggers must be an array of loggers');
      } else {
        if (opts.mergeOptions === true) {
          options = Object.assign(options, logger.options);
        }

        if (opts.mergeNotifiers === true) {
          notifiers.push(...logger._notifiers);
        }
      }
    }

    let logger = new Logger(options);
    logger.setNotifiers(notifiers);

    return logger;
  }

  static register(name, notifierName) {
    if (typeof name !== 'string') {
      throw new Error('"name" must be a string got: ' + typeof name);
    }
    if (typeof notifierName !== 'string') {
      throw new Error('"notifierName" must be a string got: ' + typeof notifierName);
    }

    Logger[name] = Logger._loggers[name] = notifierName;

    return Logger;
  }
}

Logger._loggers = {};
Logger.DefaultOptions = {
  user: os.userInfo ? os.userInfo().username : 'browser',
  ignore: null,
  preNotify: null,
  level: Severity.DEBUG,
  channel: path.basename(__filename),
  formatter: Formatter.get('detailed'),
  enabled: true,
  color: false,
};

module.exports = Logger;