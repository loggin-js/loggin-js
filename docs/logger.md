## Loggin.Loggers.Logger
The class in charge of managing the [severities](/nombrekeff/-js/wiki/Severity) and sending the logs to the [notifiers](/nombrekeff/logging-js/wiki/Notifier).  
Also there are a set of existing loggert, they all extend from the **Logger** class, and are available from: `Logging.Loggers.Logger`.

### Signature
  * constructor(`notifier, options?`)
    * `notifier` [**Notifier**](/docs/Notifier.md) - #required
    * `options?` **Object**
      * `level:Severity`  

### Methods
#### setLevel(`level:Severity`): self
#### getLevel(): Severity
#### setColor(`val:boolean`): self
#### canLog(`level:Severity`): boolean
#### log(`message, data?, severity?, channel?, time?, user?`): self
* `message:string`
* `data:any`
* `level:Severity` #defaults to [Severity](/docs/Severity.md).DEBUG
* `channel:number`
* `time:Date` #defaults to current date
* `user:string`
#### debug(`message, data?, channel?`): self
#### warning(`message, data?, channel?`): self
#### alert(`message, data?, channel?`): self
#### emergency(`message, data?, channel?`): self
#### error(`message, data?, channel?`): self
#### info(`message, data?, channel?`): self