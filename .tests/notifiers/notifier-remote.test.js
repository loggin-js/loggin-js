/**
* @jest-environment node
*/
const loggin = require('../..');
const http = require('http');
const path = require('path');

describe('loggin.Notifier.Http tests', () => {
    let httpServer = null;
    afterAll((done) => {
        try {
            httpServer.on('close', done);
            httpServer.close();
        } catch (error) {
            console.log('error', error);
        }
    });

    it(`should be registered`, () => {
        expect(loggin.Notifier.Http).toBeDefined();
    });

    it(`should construct notifier correctly`, () => {
        expect(() => {
            let notif = new loggin.Notifier.Http();
        }).not.toThrow();
    });

    it(`should log correctly to http`, (done) => {
        const notif = loggin.notifier('http', { url: 'http://localhost:3333/loggin-js:log' });

        httpServer = http.createServer((req, res) => {
            console.log('req', req.url);
            expect(req.url).toEqual(path.normalize('/loggin-js:log'));
            done();
        });
        httpServer.listen(3333);

        setTimeout(() => {
            let log = new loggin.Log('Test', null, loggin.severity('DEBUG'));
            notif.output(log.message, log);
        }, 1e3);
    });
});