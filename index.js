'use strict';

const path = require('path');

// Lib
const Logger = require('./lib/logger');
const Notifiers = require('./lib/notifiers');
const Formatter = require('./lib/formatters');
const Severity = require('./lib/severity');
const Log = require('./lib/log');

const DefaultLoggerOptions = {
  level: Severity.DEBUG,
  user: require('os').userInfo().username,
  channel: path.basename(__filename),
  formatter: formatter('detailed'),
  enabled: true,
  color: true,
};

function logger(opts = 'default', args) {
  if (
    typeof opts === 'string' && ['file', 'console', 'remote', 'memory', 'default'].includes(opts)
  ) {
    let options = {
      ...DefaultLoggerOptions,
      ...args
    }
    let notifier = new Notifiers.Console(options);
    switch (opts) {
      case 'file':
        notifier = new Notifiers.File(options);
        break;
      case 'console':
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
    return new Logger(options, [notifier]);
  } else if (typeof opts === 'object') {
    let options = {
      ...DefaultLoggerOptions,
      ...opts
    }
    return new Logger(options, args);
  } else {
    throw new Error('Bad arguments for .logger, (' + opts + ')');
  }
}

function notifier(opts = 'default', args = {}) {
  if (
    typeof opts === 'string' && ['file', 'console', 'remote', 'memory', 'default'].includes(opts)
  ) {
    switch (opts) {
      case 'file':
        return new Notifiers.File(args);
      case 'console':
      case 'default':
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
  } else {
    throw new Error('Bad arguments for .notifier, (' + opts + ')');
  }
}

function formatter(template = 'default') {
  return Formatter.get(template);
}

function severity(level) {
  return Severity.get(level);
}

const LogginJS = {
  Severity,
  Log,
  Notifiers,
  Formatter,
  Logger,

  logger,
  notifier,
  formatter,
  severity
};

module.exports = LogginJS;