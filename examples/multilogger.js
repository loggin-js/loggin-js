/**
 * @name: MultiLogger  
 * This example will show how to create a multilogger
 */

const { Loggers, Severity } = require('../index');

let cloger = new Loggers.ConsoleLogger();
cloger.setLevel('INFO');

let floger = new Loggers.FileLogger();
floger.pipe(Severity.DEBUG, 'debug.log');

const pack = pack([cloger, floger]);
pack.info('This will be logged to console and wrote to debug.log');
pack.debug('This will be logged just to debug.log');