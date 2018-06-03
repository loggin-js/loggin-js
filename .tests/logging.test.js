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

  // it(`should log correctly`, () => {
  //   let res = logger.debug("Logging a debug log");
  //   expect(...output).toContain("DEBUG - Logging a debug log");
  // });
});