const loggin = require('../index'); // require('loggin-js');
const plugin = require('./plugins/severity.js');

loggin.use(plugin);

let logger = loggin.logger({
    level: loggin.severity('custom'),
    color: true
});

logger.debug('asdasd');
logger.custom('custom level');

