const loggin = require('../../src/index');

const { colors } = loggin.Formatter;
const myformatter = loggin.Formatter.create(
    '[{time}] - {level} - {message}',
    {
        props: {
            time: {
                transformers: [
                    'toLocaleDate',
                    colors.blue
                ],
            },
            level: {
                transformers: [
                    colors.fromLevel,
                ],
            },
            message: {}
        }
    }
);

// Default ones
// formatter('message');
// formatter('json');
// formatter('detailed');
// formatter('minimal');
const formatter = loggin.formatter('json');
console.log(formatter);
const mylogger = loggin.logger({ formatter: formatter });
mylogger.debug('jaosdoj');