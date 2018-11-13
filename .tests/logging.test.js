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
  const createLogger = (level) => () => {
    let logger = new logging.Loggers.Logger(new logging.Notifiers.MemoryNotifier({ level }), { level });
    return logger;
  }

  it(`options.level must accept a <string>`, () => {
    expect(createLogger('debug')).not.toThrow();
  });
  it(`options.level must accept a <Severity>`, () => {
    expect(createLogger(logging.Severity.DEBUG)).not.toThrow();
  });
  it(`options.level must accept a <number>`, () => {
    expect(createLogger(8)).not.toThrow();
  });
  it(`options.level should be set to DEBUG by default`, () => {
    expect(createLogger()().getLevel().level).toEqual(7);
  });
});