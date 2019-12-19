/**
* @jest-environment node
*/
let loggin = require('../src/node');

describe('loggin.Formatter', () => {
    it(`Class should be defined`, () => {
        expect(loggin.Formatter).toBeDefined();
    });

    it(`construct formatter correctly`, () => {
        expect(() => {
            loggin.formatter('minimal');
        }).not.toThrow();
    });

    it(`should have methods`, () => {
        let formatter = loggin.formatter('minimal');
        expect(() => {
            ['formatLog', 'color'].forEach(fn => {
                if (typeof formatter[fn] !== 'function') {
                    throw new Error(fn + ' is not a method in formatter');
                }
            });
        }).not.toThrow();
    });

    it(`.formatLog should work correctly`, () => {
        let formatter = loggin.formatter('minimal');
        let log = new loggin.Log('message', null, loggin.severity('debug'), 'test');
        let formattedLog = formatter.formatLog(log);
        expect(formattedLog).toEqual("test - message");
    });

    it(`.color should work correctly`, () => {
        let formatter = loggin.formatter('minimal');
        let colored = formatter.color('<%rHello>');
        expect(colored).toEqual('[91mHello[39m');
    });
});