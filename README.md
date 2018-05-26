## JS Logger - Docs
A logger similar to the [one used in python](https://docs.python.org/2/library/logging.html) for NodeJS.

[![npm version](https://badge.fury.io/js/loggin-js.svg)](https://badge.fury.io/js/loggin-js)
<!-- [![npm](https://img.shields.io/npm/dw/localeval.svg)](https://www.npmjs.com/package/loggin-js)
[![node](https://img.shields.io/node/v/passport.svg)](https://www.npmjs.com/package/loggin-js) -->

### References
* [Get started](#Get-Started)
* [Loggers](/docs/Logger.md)
* [Notifiers](/docs/Notifier.md)
* [Severity](/docs/Severity.md)
* [Helpers](/docs/Helper.md)
* [Examples](/examples)


### Get-Started
* Install with npm
```bash
npm install loggin-js --save
```

* Using in node
```js
let logging = require('loggin-js');
let Log = logging.Log;

let clogger = logging.getLogger({ level: logging.Severity.DEBUG });
clogger.info('User has sign in');
clogger.debug('user data', { id: '00001', name: "Jhon Doe" });
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
