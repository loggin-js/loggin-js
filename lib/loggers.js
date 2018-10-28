'use strict';

const Logger = require('./logger');
const Notifiers = require('./notifiers');
const Severity = require('./severity');
const { warnAction } = require('./utils');

/**
 * @class ConsoleLogger 
 * @extends Logger
 */
class ConsoleLogger extends Logger {
  constructor(options = {}) {
    super(new Notifiers.ConsoleNotifier(options), options);
  }
}

/**
 * @class FileLogger 
 * @extends Logger
 */
class FileLogger extends Logger {
  constructor(options = {}) {
    if (options.color) {
      warnAction('WARN: options.color should not be used when logging to a file');
    }
    super(new Notifiers.FileNotifier(options), options);
  }

  /**
   * Pipe a severity log to some output, 
   * 
   * ie: a `filepath` or `process.stdout`, etc...
   * 
   * @param {Severity} severity
   * @param {string} output
   */
  pipe(severity, output) {
    this.notifier.pipe(severity, output);

    return this;
  }
}

/**
 * @class RemoteLogger 
 * @extends Logger
 */
class RemoteLogger extends Logger {
  constructor(options = {}) {
    super(new Notifiers.RemoteNotifier(options), options);
  }
}

/**
 * Packs a set of loggers into one
 * @class LoggerPack 
 * @extends Logger
 */
class LoggerPack extends Logger {
  constructor(options, loggers) {
    super(new Notifiers.ConsoleNotifier(options), options);
    this._loggers = loggers;
  }

  /** 
   * @arg {number} level
   */
  setLevel(level) {
    this._loggers.forEach((logger) => {
      this._level = level;
      logger.setLevel(this._level);
    });

    return this;
  }

  /**
   * @param string message
   * @param mixed data
   * @param int severity , standard RFC3164 code (https://tools.ietf.org/html/rfc3164)
   * @param string channel
   */
  log(message, data = null, severity = Severity.DEBUG, channel = '') {
    this._loggers.forEach((logger) => {
      logger.log(message, data, severity, channel);
    });

    return this;
  }
}

module.exports = {
  FileLogger,
  ConsoleLogger,
  RemoteLogger,
  LoggerPack
};

