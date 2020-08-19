/**
* @jest-environment node
*/
let loggin = require('../../src/node');
const MockNotifier = require('../mocks/notifier.mock');

describe('loggin.Logger severity filtering (debug)', () => {
    let notifier = new MockNotifier();
    let logger = loggin.logger({
        notifiers: [notifier],
        level: loggin.severity('debug'),
    });

    it(`debug should output correctly`, () => {
        notifier.clear();
        logger.debug('hey', null, { time: 100000000, channel: 'test' });
        expect(notifier.logs.length).toEqual(1);
    });


    it(`info should output correctly`, () => {
        notifier.clear();
        logger.info('hey', null, { time: 100000000, channel: 'test' });
        expect(notifier.logs.length).toEqual(1);
    });
});

describe('loggin.Logger severity filtering (error)', () => {
    let notifier = new MockNotifier();
    let logger = loggin.logger({
        notifiers: [notifier],
        level: loggin.severity('error'),
    });

    it(`debug should not output`, () => {
        notifier.clear();
        logger.debug('hey', null, { time: 100000000, channel: 'test' });
        expect(notifier.logs.length).toEqual(0);
    });


    it(`error should output correctly`, () => {
        notifier.clear();
        logger.error('hey', null, { time: 100000000, channel: 'test' });
        expect(notifier.logs.length).toEqual(1);
    });
});
