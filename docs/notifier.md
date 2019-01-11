## Logging.Notifier
Its in charge of formating the log through a [Formatter](/Formatter) and processing the [Log](/Log)

### Signature
  * constructor(`options?:object`)
    * `options`
      * `level:Severity` 
      * `color:boolean` 
      * `formatter:Formatter` 

### Methods
#### setLevel(`severity:Severity`): `self`
#### setColor(`val:boolean`): `self`
#### notify(`log:Log`): `self`

### Available Premade Notifiers
#### [ConsoleNotifier](./notifiers/notifiers.md#consolenotifier)
#### [FileNotifier](./notifiers/notifiers.md#filenotifier)
#### [RemoteNotifer](./notifiers/notifiers.md#remotenotifier)

