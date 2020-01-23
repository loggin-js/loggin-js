
function plugin(loggin) {
    const { Formatter } = loggin;

    Formatter.colors.fromLevel = (severity) => {
        let severityString = severity.name;
        switch (severityString) {
            case 'INFO':
                return Formatter.colors.blue(severityString);
            case 'DEBUG':
                return Formatter.colors.brightBlue(severityString);
            case 'NOTICE':
                return Formatter.colors.cyan(severityString);
            case 'WARNING':
                return Formatter.colors.brightYellow(severityString);
            case 'ALERT':
            case 'CRITICAL':
                return Formatter.colors.yellow(severityString);
            case 'ERROR':
                return Formatter.colors.red(severityString);
            default:
                return severityString;
        }
    }

    Formatter['JSON'] = Formatter._formatters['JSON'] = {
        formatLog: (log) => JSON.stringify,
        color: (log) => log,
    }

    Formatter
        .register(
            'MESSAGE',
            '{message}',
        );

    Formatter
        .register(
            'SHORT',
            '[{time}] - {level} - {message}', {
            props: {
                time: {
                    transformers: ['toLocaleDate'],
                },
                level: {
                    transformers: ['toString']
                },
                message: {

                }
            }
        }
        );
    Formatter
        .register(
            'MEDIUM',
            '[{time}] - {level} - {message} {data}', {
            props: {
                time: {
                    transformers: ['toLocaleDate']
                },
                level: {
                    transformers: ['toString']
                },
                message: {},
                data: {
                    transformers: ['json', 'cl_gray']
                }
            }
        }
        );
    Formatter
        .register(
            'LONG',
            '[{time} {user}] - {level} - {message} {data}', {
            props: {
                time: {
                    transformers: ['toLocaleDate', 'cl_blue']
                },
                user: {
                    transformers: ['cl_gray']
                },
                level: {
                    transformers: ['toString']
                },
                message: {},
                data: {
                    transformers: ['json_u', 'cl_gray']
                }
            }
        }
        );
    Formatter
        .register(
            'DETAILED',
            '{time} {user} {channel} - {level} - {message} {data}', {
            props: {
                time: {
                    transformers: ['toLocaleDate', 'lbl_cyan']
                },
                user: {
                    transformers: ['cl_gray']
                },
                level: {
                    transformers: ['toString']
                },
                data: {
                    transformers: ['json', 'cl_gray']
                },
                channel: {},
                message: {},
            }
        }
        );
    Formatter
        .register(
            'MINIMAL',
            '{channel} - {message}', {
            props: {
                message: {},
                channel: {},
            }
        }
        );
};

module.exports = plugin;