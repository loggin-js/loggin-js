
const Logger = require('./lib/logger');
const {
  FileLogger,
  RemoteLogger,
  ConsoleLogger,
  LoggerPack
} = require('./lib/loggers');

const Notifiers = require('./lib/notifiers');
const Severity = require('./lib/severity');
const Log = require('./lib/log');

let defaultOpts = {
  level: Severity.DEBUG
}

/**
 * @function
 * @param {Object} options
 * @param {number} options.level
 * @param {string} options.filepath?
 * @param {string[]} options.filepaths?
 * @return {ConsoleLogger|FileLogger|RemoteLogger}
 */
function getLogger(options = defaultOpts) {
  let level = options.level || Severity.DEBUG;
  let filepath = options.filepath;
  let filepaths = options.filepaths;

  // TODO: add check for remote logger
  let isRemote = options.host || options.port;
  if (isRemote) return new RemoteLogger(options);

  // return file logger if options contains filepath or filepaths
  let hasFiles = filepath || filepaths;
  if (hasFiles) return new FileLogger(options);

  // by default return a console logger
  else return new ConsoleLogger(options);
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

module.exports = {
  Loggers: {
    ConsoleLogger,
    FileLogger,
    RemoteLogger,
    Logger
  },
  Severity: Severity,
  Log: Log,
  Notifiers: Notifiers,
  getLogger: getLogger,
  join: join
}
