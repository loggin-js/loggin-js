
const loggin = require('../../');
const workspace = loggin.workspace({
    loggers: [
        loggin.logger('console'),
        loggin.logger('file'),
    ],
    defaultOptions: {
        level: loggin.severity('DEBUG'),
        channel: 'my-app',
    }
});

const logger = workspace.getLogger('console');
logger.debug('Logs to console');

workspace.logTo('file')
    .info('Logs to file');
    
workspace.logTo(['file', 'console'])
    .error('Logs to file and console');