/**
* @jest-environment node
*/
let loggin = require('../src/index');

describe('loggin.Severity', () => {
    it(`Class should be defined`, () => {
        expect(loggin.Severity).toBeDefined();
    });

    it(`get debug severity works`, () => {
        expect(loggin.severity('debug')).toBeTruthy();
    });

    it(`test value filtering (debug.canLog(info))`, () => {
        let debug = loggin.severity('debug');
        let info = loggin.severity('info');
        expect(debug.canLog(info)).toBe(true);
        expect(info.canLog(debug)).toBe(false);
    });
});