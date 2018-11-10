/**
 * @name: SeverityFiltering  
 */

// Require the logging library
const logging = require('../index');

// Shortcut for the severity constants
const { Severity } = logging;

// Get a logger with INFO severity. Severity INFO will output only INFO severity logs.
const logger = logging.getLogger({
  level: Severity.INFO,
  color: true
});

// Should be output to terminal
logger.info('Logging a info log');

// Should not be output to terminal
logger.debug('Logging a info log');
logger.error('Logging a error log', new Error());
