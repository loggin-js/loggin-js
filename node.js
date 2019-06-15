const LogginJS = require('./lib/index');

const additionalNotifiers = require('./plugins/additional-notifiers');
const additionalLoggers = require('./plugins/additional-loggers');
const additionalSeverities = require('./plugins/additional-severities');
const additionalFormatters = require('./plugins/additional-formatters');


LogginJS.use(additionalNotifiers);
LogginJS.use(additionalLoggers);
LogginJS.use(additionalSeverities);
LogginJS.use(additionalFormatters);

module.exports = LogginJS;