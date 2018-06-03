let logging = require('../index');
const { Severity, Loggers, Notifiers } = logging;



describe('Should get a logger and log', () => {
  let logger = logging.getLogger({
    level: Severity.DEBUG
  });


  let tmplog = process.stdout.write;
  let output = null;
  process.stdout.write = function (...args) {
    output = args;
    tmplog(...output);
  }

  it(`should not throw error`, () => {
    expect(() => {
      let res = logger.debug("Logging a debug log");
    }).not.toThrow();
  });

  it(`should log correctly`, () => {
    let res = logger.debug("Logging a debug log");
    expect(...output).toContain("DEBUG - Logging a debug log");
  });
});