'use strict';

// Require the logging library
const logging = require('../index');

// Shortcut for the severity constants
const { Severity } = logging;

// Get a logger with DEBUG severity. Severity DEBUG will output any severity.
const logger = logging.getLogger({
  level: Severity.DEBUG,
  color: true,
  port: 8080
});

// Log info message
logger.info('Logging a info log');

// Log error message
logger.error('Logging a error log', new Error('That is wrong'));

