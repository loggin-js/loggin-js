'use strict';

const Severity = require('./severity');
const Loggable = require('./loggable');
const { getOsUsername, getFileBasename } = require('./util');

class Logger extends Loggable {
  constructor(options) {
    super({
      user: getOsUsername(),
      channel: getFileBasename(),
      color: false,
      ignore: null,
      preNotify: null,
      level: 'default',
      formatter: 'default',
      enabled: true,
      ...options
    });

    this._profiles = {};

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
    this.options.level = Severity.registry.get(level);

    this._notifiers.forEach(notif => notif.level(this.options.level));

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
}

module.exports = Logger;