const loggin = require('../index.js');

let logger = loggin.logger({
  ignore(log) {
    return log.level.toString() == 'INFO';
  }
});


logger.debug('wanted');
logger.debug('wanted');
logger.info('>>__ not wanted');
logger.debug('wanted');
logger.debug('wanted');