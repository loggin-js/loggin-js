import { loggin } from './lib/index';

import baseNotifiers from './plugins/base-notifiers';
import baseLoggers from './plugins/base-loggers';
import baseSeverities from './plugins/base-severities';
import baseFormatters from './plugins/base-formatters';

loggin.use(baseFormatters);
loggin.use(baseSeverities);
loggin.use(baseNotifiers);
loggin.use(baseLoggers);

export default Object.assign(loggin, loggin.logger('default'));
