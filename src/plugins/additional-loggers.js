
function plugin(loggin) {
    const { Logger } = loggin;

    Logger.register('console', 'Console');
    Logger.register('file', 'File');
    Logger.register('remote', 'Remote');
    Logger.register('memory', 'Memory');
};

module.exports = plugin;