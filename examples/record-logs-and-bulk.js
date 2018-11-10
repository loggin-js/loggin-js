
/**
 * @name: RecordLogs  
 * This example will show how to make a logger that saves not outputed logs to memory and
 * then you can show them on error or when you need to
 */

// Require the logging library
const { Loggers } = require('../index');

new Loggers.Logger();
new Loggers.ConsoleLogger();

const memoryLogger =
  new Loggers.MemoryLogger({
    color: false,
    formatter: '({time.toLocaleString}) {severityStr} - {user}@{channel} - {message} - {data}',
    channel: 'loggin-js',
    console: {
      color: true,
      formatter: '(<%gr{time.toLocaleString}>) {severityStr} - {user}@{channel} - {message} - {data}',
      channel: 'loggin-js'
    }
  });


memoryLogger.debug('Test log', { datas: '' });
memoryLogger.debug('Test log');
memoryLogger.debug('Test log');
memoryLogger.error(new Error('Some error here'));
memoryLogger.error(new Error('Some error here'));
memoryLogger.error(new Error('Some error here'));


// memoryLogger.writeToConsole();
memoryLogger.dump('./loggin-js.debug');