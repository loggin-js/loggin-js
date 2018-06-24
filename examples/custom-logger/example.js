'use strict';

/**
 * Import our custom Logger, check ./custom-logger for more detail
 */
const MyCustomLogger = require('./custom-logger');

// You now the deal...
let customLogger = new MyCustomLogger({
  color: true,
  formatter: '[{time.toLocaleString}] - <%m{channel}> - {user} | {severityStr} | {message} - {data}'
});

customLogger.setChannel('custom-logger');
customLogger.setUser('keff');

// Test that it works
customLogger.debug('My custom notifier <%gworks>!!!!!');
