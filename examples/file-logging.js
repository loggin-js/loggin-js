/**
 * @name: SeverityFiltering  
 * 
 *  You can output the logs to a file instead of the console/terminal
 *  by creating a `Loggers.FileLogger` and by piping some severity to a file as shown below 
 */

// Require the logging library
const logging = require('../index');

// Shortcut for the severity constants
const { Severity, Loggers, Notifiers } = logging;

// Create a file logger
const logger = new Loggers.FileLogger({

  // Display line number at the begining of the log 
  lineNumbers: true,

  // You can pass a pipes array to the file logger
  // There can be as many as you want
  pipes: [
    // Here we create a pipe that will only output level ERROR logs to the file 'logs/error-logs.log'
    new Notifiers.Pipe(Severity.ERROR, 'logs/error-logs.log'),
    // This one will only output level INFO logs to the file 'logs/info-logs.log'
    new Notifiers.Pipe(Severity.INFO, 'logs/info-logs.log')
  ]
});

// You can also add pipes after creating the logger as follows
logger.pipe(Severity.ERROR, 'logs/error-logs.log');
logger.pipe(Severity.INFO, 'logs/info-logs.log');

// Lets log some stuff
// INFO message will log to 'logs/info-logs.log'
logger.info('Logging a info log');

// ERROR message will log to 'logs/error-logs.log'
logger.error('Logging a error log', new Error('An error'));

// Will not be logged as only the ERROR and INFO severities will be output to their respective files
logger.warning('Logging a warning log');
logger.notice('Logging a notice log');
logger.alert('Logging a error log');
