'use strict';

const Notifier = require('./notifier');
const Severity = require('./severity');
const Formatter = require('./formatter');
const Loggable = require('./loggable');
const { getOsUsername, getFileBasename } = require('./util');

const DefaultLoggerOptions = {
  user: getOsUsername(),
  channel: getFileBasename(),
  color: false,
  ignore: null,
  preNotify: null,
  level: Severity.DEBUG,
  formatter: Formatter.get('detailed'),
  enabled: true,
};

class Logger extends Loggable {
  constructor(options) {
    super({
      ...DefaultLoggerOptions,
      ...options
    });

    this._profiles = {};
    let notifiers = options.notifiers;
    if (!notifiers || notifiers.length === 0) {
      notifiers = [Notifier.get('default')];
    }

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
  channel(channel) {
    this.options.channel = channel;
    return this;
  }

  enabled(enabled) {
    this.options.enabled = enabled;
    return this;
  }

  user(user) {
    this.options.user = user;
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

  strict(strict = true) {
    if (this.options.level) {
      this.options.level.strict = strict;
    }

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
    if (this.hasNotifier(name)) {
      return this._notifiers.filter(notif =>
        notif.name === name).pop();
    }

    return null;
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
      }

      if (opts.mergeOptions === true) {
        options = Object.assign(options, logger.options);
      }

      if (opts.mergeNotifiers === true) {
        notifiers.push(...logger._notifiers);
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

module.exports = Logger;