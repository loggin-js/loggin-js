
function plugin(loggin) {
    const { Formatter } = loggin;

    Formatter['JSON'] = Formatter._formatters['JSON'] = {
        formatLog: (log) => JSON.stringify(log),
        color: (log) => log,
    }

    Formatter
        .register(
            'SHORT',
            '[{time}] - {level} - {message}', {
                props: {
                    time: {
                        transformers: ['date'],
                    },
                    level: {
                        transformers: ['string']
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
                        transformers: ['date']
                    },
                    level: {
                        transformers: ['string']
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
                        transformers: ['date', 'cl_blue']
                    },
                    user: {
                        transformers: ['cl_gray']
                    },
                    level: {
                        transformers: ['string']
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
                        transformers: ['date', 'lbl_cyan']
                    },
                    user: {
                        transformers: ['cl_gray']
                    },
                    level: {
                        transformers: ['string']
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