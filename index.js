'use strict';

const path = require('path');

// Lib
const Logger = require('./lib/logger');
const Notifiers = require('./lib/notifiers');
const Formatter = require('./lib/formatters');
const Severity = require('./lib/severity');
const Log = require('./lib/log');

function logger(opts = 'default', args = {}) {
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
}

function notifier(opts = 'default', args = {}) {
  return Notifiers.get(opts);
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