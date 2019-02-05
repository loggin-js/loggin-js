const loggin = require('../');


const notif1 = loggin
  .notifier('file')
  .pipe(loggin.severity('DEBUG'), './debug.log')


console.log(notif1);

const logger =
  loggin
  .logger()
  .color(true)
  .channel('v1.x.x-example')
  .level('DEBUG')
  .notifier(notif1)
  .formatter('detailed');

logger.debug('debug', {
  id: '0000'
});
logger.info('info');
logger.error('some <%rerror>');
logger.critical('critical');