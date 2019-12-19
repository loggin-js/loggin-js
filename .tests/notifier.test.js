/**
* @jest-environment node
*/
let loggin = require('../src/node');

describe('loggin.Notifier tests', () => {
  it(`should be defined`, () => {
    expect(loggin.Notifier).toBeDefined();
  });

  it(`instance notifier correctly no args`, () => {
    expect(() => {
      let notif = new loggin.Notifier();
    }).not.toThrow();
  });

  it(`instance notifier correctly with severity`, () => {
    expect(() => {
      let sev = loggin.severity('DEBUG');
      let notif = new loggin.Notifier({
        level: sev
      });
    }).not.toThrow();
  });

  it(`instance with incorrect severity`, () => {
    expect(() => {
      let sev = loggin.severity('DEBUG');
      let notif = new loggin.Notifier({
        level: 12
      });
    }).toThrow();
  });
 
  it(`Sets options correctly`, () => {
    let sev = loggin.severity('DEBUG');
    let formatter = loggin.formatter('detailed');
    let notif = new loggin.Notifier({
      level: sev,
      formatter: 'detailed',
    });

    expect(notif.options.level).toEqual(sev);
    expect(notif.options.formatter).toMatchObject(formatter);
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

  it(`.getLineWithNumber should work`, () => {
    let notifier = loggin.notifier('default');
    let line = notifier.getLineWithNumber('test');
    expect(line).toEqual('(0) test');
  });
});