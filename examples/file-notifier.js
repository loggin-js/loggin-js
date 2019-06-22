const loggin = require('../');

let notif = loggin
  .notifier('file')
  .pipe(loggin.severity('debug'), './logs/debug.log')
  .pipe(loggin.severity('error'), './logs/error.log')
  .pipe(loggin.severity('warning'), './logs/warning.log');

const fileLogger = loggin
  .logger('default')
  .setNotifiers([notif]);


fileLogger.debug('This is going to ./debug.log');
fileLogger.error('This is going to ./error.log and ./debug.log');
fileLogger.warning('This is going to ./warning.log and ./debug.log');
fileLogger.info('This is going to ./debug.log');
fileLogger.info('This is going to ./debug.log');