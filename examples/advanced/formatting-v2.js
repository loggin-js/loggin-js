const loggin = require('../../src/index');

const { colors } = loggin.Formatter;
const myformatter = loggin.Formatter.create(
    '[{time}] - {level} - {message} {data}',
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
            message: {},
            data: {
                transformers: ['stringify', 'cl_gray'],
            }
        }
    }
);

// Default ones
// formatter('message');
// formatter('json');
// formatter('detailed');
// formatter('minimal');
const mylogger = loggin.logger({ formatter: myformatter });
mylogger.debug('jaosdoj');