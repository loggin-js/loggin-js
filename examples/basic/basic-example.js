/**
 * @name: Basic Example  
 * This is he most basic example on how Loggin'JS works!
 */

// const loggin = require('loggin-js');
const loggin = require('../..');

// Get a logger with DEBUG severity. 
// Severity DEBUG will output any severity.
const logger = loggin.logger({
  level: loggin.severity('debug'),
  color: true,

  // A label to identify this logger instance, defaults to filename if omitted
  channel: 'basic-example.js',
  formatter: 'medium'
});

// Does the same as passing into settings
logger.level('debug');
logger.color(true);

// Set user to root
logger.user('root');

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

logger.user('keff');

logger.notice('notice im now an other user');
logger.error('There was an <%rERROR>');

// If enabled set to false logs will not be output
logger.enabled(false);