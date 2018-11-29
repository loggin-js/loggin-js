/**
 * @name: RemoteLogger  
 * This example will show how to make a logger that sends logs to a remote server via http requests
 */

const logging = require('../index');
const { Severity } = logging;

// Get a logger with DEBUG severity. Severity DEBUG will output any severity.
const logger = logging.getLogger({
  level: Severity.DEBUG,
  color: true,
  port: 8080,
  host: 'myapi.com/post-log'
});

// Log info message
logger.info('Logging a info log');

// Log error message
logger.error('Logging a error log', new Error('That is wrong'));

