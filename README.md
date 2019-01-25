# Loggin' JS <!-- omit in toc -->

[![NPM version][npm-image]][npm-url]
[![NPM quality][code-quality-badge]][code-quality-link]
[![Quality](https://img.shields.io/codacy/grade/2ffe3b2f71c74210987436b935c06720.svg?style=flat-square)]()
[![build status][travis-image]][travis-url]
[![Downloads][downloads-badge]][downloads-link]
[![Dependencies][dependencies-badge]][dependencies-link]
[![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities-link]


<!-- Links -->
[npm-image]: https://img.shields.io/npm/v/loggin-js.svg?style=flat-square
[npm-url]: https://npmjs.org/package/loggin-js

[travis-image]: https://img.shields.io/travis/nombrekeff/loggin-js.svg?style=flat-square
[travis-url]: https://travis-ci.org/nombrekeff/loggin-js

[code-quality-badge]: http://npm.packagequality.com/shield/loggin-js.svg?style=flat-square
[code-quality-link]: https://packagequality.com/#?package=loggin-js

[downloads-badge]: https://img.shields.io/npm/dt/loggin-js.svg?style=flat-square
[downloads-link]: https://www.npmjs.com/package/loggin-js

[dependencies-badge]: https://img.shields.io/david/nombrekeff/loggin-js.svg?style=flat-square
[dependencies-link]: https://david-dm.org/nombrekeff/loggin-js?view=tree

[vulnerabilities-badge]: https://snyk.io/test/npm/loggin-js/badge.svg?style=flat-square
[vulnerabilities-link]: https://snyk.io/test/npm/loggin-js

[docs:severity]: https://github.com/nombrekeff/loggin-js/wiki/Severity

A little customizable logger for NodeJS.  
Log to the **console**, to a **file**, to a **remote service** or create a custom one.

### Features <!-- omit in toc -->
* ✔︎ Easy 
* ✔︎ Customizable
* ✔︎ Liteweighted

### Table Of Content <!-- omit in toc -->
- [Installing](#installing)
- [Usage](#usage)
  - [Using in node](#using-in-node)
  - [Using in express](#using-in-express)
  - [Wiki](./loggin-js/wiki)
- [Examples](#examples)
  - [Simplest Example](#simplest-example)
  - [Full Example](#full-example)
  - [File Logging Example](#file-logging-example)
  - [Custom Formatter Example](#custom-formatter-example)
- [Found a bug?](#found-a-bug)
- [Collaborating](#collaborating)


### Installing
* Install with npm
```bash
npm install loggin-js --save
```

### Usage
#### Using in node
```javascript
// Require the logging library
const logging = require('loggin-js');
```
Check the [wiki](./loggin-js/wiki) for more in depth documentation.

#### Using in express
Check [this](https://github.com/nombrekeff/express-loggin-js) other repo for better integration with express. 

### Examples
#### Simplest Example
The fastest way of creating a logger is by using the `.getLogger` method wich creates a logger based on some options.  
Based on those options it will create one of [**ConsoleLogger**, **FileLogger**, **RemoteLogger**] __explained below_.  
Here is a little example:
```js
const logging = require('loggin-js');
const logger = loggin.getLogger({ channel: 'my-cool-app' });

logger.debug('User is loggin in');
```

Now let's check the `.getLogger` method a bit more in depth.  
All `Loggers` and `.getLogger` accept what is called a `Severity` **level**, wich is used internally for filtering and managing log output. You can check more info about Severities [here]().  

We can set a level in three ways:
1. Passing a string ([info][docs:severity]): 
    ```js
    logger.getLogger({ level: 'DEBUG' })
    ```
1. Passing an int ([info][docs:severity]): 
    ```js
    logger.getLogger({ level: 9 })
    ```
3. Passing a severity instance ([info][docs:severity]): 
    ```js
    const { Severity } = logging;
    logging.getLogger({ level: Severity.DEBUG });
    ```

You can also pass a set of options, like setting colored output, changing the format, and more.


#### Full Example
```javascript
// Require the logging library
const logging = require('loggin-js');

// Shortcuts
const { Severity } = logging;

// Get a logger with DEBUG severity. 
// Severity DEBUG will output any severity.
const logger = logging.getLogger({
  
  // level can be a <string> = 'DEBUG' a <int> = 7 or a <Severity> = Severity.DEBUG 
  level: 'DEBUG',

  // If output should be colored
  color: true,

  // Set formatter to medium - one of: ['short', 'medium', 'long']
  formatter: 'medium',
});

// Does the same as passing into settings, as done above
logger.setLevel(Severity.DEBUG);
logger.setColor(true);
logger.setFormatter('medium');


// Available predefined log levels
logger.info('info', { user: 'pedro', id: 10 });
logger.error('error');
logger.warning('warning');
logger.alert('alert');
logger.emergency('emergency');
logger.critical('critical');
logger.debug('debug');
logger.notice('Notice', {}, 'channel');


// If enabled set to false logs will not be output
logger.setEnabled(false);
```


#### File Logging Example
Log to files instead of the console

We create it making use of the `FileLogger` class.  
```javascript
// Require the logging library
const logging = require('loggin-js');

// Shortcut for the severity constants
const { Severity, Loggers, Notifiers } = logging;

// Create a file logger
const logger = new Loggers.FileLogger({
  
  // Display line number at the begining of the log 
  lineNumbers: true,

  // You can pass a pipes array to the file logger or you can do after instancing (showed below)
  pipes: [

    // Here we create a pipe that will pipe level ERROR logs to the file 'logs/error-logs.log'
    new Notifiers.Pipe(Severity.ERROR, 'logs/error-logs.log'),

    // This one will pipe level INFO logs to the file 'logs/info-logs.log'
    new Notifiers.Pipe(Severity.INFO, 'logs/info-logs.log')
  ]
});

// You can also add pipes after creating the logger as follows
logger.pipe(Severity.ERROR, 'logs/error-logs.log');
logger.pipe(Severity.INFO, 'logs/info-logs.log');


// INFO message will log to 'logs/info-logs.log'
logger.info('Logging a info log');

// ERROR message will log to 'logs/error-logs.log'
logger.error('Logging a error log', new Error('An error'));

// Will not be logged as only the ERROR and INFO severities will be output to their respective files
logger.warning('Logging a warning log');
logger.notice('Logging a notice log');
logger.alert('Logging a error log');
```

#### Custom Formatter Example
Custom formatter, customize the output of the log 
```javascript
const logging = require('loggin-js');
const logger = logging.getLogger({
  level: logging.Severity.DEBUG,
  color: true,

  /**
   * You can also use a custom formatter if the default one does not satisfy your needs.
   * In the formatter you can access all log properties and you can also set the 
   * color of some segments of the log by using <%L> where L is one of:
   *  - r red
   *  - g green
   *  - gr gray
   *  - b blue
   *  - p pink
   *  - y yellow
   *  - c cyan
   *  - m magenta
   *  - (nnn) a number between 0-255 # not implemented yet
   */
  formatter: '[{time.toLocaleString}] - <%m{user}> | {severityStr} | {message} - {JSON.stringify(data)}'
});

// Set user to root
logger.setUser('root');

// Set formatter
logger.setFormatter('[{time.toLocaleString}] - <%m{user}> | {severityStr} | {message} - {JSON.stringify(message)}');

// Log something
logger.debug('debug');             // $ [2018-6-2 00:46:24] - root - DEBUG - debug
logger.info('info', {data: 'Hi'}); // $ [2018-6-2 00:46:24] - root - INFO - info - {"data":"Hi"}


/**
 * Aditionally you can set the color of some parts of the message:
 * The output will be something like, with the last ERROR beeing red:
 * $ [2018-6-2 00:46:24] - root - ERROR - There was an ERROR 
 */
logger.error('There was an <%rERROR>'); 
```

### Found a bug?
If you found a **bug** or like to leave a **feature request**, please [leave an issue](https://github.com/nombrekeff/express-loggin-js/issues/new/choose) and we will take care of it.
> Just make sure it's not already filed.


### Collaborating
Hi there, if you like the project don't hesitate in collaborating (_if you like to_), submit a pull request, post an issue, ...   
Any **help** or **ideas** are apreciated!


[RFC3164]: https://tools.ietf.org/html/rfc3164
