
// Require the logging library
const logging = require('../index'); // Should be logging-js

// Shortcut for the severity constants
const { Severity, Loggers } = logging;

// Get a logger with DEBUG severity. Severity DEBUG will output any severity.
const logger = logging.getLogger({
  level: Severity.DEBUG,
  color: true
});

// Log info message
logger.info([
  'Logging a info log',
  'Logging a info log',
  'Logging a info log',
  'Logging a info log',
  'Logging a info log'
]);


