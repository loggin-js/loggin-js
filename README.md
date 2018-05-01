## JS Logger - Docs
A logger similar to the [one used in python](https://docs.python.org/2/library/logging.html) for NodeJS.

[![Version](https://img.shields.io/badge/Version-v0.0.1-blue.svg)]()

### References
* [Get started](#Get-Started)
* [Loggers](docs/Loggers.md)
* [Notifiers](docs/Notifiers.md)
* [Severity](docs/Severity.md)
* [Helpers](docs/Helpers.md)


### Get-Started
* Install logging with npm
```bash
npm install logging --save
```

* Using in node
```js
let logging = require('./index');
let Log = logging.Log;

let clogger = logging.getLogger({ level: logging.Severity.DEBUG });
clogger.info('User has sign in');
clogger.debug('user data', { id: '00001', name: "Jhon Doe" });
```

### Loggers
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
* .info(message: `string`, data: `any`, channel: `string`) | Severity.INFO
