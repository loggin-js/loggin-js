## Documentation for LoggingJS's Severity
##### Follows the standard RFC3164 code (https://tools.ietf.org/html/rfc3164)

> Each log **Priority** has a decimal **Severity** level indicator.
> These are described in the following table along with their numerical
values.
```yml
    Severity  Priority
  -----------------------------------------------------
    0         Emergency:   system is unusable
    1         Alert:       action must be taken immediately
    2         Critical:    critical conditions
    3         Error:       error conditions
    4         Warning:     warning conditions
    5         Notice:      normal but significant condition
    6         Information: informational messages
    7         Debug:       debug-level messages
```


First of all let me explain what exactly are **Severities** in **LoggingJS** apart of clasifing logs.
* Internally they are used to output the corresponding logs that match that **Severity**. What do I mean? 
  * Let's put this sample code:
  ```js
    const logging = require('logging-js');
    const Severity = logging.Severity;

    const logger = logging.getLogger({ 
      level: Severity.INFO // Severity set to INFO<6> 
    });

    logger.info('info');       // Will be logged
    logger.error('error');     // Will not be logged
    logger.warning('warning'); // Will not be logged
    logger.alert('alert');     // Will not be logged
  ``` 
  * First of all we get a logger with **Severity** `INFO` _(only `INFO` level logs will be output)_
  * Then we dispatch some logs, only the `info` one will be output to the notifier(_in this case console_)
  * If `level = Severity.ERROR` all the logs that match `ERROR` severity will be logged
  * If `level = Severity.WARNING` all the logs that match `WARNING` severity will be logged
  * But if its set to `level = Severity.DEBUG` it will log every severity

### Logging.Severity
##### Signature
  * constructor(`level:number, name:string, englobes? = [], fileLogginLevel?`)
    * `level` **Number** - #required
    * `name` **String** - #required
    * `englobes` **String[]** - #optional - in development
    * `fileLoggingLevel` ????

##### Methods
  * canLogSeverity(`severity:Severity`): `void`
    * It can log if it englobes that Severity 
  * getFileLoggingLevel(`severity`): `Severity`
  * toString(): `String`
  * valueOf(): `Number`

##### Static Constants - Instances of `Logging.Severity`
* `Logging.Severity.EMERGENCY`
* `Logging.Severity.ALERT`
* `Logging.Severity.CRITICAL`
* `Logging.Severity.ERROR`
* `Logging.Severity.WARNING`
* `Logging.Severity.NOTICE`
* `Logging.Severity.INFO`
* `Logging.Severity.DEBUG`
