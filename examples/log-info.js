
// Require the logging library
const logging = require('../index'); // Should be logging-js

// Shortcut for the severity constants
const { Severity, Loggers } = logging;

// Get a logger with DEBUG severity. Severity DEBUG will output any severity.
const logger = logging.getLogger({
  level: Severity.INFO,
  color: true
});

// Should be output to terminal
logger.info('Logging a info log');

// Should not be output to terminal
logger.debug('Logging a info log');

let error = new Error();
logger.error('Logging a error log', error);

