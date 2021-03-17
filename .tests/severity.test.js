/**
* @jest-environment node
*/
let loggin = require('../src/index');

describe('loggin.Severity', () => {
    it(`Class should be defined`, () => {
        expect(loggin.Severity).toBeDefined();
    });

<<<<<<< HEAD
    it(`get debug severity works`, () => {
        expect(loggin.severity('debug')).toBeTruthy();
    });

    it(`test value filtering (debug.canLog(info))`, () => {
=======
    it(`.severity debug severity works`, () => {
        expect(loggin.severity('debug')).toBeTruthy();
    });

    it(`test severity filtering`, () => {
>>>>>>> feat/v2-refactor
        let debug = loggin.severity('debug');
        let info = loggin.severity('info');
        expect(debug.canLog(info)).toBe(true);
        expect(info.canLog(debug)).toBe(false);
    });
<<<<<<< HEAD
=======

    it(`test severity filtering (strict))`, () => {
        let debug = loggin.severity('debug', { strict: true });
        let info = loggin.severity('info', { strict: true });

        expect(debug.canLog(debug)).toBe(true);
        expect(debug.canLog(info)).toBe(false);
        expect(info.canLog(debug)).toBe(false);
    });
>>>>>>> feat/v2-refactor
});