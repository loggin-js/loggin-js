const loggin = require('../../src/node');
const logger = loggin.logger('file');
logger.channel('my-logger');

logger
    .getNotifier('file')
    .pipe(loggin.pipe('DEBUG', './debug.log'));

loggin.debug('Check this log out!!', { foo: 'var' });