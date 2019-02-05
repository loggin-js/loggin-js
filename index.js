'use strict';

const path = require('path');

const Logger = require('./lib/logger');

// Remove in next minor version
const {
  FileLogger,
  RemoteLogger,
  ConsoleLogger,
  LoggerPack,
  MemoryLogger
} = require('./lib/loggers');

const Notifiers = require('./lib/notifiers');
const Formatter = require('./lib/formatters');
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

  console.log('WARN: method "getLogger" is deprecated as of v1.x, please use "logger" instead.');

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

const DefaultLoggerOptions = {
  level: Severity.DEBUG,
  user: require('os').userInfo().username,
  channel: path.basename(__filename),
  formatter: formatter('detailed'),
  enabled: true,
  color: true,
};

/**
 * @param {Object} options
 * @param {number} options.level?
 * @param {number} options.port?
 * @param {string} options.host?
 * @param {boolean} options.color?
 * @param {boolean} options.lines?
 * @param {string} options.filepath?
 * @param {string} options.formatter?
 * @param {string[]} options.pipes? */
function logger(opts = {}, rest) {
  if (
    typeof opts === 'string' && ['file', 'console', 'remote', 'memory', 'default'].includes(opts)
  ) {
    let options = {
      ...DefaultLoggerOptions,
      ...rest
    }
    let notifier = new Notifiers.Console(options);
    switch (opts) {
      case 'file':
        notifier = new Notifiers.File(options);
        break;
      case 'default':
        notifier = new Notifiers.Console(options);
        break;
      case 'remote':
        notifier = new Notifiers.Remote(options);
        break;
      case 'memory':
        notifier = new Notifiers.Memory(options);
        break;
    }
    return new Logger.V2(options, notifier);
  } else if (typeof opts === 'object') {
    let options = {
      ...DefaultLoggerOptions,
      ...opts
    }
    return new Logger.V2(options);
  }
}

function notifier(opts, args = {}) {
  if (
    typeof opts === 'string' && ['file', 'console', 'remote', 'memory'].includes(opts)
  ) {
    switch (opts) {
      case 'file':
        return new Notifiers.File(args);
      case 'console':
        return new Notifiers.Console(args);
      case 'remote':
        return new Notifiers.Remote(args);
      case 'memory':
        return new Notifiers.Memory(args);
      default:
        return new Notifiers.Console(args);
    }
  } else if (typeof opts === 'object') {
    return new Notifiers.Notifier(opts);
  }
}

function formatter(opts) {
  if (
    typeof opts === 'string' && ['short', 'medium', 'long', 'detailed', 'minimal'].includes(opts)
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

function severity(level) {
  let severity = '';
  if (typeof level === 'string') {
    severity = Severity.fromString(level);
  } else if (typeof level === 'number') {
    severity = Severity.fromInt(level);
  } else if (level && level.constructor.name === 'Severity') {
    severity = level;
  } else {
    severity = Severity.DEBUG;
  }

  return severity;
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
  severity
};

module.exports = LogginJS;