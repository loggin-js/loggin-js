const loggin = require('../..');
let logger = loggin.logger('remote', {
    host: 'webhook.site',
    path: '2f4e9187-8ce7-4b3a-9a17-7af8206742d2',
    protocol: 'http'
});
logger.log('Hey');