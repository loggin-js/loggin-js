
// Require the logging library
const logging = require('../index');

// Shortcut for the severity constants
const { Severity, Loggers, Notifiers } = logging;

// Create a file logger
const logger = new Loggers.FileLogger({
  pipes: [
    new Notifiers.Pipe(Severity.ERROR, 'logs/error-logs.log'),
    new Notifiers.Pipe(Severity.INFO, 'logs/info-logs.log')
  ],
  color: true
});

logger
  .pipe(Severity.ERROR, 'logs/error-logs.log')
  .pipe(Severity.INFO, 'logs/info-logs.log');

// INFO message will log to 'logs/info-logs.log'
logger.info('Logging a info log');

// ERROR message will log to 'logs/error-logs.log'
logger.error('Logging a error log', new Error('An error'));

// will not be logged as only the ERROR and INFO severities will be output to their respective files
logger.warning('Logging a warning log');
logger.notice('Logging a notice log');
logger.alert('Logging a error log');
