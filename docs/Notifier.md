## Documentation for Loggin' JS Notifier
> Its in charge of formating the log through a Formatter and processing the Log

### Logging.Notifier
##### Signature
  * constructor(`options?:object`)
    * `options`
      * `level:Severity` 
      * `color:boolean` 
      * `formatter:Formatter` 

##### Methods
  * setLevel(`severity:Severity`): `self`
  * setColor(`val:boolean`): `self`
  * notify(`log:Log`): `self`

##### Static Constants - Instances of `Logging.Severity`
* `Logging.Severity.EMERGENCY`
* `Logging.Severity.ALERT`
* `Logging.Severity.CRITICAL`
* `Logging.Severity.ERROR`
* `Logging.Severity.WARNING`
* `Logging.Severity.NOTICE`
* `Logging.Severity.INFO`
* `Logging.Severity.DEBUG`
