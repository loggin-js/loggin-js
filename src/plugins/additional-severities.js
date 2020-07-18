
function plugin(loggin) {
    const { Severity, Logger } = loggin;

    Severity
        .register(0, 'EMERGENCY')
        .register(1, 'ALERT')
        .register(2, 'CRITICAL')
        .register(3, 'ERROR')
        .register(4, 'WARNING')
        .register(5, 'NOTICE')
        .register(6, 'INFO')
        .register(7, 'DEBUG')
        .register(8, 'SILLY');

    function logMethodFactory(level) {
        return function (message, data = null, opts = {}) {
            this.log(message, data, {
                level,
                ...opts
            });

            return this;
        }
    }

    Logger.defineMethod('silly', logMethodFactory(Severity.get('SILLY')));
    Logger.defineMethod('debug', logMethodFactory(Severity.get('DEBUG')));
    Logger.defineMethod('info', logMethodFactory(Severity.get('INFO')));
    Logger.defineMethod('notice', logMethodFactory(Severity.get('NOTICE')));
    Logger.defineMethod('warning', logMethodFactory(Severity.get('WARNING')));
    Logger.defineMethod('error', logMethodFactory(Severity.get('ERROR')));
    Logger.defineMethod('critical', logMethodFactory(Severity.get('CRITICAL')));
    Logger.defineMethod('alert', logMethodFactory(Severity.get('ALERT')));
    Logger.defineMethod('emergency', logMethodFactory(Severity.get('EMERGENCY')));
};

module.exports = plugin;