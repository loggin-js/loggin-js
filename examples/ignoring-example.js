const loggin = require('../index.js');

let logger = loggin.logger({
  // This callback is run before ignore and other logic
  preNotify(log, notifier) {
    log.message = '<%b------> <%y' + log.message.toLowerCase() + '> <%b------>';
    log.level.name = log.level.name.toLowerCase();
  },
  ignore(log, notifier) {
    return log.level.name == 'INFO';
  },
  color: true,
  formatter: 'detailed',
  channel: 'test',
  lineNumbers: true
});

logger.debug('wanted');
logger.debug('wanted');
logger.info('>>__ not wanted');
logger.debug('wanted');
logger.debug('wanted');