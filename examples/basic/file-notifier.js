// FileNotifier
// https://runkit.com/nombrekeff/loggin-js-file-notifier

const loggin = require('../../');
const fs = require('fs');

// Create a file notifier using the `.notifier` function
let fileNotifier = loggin.notifier('file');

// Pipe (write) logs to a file, filtered by a level, setting to 'debug' will log all logs 
fileNotifier
  .pipe(loggin.severity('debug'), './debug.log')
  .pipe(loggin.severity('error'), './error.log')
  .pipe(loggin.severity('warning'), './warning.log');

// Create a logger and attach fileNotifier to it
const fileLogger = loggin.logger()
  .notifier(fileNotifier);

fileLogger.debug('This is going to ./debug.log');
fileLogger.error('This is going to ./error.log and ./debug.log');
fileLogger.warning('This is going to ./warning.log and ./debug.log');
fileLogger.info('This is going to ./debug.log');

fileNotifier.enabled(false);
fileLogger.info('This will not log to file');

let str = fs.readFileSync('./debug.log').toString();
console.log('File Contents: \n' + str);