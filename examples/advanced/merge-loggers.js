let loggin = require('../..');

let clogger1 = loggin.logger('console', {
  channel: 'clogger1'
});
let clogger2 = loggin.logger('console', {
  channel: 'clogger2'
});

let combinedLogger = loggin.merge([clogger1, clogger2]);

combinedLogger.debug('TEST');