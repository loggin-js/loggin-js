/**
* @jest-environment node
*/
let loggin = require('../src/index');

describe('loggin.Log', () => {
    it(`Class should be defined`, () => {
        expect(loggin.Log).toBeDefined();
    });

    it(`construct formatter correctly`, () => {
        expect(() => {
            new loggin.Log('test');
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
});