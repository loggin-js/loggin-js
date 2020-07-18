const loggin = require('../../src/index');

const logger = loggin.logger({
    level: loggin.severity('debug'),
    color: true,
    channel: 'demo-1',
    formatter: 'json'
});

console.log('');
logger.info('info');
logger.error('Teaching a snake how to kick! :D');
logger.emergency('Lemons');
logger.critical('critical', {
    error: 'S*** something is bad!'
});
console.log('');
