let logging = require('../index');
const { Severity, Loggers, Notifiers } = logging;

let loggers = [
  { constructor: logging.Loggers.ConsoleLogger, name: 'logging.Loggers.ConsoleLogger' },
  { constructor: logging.Loggers.FileLogger, name: 'logging.Loggers.FileLogger' },
  { constructor: logging.Loggers.RemoteLogger, name: 'logging.Loggers.RemoteLogger' }
];

describe('logging should be defined', () => {
  it(`logging should`, () => {
    expect(logging).toBeDefined();
  });
  it(`logging.Loggers`, () => {
    expect(Loggers).toBeDefined();
  });
  it(`logging.Severity`, () => {
    expect(Severity).toBeDefined();
  });
  it(`logging.Notifiers`, () => {
    expect(Notifiers).toBeDefined();
  });
});

describe('Loggers Should Be Defined', () => {
  for (let i = 0; i < loggers.length; i++) {
    let logger = loggers[i];
    it(`${logger.name}`, () => {
      expect(logger.constructor).toBeDefined();
    });
  };
});


describe('Loggers Should Be Instance Of Logger', () => {
  for (let i = 0; i < loggers.length; i++) {
    let logger = loggers[i];
    it(`${logger.name}`, () => {
      expect(new logger.constructor({})).toBeInstanceOf(Loggers.Logger);
    });
  };
});

