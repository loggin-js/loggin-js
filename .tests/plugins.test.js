/**
* @jest-environment node
*/

const { Notifier, Logger, Formatter, Severity } = require('../src/node');

const AdditionalNotifiers = ['Console', 'File', 'Http', 'Memory'];
const AdditionalLoggers = AdditionalNotifiers.map(el => el.toLocaleLowerCase());
const AdditionalFormatters = ['SHORT', 'MEDIUM', 'LONG', 'DETAILED', 'MINIMAL', 'JSON'];
const AdditionalSeverities = ['EMERGENCY', 'ALERT', 'CRITICAL', 'ERROR', 'WARNING', 'NOTICE', 'INFO', 'DEBUG', 'SILLY',];

describe('AdditionalNotifiers', () => {
    it(`should be registered`, () => {
        for (let notifName of AdditionalNotifiers) {
            expect(Notifier._notifiers[notifName]).toBeDefined();
        }
    });
});

describe('AdditionalLoggers', () => {
    it(`should be registered`, () => {
        for (let loggerName of AdditionalLoggers) {
            expect(Logger._loggers[loggerName]).toBeDefined();
        }
    });
});

describe('AdditionalFormatters', () => {
    it(`should be registered`, () => {
        for (let formatter of AdditionalFormatters) {
            expect(Formatter._formatters[formatter]).toBeDefined();
        }
    });
});

describe('AdditionalSeverities', () => {
    it(`should be registered`, () => {
        for (let severity of AdditionalSeverities) {
            expect(Severity._severities[severity]).toBeDefined();
        }
    });
});