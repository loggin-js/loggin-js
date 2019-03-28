'use strict';
const Logger = require('./lib/logger');
const Notifiers = require('./lib/notifiers');
const Formatter = require('./lib/formatters');
const Severity = require('./lib/severity');
const Log = require('./lib/log');
const Pipe = require('./lib/pipe');

function logger(opts = 'default', args = {}) {
  return Logger.get(opts, args);
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

function merge(loggers, options) {
  return Logger.merge(loggers, options);
}

function pipe(level, filepath) {
  return new Pipe(level, filepath);
}

const LogginJS = {
  Severity,
  Log,
  Notifiers,
  Formatter,
  Logger,
  Pipe,

  logger,
  notifier,
  formatter,
  severity,
  merge,
  pipe
};

module.exports = LogginJS;