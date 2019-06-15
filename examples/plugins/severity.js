const loggin = require('../../index'); // require('loggin-js');

/**
 * @param {loggin} loggin 
 */
function plugin({ Severity, Logger, Notifier }) {
    console.log('initing plugin');
    Severity.register(9, 'CUSTOM');
    Logger.prototype.custom = function (message, data = null, opts = {}) {
        this.log(message, data, {
            level: Severity.get('CUSTOM'),
            ...opts
        });

        return this;
    };
}

module.exports = plugin;