/**
* @jest-environment node
*/
let loggin = require('../src/index');

describe('loggin.Severity', () => {
    it(`Class should be defined`, () => {
        expect(loggin.Severity).toBeDefined();
    });
    // TODO: Add tests
});