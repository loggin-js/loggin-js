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
  channel: 'basic-example.js',
  formatter: 'medium'
});

// Does the same as passing into settings
logger.setLevel(Severity.DEBUG);
logger.setColor(true);

// Set user to root
logger.setUser('root');

// Available predefined log levels
logger.info('info', {
  user: 'Jeffrey',
  id: 101
});
logger.error('Teaching a snake to kick! :D');
logger.warning('Whats that');
logger.alert('Rice done.');
logger.debug('Wow I can log stuff');
logger.emergency('Lemons');
logger.critical('critical', { error: 'S*** something is bad!' });
logger.setUser('keff');
logger.notice('notice im now an other user');
logger.error('There was an <%rERROR>');

// If enabled set to false logs will not be output
logger.setEnabled(false);