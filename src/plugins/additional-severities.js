
function plugin({ severityRegistry }) {
    severityRegistry
        .register(0, 'EMERGENCY')
        .register(1, 'ALERT')
        .register(2, 'CRITICAL')
        .register(3, 'ERROR')
        .register(4, 'WARNING')
        .register(5, 'NOTICE')
        .register(6, 'INFO')
        .register(7, 'DEBUG')
        .register(7, 'DEFAULT')
        .register(8, 'SILLY');
};

module.exports = plugin;