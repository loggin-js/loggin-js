const Logger = require('../lib/logger');
const Notifiers = require('../lib/notifiers');
const Severity = require('../lib/severity');

const logger = new Logger.V2({ channel: 'v1.x.x-example' })
  .color(true)
  .level('INFO');

const notif1 = new Notifiers.FileNotifier({ channel: 'notif-1' })
  .pipe(Severity.DEBUG, './debug.log');

const notif2 = new Notifiers.FileNotifier({ channel: 'notif-2' })
  .pipe(Severity.ERROR, './error.log');

const notif3 = new Notifiers.FileNotifier({ channel: 'notif-3' })
  .pipe(Severity.CRITICAL, './critical.log');

logger.notifier(notif1, notif2, notif3);
logger.formatter('detailed');

logger.debug('debug', { id: '0000' });
logger.info('info', { id: '0000' });
logger.error('some error', { id: '0000' });
logger.critical('critical', { id: '0000' });
