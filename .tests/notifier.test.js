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

  it(`.enabled should set correctly`, () => {
    let notifier = loggin.notifier('default');
    notifier.enabled(false);
    expect(notifier.options.enabled).toEqual(false);
    notifier.enabled(true);
    expect(notifier.options.enabled).toEqual(true);
  });

  it(`.level should set correctly`, () => {
    let notifier = loggin.notifier('default');
    notifier.level('DEBUG');
    expect(notifier.options.level).toEqual(loggin.severity('DEBUG'));
  });

});