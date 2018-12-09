'use strict';
const Logger = require('./lib/logger');
const {
  FileLogger,
  RemoteLogger,
  ConsoleLogger,
  LoggerPack,
  MemoryLogger
} = require('./lib/loggers');
const Notifiers = require('./lib/notifiers');
const { Formatter } = require('./lib/formatters');
const Severity = require('./lib/severity');
const Log = require('./lib/log');

let defaultOpts = {
  level: Severity.DEBUG
};

// To disable debug loggin
process.env.DEBUG = false;

/**
 * @deprecated in favor of .logger
 * @param {Object} options
 * @param {number} options.level?
 * @param {number} options.port?
 * @param {string} options.host?
 * @param {boolean} options.color?
 * @param {boolean} options.lineNumbers?
 * @param {string} options.filepath?
 * @param {string} options.formatter?
 * @param {string[]} options.pipes?
 * @return {ConsoleLogger|FileLogger|RemoteLogger}
 */
function getLogger(options = {}) {
  let loggerOpts = {
    ...defaultOpts,
    ...options
  };

  let level = loggerOpts.level || Severity.DEBUG;
  const filepath = loggerOpts.filepath;
  const filepaths = loggerOpts.filepaths;

  // by default return a console logger
  let logger = new ConsoleLogger(loggerOpts);

  // If level is a string set level to correct severity object
  if (typeof level === 'string') {
    level = Severity.fromString(level);
  }

  // return remote logger if port or host is passed
  const isRemote = loggerOpts.host || loggerOpts.port;
  if (isRemote) logger = new RemoteLogger(loggerOpts);

  // return file logger if loggerOpts contains filepath or filepaths
  const isFile = filepath || filepaths || loggerOpts.pipes;
  if (!isRemote && isFile) logger = new FileLogger(loggerOpts);

  return logger;
}

function logger(opts) {
  return getLogger(opts);
}

function notifier(opts, args) {
  if (
    typeof opts === 'string'
    && ['file', 'console', 'remote', 'memory'].includes(opts)
  ) {
    switch (opts) {
      case 'file':
        return new Notifiers.FileNotifier(args);
      case 'console':
        return new Notifiers.ConsoleNotifier(args);
      case 'remote':
        return new Notifiers.RemoteNotifier(args);
      case 'memory':
        return new Notifiers.MemoryNotifier(args);
      default:
        return new Notifiers.ConsoleNotifier(args);
    }
  } else if (typeof opts === 'object') {
    return new Notifiers.Notifier(opts);
  }
}

function formatter(opts) {
  if (
    typeof opts === 'string'
    && ['short', 'medium', 'long', 'detailed', 'minimal'].includes(opts)
  ) {
    switch (opts) {
      case 'short':
        return Formatter.SHORT;
      case 'medium':
        return Formatter.MEDIUM;
      case 'long':
        return Formatter.LONG;
      case 'detailed':
        return Formatter.DETAILED;
      case 'minimal':
        return Formatter.MINIMAL;
      default:
        return Formatter.MEDIUM;
    }
  } else if (typeof opts === 'object') {
    return new Formatter(opts);
  }
}


/**
 * @function
 * @param {Logger[]} loggers
 * @param {Object} options
 * @param {number} options.level
 * @param {string} options.filepath?
 * @param {string[]} options.filepaths?
 * @return {LoggerPack} LoggerPack
 */
function join(loggers, options = {}) {
  return new LoggerPack(options, loggers);
}

const LogginJS = {
  Loggers: {
    ConsoleLogger,
    FileLogger,
    RemoteLogger,
    MemoryLogger,
    Logger
  },
  Severity,
  Log,
  Notifiers,
  getLogger,
  Formatter,

  logger,
  notifier,
  formatter,
};

module.exports = LogginJS;
