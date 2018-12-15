const loggin = require('../');


const notif1 = loggin
  .notifier('file')
  .pipe(loggin.severity('DEBUG'), './debug.log')
  .pipe(loggin.severity('ERROR'), './error.log')
  .pipe(loggin.severity('CRITICAL'), './critical.log');


const logger =
  loggin
    .logger()
    .color()
    .channel('v1.x.x-example')
    .level('DEBUG')
    .notifier(notif1)
    .formatter('detailed');

logger.debug('debug', { id: '0000' });
logger.info('info', { id: '0000' });
logger.error('some error', { id: '0000' });
logger.critical('critical', { id: '0000' });
