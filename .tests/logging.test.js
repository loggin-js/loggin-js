let logging = require('../index');
const { Severity, Loggers, Notifiers } = logging;



describe('Should get a logger and log', () => {
  let logger = logging.getLogger({
    level: Severity.DEBUG
  });

  it(`should not throw error`, () => {
    expect(() => {
      let res = logger.debug("Logging a debug log");
    }).not.toThrow();
  });
});


describe('LoggerOptions.level can be string, integer or Severity', () => {
  const createLoggerAndLog = (level) => () => {
    let logger = new logging.Loggers.Logger(new logging.Notifiers.MemoryNotifier({ level }), { level });
    // logger.debug('test');
  }

  it(`options.level must accept a <string>`, () => {
    expect(createLoggerAndLog('debug')).not.toThrow();
  });
  it(`options.level must accept a <Severity>`, () => {
    expect(createLoggerAndLog(logging.Severity.DEBUG)).not.toThrow();
  });
  it(`options.level must accept a <number>`, () => {
    expect(createLoggerAndLog(8)).not.toThrow();
  });
  it(`options.level should throw when bad level is passed`, () => {
    expect(createLoggerAndLog(null)).toThrow();
  });
});