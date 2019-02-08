

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
[docs:notifiers]: https://github.com/nombrekeff/loggin-js/wiki/Notifiers
[docs:formatter]: https://github.com/nombrekeff/loggin-js/wiki/formatters
[docs:formatting]: https://github.com/nombrekeff/loggin-js/wiki/formatting
[docs:Logger]: https://github.com/nombrekeff/loggin-js/wiki/logger
[docs:getLogger]: https://github.com/nombrekeff/loggin-js/wiki/getLogger
[docs:channel]: https://github.com/nombrekeff/loggin-js/wiki/channel
[docs:logger-options]: https://github.com/nombrekeff/loggin-js/wiki/logger-options
[docs:helper:logger]: https://github.com/nombrekeff/loggin-js/wiki/helper-logger
[docs:helper:notifier]: https://github.com/nombrekeff/loggin-js/wiki/helper-notifier
[docs:helper:formatter]: https://github.com/nombrekeff/loggin-js/wiki/helper-formatter
[docs:customizing]: https://github.com/nombrekeff/loggin-js/wiki/customizing

<div align="center">

# Loggin'JS ![](https://img.shields.io/badge/PRs-welcome-green.svg) <!-- omit in toc -->

<!-- ![](./.github/code-example.png) -->

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-badge]][downloads-link]
[![Dependencies][dependencies-badge]][dependencies-link]
[![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities-link]  
[![CircleCI](https://circleci.com/gh/nombrekeff/loggin-js.svg?style=svg)](https://circleci.com/gh/nombrekeff/loggin-js)
[![build status][travis-image]][travis-url]
[![NPM quality][code-quality-badge]][code-quality-link]  
  

<!-- 
[`🔗 Logger`][docs:logger]
[`🔗 Level`][docs:severity]
[`🔗 Channel`][docs:channel]
[`🔗 Formatter`][docs:formatter]
[`🔗 Notifier`][docs:notifiers]
[`🔗 Options`][docs:logger-options] -->

<p>
A little customizable logger for NodeJS.  
Log to the <b>console</b>, to a <b>file</b>, to a <b>remote service</b> or create a custom one.
</p>
</div>

****

## Bump to `v1.x`
> Reasons of the bump were primarly design changes in the **API**, and the change in the formatting library, now: [strif](https://github.com/nombrekeff/strif)  
> **!NOTICE!** Api not compatible with v0.x

Hopefully the bump to version `v1.x` is an improvement over the old **API** an the general cohesion of the library, here are some features and changes:
* Made a bit more straight forward
* Made more comprensible
* Made more composable
* Better typing

## Table Of Content <!-- omit in toc -->
- [Bump to `v1.x`](#bump-to-v1x)
- [Features](#features)
- [Installing](#installing)
- [Importing](#importing)
- [Usage](#usage)
  - [Creating loggers](#creating-loggers)
  - [Configuring loggers](#configuring-loggers)
    - [Formatting](#formatting)
  - [Adding notifiers](#adding-notifiers)
  - [Modifying options](#modifying-options)
  - [Setting severity](#setting-severity)
  - [Custom Notifiers/Formatters/...](#custom-notifiersformatters)
- [Examples](#examples)
  - [Simple example](#simple-example)
  - [Advanced example](#advanced-example)
- [Collaborating](#collaborating)

## Features
* ✔︎ Easy 
* ✔︎ Customizable
* ✔︎ Liteweighted

## Installing
With npm
```bash
npm install loggin-js -s
```

With yarn
```bash
yarn install loggin-js
```

## Importing
Importing in node:
```js
const logging = require('loggin-js');
```

Importing using ES6 import:
```js
import logging from 'loggin-js';
```



## Usage
### Creating loggers
The simplest way of creating a logger is by using the `.logger` method wich creates a logger based on some arguments.  

By default if **no arguments** are passed in it will return a logger with a **console notifier** attached,   
and a level of **DEBUG** _(check [this][docs:severity] for more info)_, this means it will output all logs to the console.
```js
loggin.logger();
```

You can also pass in a **string** representing the name of a [premade logger][docs:premades:loggers],  
for example the following code will return a logger with a **file** notifier attached instead:
```js
loggin.logger('file');
```

Alternatively you can pass in an **object** with a set of options to generate a logger,  
this example will return a logger with two notifers and set to level **INFO**:
```js
loggin.logger({
  level: 'INFO',
  notifiers: [fileNotifier, consoleNotifier]
});
```
> **Notice** you can add, remove and change the notifiers after creating them

Check [this]() for docs for options and premades


### Configuring loggers
Now let's see how you could **configure** your logger a bit. Mostly every aspect of loggin-js is configurable or editable, there are also a set of **premade** instances of all common utilities, like formatters, loggers, etc...  
For example, you could create a logger by passing in some set of options `loggin.logger({})` or by selecting a premade one `loggin.logger('console')`, this is true for [`logger`, `notifier`, `severity`, `formatter`]

#### Formatting
Internally **loggin-js** uses [strif](https://github.com/nombrekeff/strif) for template procesing, check it out for more details on how to create [your own templates][docs:formatting].  

**Basic Example:**
Create a formatter using the 'formatter' helper function, you can pass in a string representing a premade formatter, or a [`strif.Template`]():
```js
const formatter = loggin.formatter('minimal');
logger.formatter(formatter);

logger.debug('A cool message');
```
**Should output:**
```zsh
$ example.js - A cool message
```

### Adding notifiers
You can also specify one or more [**notifiers**][docs:notifiers], wich could log to a **file**, 
to the **console**, to a remote service or some other custom notifier.

The **easiest** way of creating logger is by using the `.notifier` function:
```js
const consoleNotif = loggin.notifier('console', { level: 'debug' });
consoleNotif.color(true);
```

**Alternatively** you can also use the available class `.Notifier.File` to create a logger: 
```js
const fileNotif = new loggin.Notifier.Console({ level: 'DEBUG' });
```

With **file notifiers** you can specify where to send the logs based on some [Severity][docs:severity] using the `.pipe` method:
```js
fileNotif.pipe(Severity.ERROR, 'logs/error-logs.log');
fileNotif.pipe(Severity.DEBUG, 'logs/debug-logs.log');
```

You can add them to the logger like this:
```js
// Adds logger
logger.notifier(consoleNotif, fileNotif);

// Overwrites all loggers
logger.setNotifers([consoleNotif, fileNotif]);
```
Above logger will send every log through both notifiers:
* **consoleNotif** will log everything to the console
* **fileNotif** will log **ERROR** logs to file `logs/error-logs.log` and everything to `logs/debug-logs.log`


### Modifying options
After creating the logger we can change most of the options, like the [**level**][docs:severity], the [**channel**][docs:channel], etc... For example:
```js
const logger = loggin.logger();

logger
  .level('DEBUG')
  .color(true)
  .channel('super-app');

logger.debug('A cool message');
```
****
> ### ! NOTICE !
> Take into account that all **Logger** configuration methods propagate to all the **Notifiers** it has.
> If you just want to afect one notifier, you must have created it yourself and passed it into the logger.
****


### Setting severity
We can set a level in three ways:
1. Passing a string ([info][docs:severity]): 
    ```js
    logger.level('DEBUG');
    ```
2. Passing an int ([info][docs:severity]): 
    ```js
    logger.level(9);
    ```
3. Using `loggin.severity` function:
    ```js
    logging.level(loggin.severity('INFO'));
    ```

### Custom Notifiers/Formatters/...
You can create you own Notifiers and Formatters and more, just check [this][docs:customizing] out!

## Examples
You can configure almost every aspect of the logger, you can customize the [format][docs:formatter] of your logs, the output channel ([Notifiers][docs:notifiers]), what logs are output ([Severity][docs:severity]), etc... Here are some examples.

### Simple example
The easiest way of creating a logger is by using the [`.logger`][docs:helper:logger] method.  

[`.logger`][docs:helper:logger] can return several **pre-configured types** of loggers or it lets you **construct you own**. But let's make it simple for now, 
let's create the most simple logger posible:
```js
// Call `.logger` and boom, you are rollin' ;)
const logger = loggin.logger();

// Now you can start loggin'
logger.info('A good message');
logger.error('Not so good, eh?', null, 'other-channel');
```
By default `.logger()` will return a logger set to [level][docs:severity] **DEBUG** with a **detailed** [formatter][docs:formatter],  
wich would output something similiar to this through the **console**:
```zsh
$ 2018-06-02 root example.js - INFO - A good message
$ 2018-06-02 root other-channel - ERROR - Not so good, eh?
```
> It will show colored output by default!


### Advanced example




## Collaborating
Pull requests are welcome, as well as any other type of contribution. 

## Setting up <!-- omit in toc -->
```zsh
# clone the repo
$ git clone git@github.com:nombrekeff/loggin-js.git

# enter the project
$ cd loggin-js

# install dependencies
$ npm install

# run tests
$ npm test
```

[RFC3164]: https://tools.ietf.org/html/rfc3164
