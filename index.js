'use strict';

const Logger = require('./lib/logger');
const Notifier = require('./lib/notifier');
const Formatter = require('./lib/formatter');
const Severity = require('./lib/severity');
const Log = require('./lib/log');
const Pipe = require('./lib/pipe');

// Default Plugins
const additionalFormatter = require('./plugins/additional-notifiers');

function logger(opts = 'default', args = {}) {
  return Logger.get(opts, args);
}

function notifier(opts = 'default', args = {}) {
  return Notifier.get(opts);
}

function formatter(template = 'default') {
  return Formatter.get(template);
}

function severity(level) {
  return Severity.get(level);
}

function merge(loggers, options) {
  return Logger.merge(loggers, options);
}

function pipe(level, filepath) {
  return new Pipe(level, filepath);
}

function use(plugin) {
  if (typeof plugin !== 'function') {
    throw new Error('"plugin" must be a function');
  }

  // "this" will resolve to LogginJS
  plugin(this);
}


const LogginJS = {
  Severity,
  Log,
  Notifier,
  Formatter,
  Logger,
  Pipe,

  logger,
  notifier,
  formatter,
  severity,
  merge,
  pipe,
  use
};

LogginJS.use(additionalFormatter);

module.exports = LogginJS;