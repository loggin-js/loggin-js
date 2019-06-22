const loggin = require('../');

const csol = loggin
  .notifier('console')
  .color(true)
  .level('debug')
  .formatter('detailed');

const file = loggin
  .notifier('file')
  .formatter('detailed')
  .pipe(loggin.severity('debug'), './debug.log');


const logger =
  loggin.logger({
    notifiers: [csol, file]
  }).channel('logger1');

logger.info('info');
logger.color(false);

// You can modify the notifier any time
logger.error('some <%rerror>');
logger.critical('critical');


console.log('--------------------------------------------------');
let logger2 = logger.clone({
  formatter: 'long',
  channel: 'logger2',
  color: true
});

logger2.debug('debug', { id: '0000' });
logger2.info('info');
logger2.error('some <%rerror>');
logger2.critical('critical');
logger2.silly('critical', null, {
  formatter: 'short'
});