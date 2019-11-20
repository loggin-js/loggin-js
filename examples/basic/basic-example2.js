/*
 * Basic Example  
 * This is the most basic example on how Loggin'JS works!
 */

const loggin = require('../..');

/*
 * Create a logger with the `getLogger` method, with level set to DEBUG.
 * This means it will log all debug logs and below, check this link for more info:
 * https://github.com/nombrekeff/loggin-js/wiki/Severity
 */
const logger = loggin.logger({
    level: loggin.severity('debug')
});

/* You can also change the level after creating it */
logger.level('debug');

/* Now we can log some stuff */
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
logger.notice('notice im now an other user');
logger.error('There was an <%rERROR>');
