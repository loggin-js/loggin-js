'use strict';

// {loggin-js v1.0.0}
// A basic example on how Loggin'JS is used.

// Require the logging library.
// you should use "require('loggin-js');" instead.
const logging = require('../index');

// Get a default logger
const logger = logging.logger('default');

// Available predefined log levels.
logger.info('info', {
  user: 'Jeffrey',
  id: 101
});
logger.error('Teaching a snake to kick! :D');
logger.warning('Whats that');
logger.alert('Rice done.');
logger.debug('Wow I can log stuff');
logger.emergency('Lemons');
logger.critical('critical', {
  error: 'S*** something is bad!'
});
logger.notice('notice im now an other user');
logger.error('There was an <%rERROR>');