# Loggin' JS

![Preview](https://github.com/nombrekeff/loggin-js/blob/master/examples/example-output-formater.PNG?raw=true)

[![Build Status](https://semaphoreci.com/api/v1/nombrekeff/loggin-js/branches/master/shields_badge.svg)](https://semaphoreci.com/nombrekeff/loggin-js)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2ffe3b2f71c74210987436b935c06720)](https://www.codacy.com/app/manoloedge96/loggin-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nombrekeff/loggin-js&amp;utm_campaign=Badge_Grade)
[![npm](https://img.shields.io/npm/dt/loggin-js.svg)](https://www.npmjs.com/package/loggin-js)
[![David](https://img.shields.io/david/nombrekeff/loggin-js.svg)](https://david-dm.org/nombrekeff/loggin-js?view=tree)  

[![NPM](https://nodei.co/npm/loggin-js.png)](https://nodei.co/npm/loggin-js/)
[![Twitter Follow](https://img.shields.io/twitter/follow/keff39006469.svg?style=social&label=Follow)](https://twitter.com/intent/user?screen_name=keff39006469)  


A little customizable logger for NodeJS.  
Log to the **console**, to a **file**, to a **remote service** or create a custom one.
> Based on standard **RFC3164**

### References
* [Get started](https://github.com/nombrekeff/logging-js/wiki/Get-Started)
* [Basic Usage](https://github.com/nombrekeff/logging-js/wiki/Basic-Usage)
* [Wiki](https://nombrekeff.github.io/loggin-js/)
* [Examples](/examples)
* [Collaborating](#Collaborating)


### Get-Started
* Install with npm
```bash
npm install loggin-js --save
```

* Test it works, and see how it looks:
```bash
node run examples/basic-example.js
```

* Using in node
```javascript
// Require the logging library
const logging = require('loggin-js');
```

### Basic-Usage
##### Basic Example
In this example we create a new logger with a severity of DEBUG, and we set color to true.  
This means it will output any log to the console as DEBUG englobes all other severities

We create it making use of the `logging.getLogger(options?)` method that creates a logger based on the options.  
_There are other ways of creating a Logger as described in the examples and docs_

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


##### File Logging Example
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

##### Custom Formatter Example
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


### Collaborating
Hi there, if you like the project don't hesitate in collaborating (_if you like to_), submit a pull request, post an issue, ...   
It's just a little sideproject, nothing serius, so its just for fun!  
But any **help** or **ideas** are apreciated!
