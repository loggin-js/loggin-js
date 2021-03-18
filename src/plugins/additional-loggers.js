
function plugin(loggin) {
    const { Logger } = loggin;

    Logger.registry
        .register('default', 'Console')
        .register('console', 'Console')
        .register('file', 'File')
        .register('http', 'Http')
        .register('memory', 'Memory');
};

module.exports = plugin;