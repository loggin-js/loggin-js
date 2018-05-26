## Loggin' JS - Docs
A logger similar to the [one used in python](https://docs.python.org/2/library/logging.html) for NodeJS.

> Based on standard RFC3164

[![npm version](https://badge.fury.io/js/loggin-js.svg)](https://badge.fury.io/js/loggin-js)
[![CircleCI](https://circleci.com/gh/nombrekeff/logging-js/tree/master.svg?style=svg)](https://circleci.com/gh/nombrekeff/logging-js/tree/master)

### References
* [Get started](#Get-Started)
* [Basic Usage](#Basic-Usage)
* [Loggers](/docs/Logger.md)
* [Notifiers](/docs/Notifier.md)
* [Severity](/docs/Severity.md)
* [Examples](/docs/Examples.md)


### Get-Started
* Install with npm
```bash
npm install loggin-js --save
```

* Using in node
```js
// Require the logging library
const logging = require('loggin-js');
```

### Basic-Usage
##### Basic Example
In this example we create a new logger with a severity of DEBUG, and we set color to true.  
This means it will output any log to the console as DEBUG englobes all other severities

We create it making use of the `logging.getLogger(options?)` method that creates a logger based on the options.  
_There are other ways of creating a Logger as described in the examples and docs_

```js
// Require the logging library
const logging = require('loggin-js');

// Shortcuts
const { Severity } = logging;

// Get a logger with DEBUG severity. 
// Severity DEBUG will output any severity.
const logger = logging.getLogger({
  level: Severity.DEBUG,
  color: true
});

// Does the same as passing into settings, as done above
logger.setLevel(Severity.DEBUG);
logger.setColor(true);


// Available predefined log levels
logger.info('info', { user: 'pedro', id: 10 });
logger.error('error');
logger.warning('warning');
logger.alert('alert');
logger.emergency('emergency');
logger.critical('critical');
logger.debug('debug');
logger.notice(['notice', 'notice']);


// If enabled set to false logs will not be output
logger.setEnabled(false);
```





<!-- ### Loggers
#### ConsoleLogger
Logs to the console.
* Extends from [Logger](#Logger)

#### FileLogger
Logs to one or more files, depending on configuration.
* Extends from [Logger](#Logger)

#### RemoteLogger
Logs to some remote service.
* Extends from [Logger](#Logger)

#### Logger
* .log(message: `string`, data: `any`, severity: [`Severity`](#Severity), channel: `string`)
* .debug(message: `string`, data: `any`, channel: `string`) | Severity.DEBUG
* .warning(message: `string`, data: `any`, channel: `string`) | Severity.WARNING
* .alert(message: `string`, data: `any`, channel: `string`) | Severity.ALERT
* .emergency(message: `string`, data: `any`, channel: `string`) | Severity.EMERGENCY
* .error(message: `string`, data: `any`, channel: `string`) | Severity.ERROR
* .info(message: `string`, data: `any`, channel: `string`) | Severity.INFO -->
