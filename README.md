

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
[docs:Logger]: https://github.com/nombrekeff/loggin-js/wiki/logger
[docs:getLogger]: https://github.com/nombrekeff/loggin-js/wiki/getLogger
[docs:channel]: https://github.com/nombrekeff/loggin-js/wiki/channel
[docs:logger-options]: https://github.com/nombrekeff/loggin-js/wiki/logger-options
[docs:helper:logger]: https://github.com/nombrekeff/loggin-js/wiki/helper-logger
[docs:helper:notifier]: https://github.com/nombrekeff/loggin-js/wiki/helper-notifier
[docs:helper:formatter]: https://github.com/nombrekeff/loggin-js/wiki/helper-formatter

<div align="center">

<h1>Loggin'JS</h1>

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

## Table Of Content <!-- omit in toc -->
- [Bump to `v1.x`](#bump-to-v1x)
- [Features](#features)
- [Get-Started](#get-started)
- [Usage](#usage)
  - [Importing](#importing)
  - [Examples](#examples)
    - [Simple example](#simple-example)
  - [Customizing the formatter](#customizing-the-formatter)
  - [Adding notifiers](#adding-notifiers)
  - [Modifying options](#modifying-options)
  - [Collaborating](#collaborating)

## Bump to `v1.x`
> Reasons of the bump were primarly design changes in the **API**, and the change in the formatting library, now: [strif](https://github.com/nombrekeff/strif)  
> **!NOTICE!** Api not compatible with v0.x

Hopefully the bump to version `v1.x` is an improvement over the old **API** an the general cohesion of the library, here are some features and changes:
* Made a bit more straight forward
* Made more comprensible
* Made more composable


## Features
* ✔︎ Easy 
* ✔︎ Customizable
* ✔︎ Liteweighted

## Get-Started
* Install with npm
```bash
npm install loggin-js --save
```

* Test it works, and see how it looks:
```bash
node run examples/basic-example.js
```

## Usage
### Importing
```javascript
// Require the logging library
const logging = require('loggin-js');
```

### Examples
You can configure almost every aspect of the logger, you can customize the [format][docs:formatter] of your logs, the output channel a.k.a ([Notifiers][docs:notifiers]), what logs are output ([Severity][docs:severity]), etc... Here are some examples.

#### Simple example
The easiest way of creating a logger is by using the [`.logger`][docs:helper:logger] method.  
It can return several types and pre-configured loggers, but let's make it simple for now,  
let's create the most simple logger posible:
```js
// You know the drill, import the lib
const loggin = require('loggin-js');

// create a logger making use of '.logger'
// and boom, you are rolling! ;)
const logger = loggin.logger();

// now you can cut some wood!
logger.info('A good message');
logger.error('Not so good, eh?');
```
By default `.logger()` will return a logger set to [level][docs:severity] **DEBUG** with a **detailed** [formatter][docs:formatter],  
wich would output something like this through the **console**:
```zsh
$ [2018-06-02 00:46:24 root] - example.js - DEBUG - A cool message
```

### Customizing the formatter
Now let's see how you could configure your logger a bit. Internally **loggin-js** uses [strif](https://github.com/nombrekeff/strif) for template procesing, check it out for more details on how to create you own templates.  

For the moment, let's create a logger that only logs the channel and the message of the log,  
for this you could do the following:
```js
const logger = loggin.logger();

// Create a formatter using the 'formatter' helper function,  
// internally it uses 'strif' for templating
const formatter = loggin.formatter('[{channel}] {message}');

// now set the formatter
logger.formatter(formatter);
```
Should output:
```zsh
$ [example.js] A cool message
```

### Adding notifiers
You can also specify one or more [**notifiers**][docs:notifiers], wich could log to a **file**, 
to the **console**, to a remote service or some other custom notifier:
```js
const logger = loggin.logger();

// Easiest way is by using the 'notifier' helper function
const consoleNotif = loggin.notifier('console', { level: 'debug' });

// You can also use the available class
const fileNotif = new loggin.Notifier.File({});
// with file notifiers you can specify where to pipe the logs 
// based on some severity using the 'pipe' method
fileNotif.pipe(Severity.ERROR, 'logs/error-logs.log');
fileNotif.pipe(Severity.DEBUG, 'logs/debug-logs.log');

// Now add them both to the logger
logger.notifier(consoleNotif, fileNotif);
```
Above logger will send every log through both notifiers:
* **consoleNotif** will log everithing to the console
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

### Collaborating
Hi there, if you like the project don't hesitate in collaborating (_if you like to_), submit a pull request, post an issue, ...   
It's just a little sideproject, nothing serius, so its just for fun!  
But any **help** or **ideas** are apreciated!


[RFC3164]: https://tools.ietf.org/html/rfc3164
