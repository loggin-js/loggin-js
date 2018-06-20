'use strict';

// A basic example on how Loggin'JS is used.

// Require the logging library
// const logging = require('loggin-js'); // Should be logging-js
const logging = require('../index');

// Shortcut for the severity constants
const { Severity } = logging;

// Get a logger with DEBUG severity. 
// Severity DEBUG will output any severity.
const logger = logging.getLogger({
  level: Severity.DEBUG,
  color: true,
  // lineNumbers: true,

  // A label to identify this logger instance, default to filename if omitted
  channel: 'basic-example.js'
});

// Does the same as passing into settings
logger.setLevel(Severity.DEBUG);
logger.setColor(true);

// Set user to root
logger.setUser('root');

// Available predefined log levels
logger.info('info', {
  user: 'pedro',
  id: 10
});
logger.error('error');
logger.warning('warning');
logger.alert('alert');
logger.emergency('emergency');
logger.critical('critical');
logger.debug('debug');
logger.notice(['notice', 'notice']);
logger.error('There was an <%rERROR>'); 

// If enabled set to false logs will not be output
logger.setEnabled(false);