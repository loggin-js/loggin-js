const clicolor = require('cli-color');

/**
 * @param {loggin} loggin 
 */
function plugin(loggin) {
    const { Severity, Logger, Formatter } = loggin;
    console.log('initing plugin');

    Severity.register(9, 'CUSTOM');

    Logger.prototype.custom = function (message, data = null, opts = {}) {
        this.log(message, data, {
            level: Severity.get('CUSTOM'),
            ...opts
        });

        return this;
    };

    Formatter.replaceables.push({
        regexp: /CUS|CUSTOM|<%m[^>]+>/g,
        fn: (str) => clicolor.magentaBright(str).replace(/<%m(.+)>/g, '$1')
    });
}

module.exports = plugin;