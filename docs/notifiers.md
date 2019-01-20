##  ConsoleNotifier
### 💻 Logging.Notifiers.ConsoleNotifier
A premade Notifier wich logs the output to the console.

##### Signature
  * constructor(`options?`)
    * `options?` **Object**
      * `level:Severity`  

##### Methods
  * output(`level:Severity`): self
  * Extends (Notifier)[https://github.com/nombrekeff/loggin-js/wiki/Notifier]


## FileNotifier
### 📄 Logging.Notifiers.FileNotifier
A premade [Notifier](https://github.com/nombrekeff/loggin-js/wiki/Notifier) wich logs the output to a set of files. Pipe severities to a file.  
Check this [example](https://github.com/nombrekeff/logging-js/blob/master/examples/file-logging.js) for more detail.

##### Signature
  * constructor(`options?`)
    * `options?` **Object**
      * `level:Severity`  
      * `formatter:string` 
      * `filepath:string`
      * `pipes:Pipe[]`
##### Methods
  * output(`level:Severity`): self
  * pipe(`level:Severity`, `filepath:string`): self
  * getFile(`level:Severity`): self
  * getPipe(`level:Severity`): self
  * Extends [Notifier](https://github.com/nombrekeff/loggin-js/wiki/Notifier)


## RemoteNotifer
### 📡 Logging.Notifiers.RemoteNotifer
A premade [Notifier](https://github.com/nombrekeff/loggin-js/wiki/Notifier) wich logs the output to a set of files. Pipe severities to a file.  
Check this [example](https://github.com/nombrekeff/logging-js/blob/master/examples/remote-logger.js) for more detail.

##### Signature
  * constructor(`options?`)
    * `options?` **Object**
      * `host:string`  
      * `port:number|string` 
      * `headers:Object` 

##### Methods
  * output(`level:Severity`): self
  * Extends [Notifier](https://github.com/nombrekeff/loggin-js/wiki/Notifier)