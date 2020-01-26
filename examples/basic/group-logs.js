const loggin = require('../../src/index');

const logger = loggin.logger('console');

// Idea 1
logger.group('login');
logger.info('user is logging in', { username: 'Bob' });
logger.error('use password was incorrect', {});
logger.error('use password was incorrect', {});
logger.info('user has logged in', { username: 'Bob' });
logger.groupEnd();

// Collapsed (will only work with console notifier)
logger.groupCollapsed('login');
logger.info('user is logging in', { username: 'Bob' });
logger.error('use password was incorrect', {});
logger.error('use password was incorrect', {});
logger.info('user has logged in', { username: 'Bob' });
logger.groupEnd();


// Idea 2
logger.group('signup', (logger) => {
    logger.info('user is logging in', { username: 'Bob' });
    logger.error('use password was incorrect', {});
    logger.error('use password was incorrect', {});
    logger.info('user has logged in', { username: 'Bob' });
});