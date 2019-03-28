let loggin = require('../index');

describe('loggin.Notifier tests', () => {
  it(`should be defined`, () => {
    expect(loggin.Notifiers.Notifier).toBeDefined();
  });

  it(`should construct notifier correctly`, () => {
    expect(() => {
      let notif = new loggin.Notifiers.Notifier();
    }).not.toThrow();
  });

  it(`should construct notifier correctly`, () => {
    let sev = loggin.severity('DEBUG');
    let notif = new loggin.Notifiers.Notifier({
      level: sev
    });

    expect(notif.options.level).toEqual(sev);
  });
});