const LogginJS = require('./lib/index');

const additionalNotifiers = require('./plugins/additional-notifiers');
const additionalLoggers = require('./plugins/additional-loggers');
const additionalSeverities = require('./plugins/additional-severities');
const additionalFormatters = require('./plugins/additional-formatters');


LogginJS.use(additionalFormatters);
LogginJS.use(additionalSeverities);
LogginJS.use(additionalNotifiers);
LogginJS.use(additionalLoggers);

module.exports = Object.assign(LogginJS.logger('default'), LogginJS);