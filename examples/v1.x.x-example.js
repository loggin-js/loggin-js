const loggin = require('../index.js');

loggin.formatter()

const csol = loggin
  .notifier('console')
  .color(true)
  .level('debug')
  .formatter('detailed');

const file = loggin
  .notifier('file')
  .formatter(loggin.formatter('detailed'))
  .pipe(loggin.severity('debug'), './debug.log');


const logger =
  loggin.logger({
    notifiers: [csol, file]
  });

logger.debug('debug', {
  id: '0000'
});
logger.info('info');
logger.error('some <%rerror>');
logger.critical('critical');

let logger2 = logger.clone();
logger2.channel('logger2');
logger2.debug('asdasd');