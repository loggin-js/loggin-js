## Documentation for LoggingJS's Severity
##### A set of premade Loggers

> The class en charge of managing the severities and sending the logs to the notifiers. They all extend from the **Logger** class available at: `Logging.Loggers.Logger`.

### Logging.Loggers.Logger
##### Signature
  * constructor(`notifier, options?`)
    * `notifier` **Notifier** - #required
    * `options?` **Object**

##### Methods
  * setLevel(`level`): self
  * getLevel(): Severity
  * setColor(`color`): self
  * canLog(`severity`): boolean
  * log(`message, data, severity, channel, time, user`): self
  * debug(`message, data, channel`): self
  * warning(`message, data, channel`): self
  * alert(`message, data, channel`): self
  * emergency(`message, data, channel`): self
  * error(`message, data, channel`): self
  * info(`message, data, channel`): self
