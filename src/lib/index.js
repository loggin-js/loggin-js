'use strict';

const Logger = require('./logger');
const Notifier = require('./notifier');
const Formatter = require('./formatter');
const Severity = require('./severity');
const Log = require('./log');
const Pipe = require('./pipe');

function logger(opts = 'default', args = {}) {
  return Logger.get(opts, args);
}

function notifier(opts = 'default', args = {}) {
  return Notifier.get(opts, args);
}

function formatter(template = 'default') {
  return Formatter.get(template);
}

function severity(level, { strict } = { strict: false }) {
  const severity = Severity.get(level);
  severity.strict = strict;
  
  return severity;
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

module.exports = LogginJS;