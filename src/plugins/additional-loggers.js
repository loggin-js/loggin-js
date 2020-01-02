
function plugin(loggin) {
    const { Logger } = loggin;

    Logger.register('console', 'Console');
    Logger.register('file', 'File');
    Logger.register('http', 'Http');
    Logger.register('memory', 'Memory');
};

module.exports = plugin;