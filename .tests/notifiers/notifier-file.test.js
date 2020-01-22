/**
* @jest-environment node
*/
let loggin = require('../../src/index');
let fs = require('fs');
let filePath = '../logs/test-file.log';
let fileErrorPath = '../logs/error-file.log';

describe('loggin.Notifier.File tests', () => {
    it(`should be registered`, () => {
        expect(loggin.Notifier.File).toBeDefined();
    });

    it(`should construct notifier correctly`, () => {
        expect(() => {
            let notif = new loggin.Notifier.File();
        }).not.toThrow();
    });

    beforeEach(() => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    it(`should log correctly to file`, () => {
        let notif = loggin.notifier('file', {
            pipes: [loggin.pipe(loggin.severity('debug'), filePath)]
        });
        notif.pipe(loggin.severity('error'), fileErrorPath);

        let log = new loggin.Log('Test', null, loggin.severity('DEBUG'));
        notif.output(log.message, log);

        const fileData = fs.readFileSync(filePath).toString().trim();
        expect(fileData).toEqual('Test');
    });
});