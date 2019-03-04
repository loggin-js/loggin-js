
## Examples for Loggin'JS
A list of some usage examples 

### Code Examples
* [Basic Example](https://github.com/nombrekeff/logging-js/blob/master/examples/basic-example.js)
* [Only log one severity](https://github.com/nombrekeff/logging-js/blob/master/examples/log-info.js)
* [Logging to a file](https://github.com/nombrekeff/logging-js/blob/master/examples/file-logging.js)
* [Logging Remotely](https://github.com/nombrekeff/logging-js/blob/master/examples/remote-logger.js)
* [Custom Logger](https://github.com/nombrekeff/logging-js/blob/master/examples/custom-logger)


### Simplest Example
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


<!-- In this example we create a new logger with a severity of DEBUG (a severity is just the level of the log), and we set color to true.  
This means it will output any log to the console as DEBUG englobes all other severities

We create it making use of the `logging.getLogger(options?)` method that creates a logger based on the options.  
_There are other ways of creating a Logger as described in the examples and docs_ -->


### Full example
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


### File Logging Example
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

### Custom Formatter Example
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



