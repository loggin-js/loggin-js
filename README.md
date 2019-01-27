

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
[docs:logger]: https://github.com/nombrekeff/loggin-js/wiki/logger
[docs:getLogger]: https://github.com/nombrekeff/loggin-js/wiki/getLogger
[docs:channel]: https://github.com/nombrekeff/loggin-js/wiki/channel
[docs:logger-options]: https://github.com/nombrekeff/loggin-js/wiki/logger-options

<div align="center">

<h1>Loggin'JS</h1>

<p>
A little customizable logger for NodeJS.  
Log to the <b>console</b>, to a <b>file</b>, to a <b>remote service</b> or create a custom one.
</p>

[![CircleCI](https://circleci.com/gh/nombrekeff/loggin-js.svg?style=svg)](https://circleci.com/gh/nombrekeff/loggin-js)  
[![NPM quality][code-quality-badge]][code-quality-link]
[![build status][travis-image]][travis-url]  
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-badge]][downloads-link]
[![Dependencies][dependencies-badge]][dependencies-link]
[![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities-link]

[`🔗 .getLogger`][docs:getLogger]
[`🔗 Logger`][docs:logger]
[`🔗 Level`][docs:severity]
[`🔗 Channel`][docs:channel]
[`🔗 Formatter`][docs:formatter]
[`🔗 Notifier`][docs:notifiers]
[`🔗 Options`][docs:logger-options]
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
  - [Configuring logger](#configuring-logger)
  - [Collaborating](#collaborating)

## Bump to `v1.x`
Bump to version `v1.x` is hopefully an improvement over the old **API** an the general cohesion of the library, here are some features:
* Straight Forward
* Comprensible
* More Composable
* 

> **!NOTICE!** Api not compatible with v0.x

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
#### Simple example
The easiest way of creating a logger is by using the [`.getLogger`][docs:getLogger] method.  
It will return a logger based on the options passed, but let's make it simple for now.

By default it will return a console [**logger**][docs:logger], with a [**level**][docs:severity] of `DEBUG`,   
and the [**channel**][docs:channel] set to the current filename, the channel is just an identifier for the logger.
```js
// You know the drill, import the lib
const loggin = require('loggin-js');

// Create a default logger
const logger = loggin.logger();

// Log a debug message
logger.debug('A cool message');
```
The above would output something like:
```bash
[2018-06-02 00:46:24 root] - example.js - DEBUG - A cool message
```

### Configuring logger

Now let's see how you could configure our logger a bit.
You can customize mostly every aspect of the logger, you can create custom **Formatters**, custom [**Notifier**][docs:notifiers] and change every important [**option**][docs:logger-options] after creating the logger.

For example we can create a custom [**Formatter**][docs:formatter] that prints just the data we want:
```js
const logger = loggin.logger();

const formatter = loggin.formatter('[{channel}] {message} - {data!json}');
logger.formatter(formatter);
```

We can also specify one or more [**notifiers**][docs:notifiers], wich could log to a file, 
to the console, to a remote service or some other custom notifier:
```js
const logger = loggin.logger();

const notifier = new loggin.Notifier.File(opts);
const notifier2 = new loggin.Notifier.Remote(opts);
logger.notifier(notifier, notifier2);
```

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
