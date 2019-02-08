const loggin = require('../index.js');

let logger = loggin.logger({
  ignore(log, notifier) {
    return log.level.toString() == 'INFO';
  },
  preNotify(log, notifier) {
    log.message = '>>>>> ' + log.message + ' <<<<<';
  }
});


logger.debug('wanted');
logger.debug('wanted');
logger.info('>>__ not wanted');
logger.debug('wanted');
logger.debug('wanted');