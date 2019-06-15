const loggin = require('../index'); // require('loggin-js');
const plugin = require('./plugins/severity.js');

loggin.use(plugin);

let formatter = loggin.formatter('long');
let logger = loggin.logger({
    level: loggin.severity('custom'),
    color: true,
    formatter: formatter
});

logger.debug('asdasd');
logger.custom('custom level');

