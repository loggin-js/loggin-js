const loggin = require('../../src/index');

const logger = loggin.logger('console');

// Idea 1
logger.group('login');
logger.info('user is logging in', { username: 'Bob' });
logger.group('password');
logger.error('use password was incorrect', {});
logger.error('use password was incorrect', {});
logger.groupEnd();
logger.info('user has logged in', { username: 'Bob' });
logger.groupEnd();
