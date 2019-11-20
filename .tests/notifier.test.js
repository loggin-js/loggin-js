/**
* @jest-environment node
*/
let loggin = require('../src/node');

describe('loggin.Notifier tests', () => {
  it(`should be defined`, () => {
    expect(loggin.Notifier).toBeDefined();
  });

  it(`should construct notifier correctly`, () => {
    expect(() => {
      let notif = new loggin.Notifier();
    }).not.toThrow();
  });

  it(`should construct notifier correctly`, () => {
    let sev = loggin.severity('DEBUG');
    let notif = new loggin.Notifier({
      level: sev
    });

    expect(notif.options.level).toEqual(sev);
  });
});