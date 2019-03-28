let loggin = require('../index');

let logger = loggin.logger('memory');

logger.debug('test');
logger.debug('test');
logger.debug('test');
logger.error('test');
logger.error('test');
logger.error('test');

let memory = logger.getNotifier('memory');
memory.dumpToConsole();
memory.dumpToFile('./dump.test');