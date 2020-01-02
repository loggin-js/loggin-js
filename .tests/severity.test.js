/**
* @jest-environment node
*/
let loggin = require('../src/node');

describe('loggin.Severity', () => {
    it(`Class should be defined`, () => {
        expect(loggin.Severity).toBeDefined();
    });
    // TODO: Add tests
});