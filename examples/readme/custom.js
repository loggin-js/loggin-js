const loggin = require('../../src/node');

const logger = loggin.logger({
    level: loggin.severity('info'), // Will output only info level and below
    channel: 'demo-1',
    formatter: 'long'
});

logger.user('Jhon');
logger.color(true);

logger.debug('Debug message, will not output');
logger.info('Info message, will output');

// You can override options when executing .log or any default methods (ie: debug, info, etc...)
logger.error('There was an <%rERROR>', null, { user: 'Bob' });
