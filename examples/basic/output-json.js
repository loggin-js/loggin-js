const loggin = require('../..');

let logger = loggin.logger({
    formatter: 'json'
});

logger.debug('this is a test', { name: 'asdasd' });