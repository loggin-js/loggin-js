'use strict';

// A basic example on how Loggin'JS formatter is used.

// Require the logging library
// const logging = require('loggin-js'); // Should be logging-js
const logging = require('../..');

const logger = logging.logger({
  formatter: 'detailed'
});

// Available predefined log levels
logger.info('info', {
  user: 'pedro',
  id: 10
});
logger.error('error');
logger.info('info', { data: 'Hi' });
logger.alert('alert');
logger.emergency('emergency');
