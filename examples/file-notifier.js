const loggin = require('../index.js');

const fileLogger = loggin
  .logger('file', {
    formatter: 'detailed'
  });

let notif = fileLogger.getNotifier('file');
notif.pipe(loggin.severity('DEBUG'), './debug.log');
notif.pipe(loggin.severity('ERROR'), './error.log');
notif.pipe(loggin.severity('WARNING'), './warning.log');


fileLogger.debug('This is going to ./debug.log');
fileLogger.error('This is going to ./error.log and ./debug.log');
fileLogger.warning('This is going to ./warning.log and ./debug.log');