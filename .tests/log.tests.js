/**
* @jest-environment node
*/
let loggin = require('../src/node');

fdescribe('loggin.Log', () => {
    it(`Class should be defined`, () => {
        expect(loggin.Log).toBeDefined();
    });

    it(`construct formatter correctly`, () => {
        expect(() => {
            new loggin.Log();
        }).not.toThrow();
    });

    it(`should have methods`, () => {
        let log = new loggin.Log();
        expect(() => {
            ['format'].forEach(fn => {
                if (typeof log[fn] !== 'function') {
                    throw new Error(fn + ' is not a method in log');
                }
            });
        }).not.toThrow();
    });

    it(`.format should work correctly`, () => {
        let log = new loggin.Log();
        expect(log.format()).toEqual();
    });

    it(`Log.fromObject should work correctly`, () => {
        let log = loggin.Log.fromObject({  });
        expect(log).toEqual();
    });
});