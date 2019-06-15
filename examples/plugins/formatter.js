const loggin = require('../../index'); // require('loggin-js');

/**
 * @param {loggin} loggin 
 */
function plugin(loggin) {
    const { Severity, Logger, Notifier, Formatter } = loggin;
    let formatter = Formatter.register(
        'CUSTOM',
        '[{time} {user}] - {level} - {message} {data}', {
            props: {
                time: {
                    transformers: ['date', 'cl_blue']
                },
                user: {
                    transformers: ['cl_cyan']
                },
                level: {
                    transformers: ['string']
                },
                message: {
                    transformers: ['json_u', 'cl_gray']
                },
                data: {
                    transformers: ['json_u', 'cl_gray']
                }
            }
        }
    );

    // Formatter.replaceables.push({
    //     regexp: /SILLY|SIL|CUS|CUST|<%m[^>]+>/g,
    //     fn: (str) => clicolor.magentaBright(str).replace(/<%m(.+)>/g, '$1')
    // });
}

module.exports = plugin;