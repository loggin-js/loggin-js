
<div align="center">

# Loggin'JS ![](https://img.shields.io/badge/PRs-welcome-green.svg) <!-- omit in toc -->

<!-- ![](./.github/code-example.png) -->

[![NPM Version][npm-image]][npm-url]
[![Downloads][downloads-badge]][downloads-link]
[![Dependencies][dependencies-badge]][dependencies-link]
[![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities-link]  
[![NPM Package Quality][code-quality-badge]][code-quality-link]
[![NPM Package Size][pkg-size-badge]][pkg-size-link]  
  
<p>
An easy and customizable logger for NodeJS and the Browser.  
If you want to log easily or want to create some complex loggin system, this is the tool for you!
</p>



[`🔗 Logger`][docs:logger]
[`🔗 Notifier`][docs:notifier]
[`🔗 Log`][docs:log]
[`🔗 Severity`][docs:severity]
[`🔗 Formatter`][docs:formatter]  
[`🔗 .logger`][docs:helper:logger]
[`🔗 .notifier`][docs:helper:notifier]
[`🔗 .severity`][docs:helper:severity]
[`🔗 .formatter`][docs:helper:formatter]

</div>

****




## Table Of Content <!-- omit in toc -->

<details>
  <summary><a href="#Bump-to-v1x">Bump to <code>v1.x</code></a></summary>

  - [Considerations](#Considerations)
  - [Improvements](#Improvements)
</details>
<details>
  <summary><a href="#Features">Features</a></summary>
</details>
<details>
  <summary><a href="#Installing">Installing</a></summary>
</details>
<details>
  <summary><a href="#Importing">Importing</a></summary>
  
  - [Node](#Node)
  - [ES6 Import](#ES6-Import)
  - [Browser](#Browser)
</details>
<details open>
  <summary><a href="#Getting-Started">Getting Started</a></summary>
  
  - [Creating Loggers](#Creating-loggers)
  - [Configuring Loggers](#Configuring-loggers)
    - [Formatting](#Formatting)
    - [Adding Notifiers](#Adding-notifiers)
    - [Accessing Notifiers](#Accessing-notifiers)
    - [Modifying Options](#Modifying-options)
    - [Setting the Level](#Setting-the-level)
  - [Customizing Notifiers/Formatters/...](#Customizing-NotifiersFormatters)
  - [Ignoring Logs](#Ignoring-Logs)
</details>
<details>
  <summary><a href="#Examples">Examples</a></summary>
  
  - [Simple Example](#Simple-example)
  - [Advanced Example](#Advanced-example)
</details>
<details>
  <summary><a href="#Oficial-plugins">Oficial plugins</a></summary>
</details>
<details>
  <summary><a href="#Migrating-from-v1x">Migrating from <code>v1.x</code></a></summary>
  
  - [Example 1](#Example-1)
  - [Example 2](#Example-2)
</details>
<details>
  <summary><a href="#Contributing">Contributing</a></summary>
</details>

## Bump to `v1.x`
> **!NOTICE! Not Compatible With v0.x**   
> The primary reasons for the bump to `v1.x` were design changes in the **API** _ that made the previous versions incompatible. 
> Also, the change in formatting library; now [strif](https://github.com/nombrekeff/strif).  

### Considerations
* You can still check the old `v0.5.0` source code at branch [v0.5.0](https://github.com/loggin-js/loggin-js/tree/0.5.0).

### Improvements
Hopefully the bump to version `v1.x` is an improvement over the old **API**, and an improvement to the general cohesion of the library.
Here are some features and changes:
* Made a bit more straightforward.
* Made more comprensible.
* Made more composable.
* Better typing.

[back to top](#table-of-content-)
****

## Features
* ✔︎ **Simple**       
* ✔︎ **Customizable** 
* ✔︎ **Lightweight**  - `20.9kb` minzipped

[back to top](#table-of-content-)
****

## Installing
With npm:
```bash
npm install loggin-js
```

With yarn:
```bash
yarn install loggin-js
```

[back to top](#table-of-content-)
****

## Importing
### Node
```js
const loggin = require('loggin-js');
```

### ES6 Import
```js
import loggin from 'loggin-js';
```

### Browser
> ### !! NOTICE !!
> Loggin'JS can be used in the browser, but it's still in it's early stages, and the API may change or have errors. 
> It is also limited. For now, only the `console` notifier works. Color is not working either!

```html
<!-- Import from node_modules -->
<script src="node_modules/loggin-js/dist/loggin.js"></script>

<script>
  LogginJS.logger();
</script>
```

> You can also use a CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/loggin-js@latest/dist/loggin.js"></script>
```

[back to top](#table-of-content-)
****

## Getting Started
The default logger is the simplest way to use Loggin'JS.

```js
const loggin = require('loggin-js');
loggin.debug('Check this log out!!', { foo: 'var' }, { channel: 'Wabalabadubdub!' });
```

Or create a custom logger:
```js
const loggin = require('loggin-js');
const logger = loggin.logger({ channel: 'my-logger' });

loggin.debug('Check this log out!!', { foo: 'var' });
```

Add notifier:
```js
const loggin = require('loggin-js');
const logger = loggin.logger({ channel: 'my-logger' });

loggin.debug('Check this log out!!', { foo: 'var' });
```

### Examples
You can configure almost every aspect of the logger. You can customize the [format][docs:formatter] of your logs, the output channel ([Notifiers][docs:notifier]), what logs are output ([Severity][docs:severity]), etc... 

Check the [`/examples`](/examples) folder for more examples.

### Simple Example
The easiest way to create a logger is by using the [`.logger`][docs:helper:logger] method.  

[`.logger`][docs:helper:logger] can return several **pre-configured types** of loggers, you can **construct you own**. But, let's make it simple for now by 
creating the simplest logger posible:
```js
// Call `.logger` and boom, you are rollin' ;)
const logger = loggin.logger();

// Now you can start loggin'
logger.info('A good message');
logger.error('Not so good, eh?', null, { channel: 'other-channel' });
```
By default `.logger()` will return a logger set to [level][docs:severity] **DEBUG** with a **detailed** [formatter][docs:formatter], 
which would output something similiar to this through the **console**:
```zsh
$ 2018-06-02 root example.js - INFO - A good message
$ 2018-06-02 root other-channel - ERROR - Not so good, eh?
```
> It will show colored output by default!


### Advanced example
Here is an advanced example:
```js

const fileNotif = loggin.notifier('file');
const consoleNotif = loggin.notifier('console');

fileNotif.pipe('debug', './debug.log');
fileNotif.pipe('error', './error.log');

consoleNotif.color(true);

const logger = loggin.logger({
  notifier: [fileNotif, consoleNotif],
  channel: 'my-app',
  preNotify(log) {
    log.message = log.message + ' - ' + hash(log);
  }
  ignore(log, notifier) {
    return notifier.name === 'console' && DEBUG === false;
  },
});

// Now you can start loggin'
logger.info('A good message');
logger.error('Not so good, eh?', null, { channel: 'other-channel' });
```
> **NOTE:** `preNotify` is called before `ignore`, and before propagating the log to Notifiers.  
> **NOTE:** `preNotify` allows modification of the log.



[back to top](#table-of-content-)
****



## Oficial Plugins
These are a couple of plugins that I've made. If you make a plugin and want it to appear here, 
you can contact me, and if it meets my standards I will add it here!!
* [MongoDB](https://github.com/nombrekeff/loggin-js-mongodb)
* [Express](https://github.com/nombrekeff/loggin-js-express)
* [WebSocket](https://github.com/loggin-js/loggin-js-ws)

[back to top](#table-of-content-)
****

## Migrating to `v1.x`
Check this little guide on how to migrate from `v0.x` to `v1.x`

## Contributing
> First off, thank you for considering contributing to Loggin'JS.

We accept any type of contribution here at Loggin'JS. Check out the [contributing guidelines](./.github/CONTRIBUTING.md) for more information.


## Versioning
We use [standard-version](https://github.com/conventional-changelog/standard-version) to manage releasing and CHANGELOG generation (with semver and [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/)) using [@conventional-changelog/standard-version](https://github.com/conventional-changelog/standard-version). For the versions available, see the [tags on this repository](https://github.com/loggin-js/loggin-js/tags). 

## Authors

* **Manolo Edge** - *Initial work* - [nombrekeff](https://github.com/nombrekeff)

You can also check out the list of [contributors](https://github.com/loggin-js/loggin-js/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Contributing
Pull requests are welcome, as well as any other type of contribution.  
Check out the contributing guidelines [here](./.github/CONTRIBUTING.md).

[back to top](#table-of-content-)
****

## Setting up <!-- omit in toc -->
```zsh
# clone the repo
$ git clone git@github.com:loggin-js/loggin-js.git

# enter the project
$ cd loggin-js

# install dependencies
$ npm install

# run tests
$ npm test
```

<!-- Links -->

[RFC3164]: https://tools.ietf.org/html/rfc3164
[npm-image]: https://img.shields.io/npm/v/loggin-js.svg?style=flat-square
[npm-url]: https://npmjs.org/package/loggin-js

[travis-image]: https://img.shields.io/travis/nombrekeff/loggin-js.svg?style=flat-square
[travis-url]: https://travis-ci.org/nombrekeff/loggin-js

[code-quality-badge]: http://npm.packagequality.com/shield/loggin-js.svg?style=flat-square
[code-quality-link]: https://packagequality.com/#?package=loggin-js

[pkg-size-badge]: https://img.shields.io/bundlephobia/minzip/loggin-js?style=flat-square
[pkg-size-link]: https://bundlephobia.com/result?p=loggin-js

[downloads-badge]: https://img.shields.io/npm/dm/loggin-js.svg?style=flat-square
[downloads-link]: https://www.npmjs.com/package/loggin-js

[dependencies-badge]: https://img.shields.io/david/nombrekeff/loggin-js.svg?style=flat-square
[dependencies-link]: https://david-dm.org/nombrekeff/loggin-js?view=tree

[vulnerabilities-badge]: https://snyk.io/test/npm/loggin-js/badge.svg?style=flat-square
[vulnerabilities-link]: https://snyk.io/test/npm/loggin-js

[docs:severity]: https://github.com/loggin-js/loggin-js/wiki/Severity
[docs:notifier]: https://github.com/loggin-js/loggin-js/wiki/Notifier
[docs:formatter]: https://github.com/loggin-js/loggin-js/wiki/Formatter
[docs:formatting]: https://github.com/loggin-js/loggin-js/wiki/Formatter
[docs:log]: https://github.com/loggin-js/loggin-js/wiki/Log
[docs:Logger]: https://github.com/loggin-js/loggin-js/wiki/Logger
[docs:channel]: https://github.com/loggin-js/loggin-js/wiki/Logger#channel
[docs:logger-options]: https://github.com/loggin-js/loggin-js/wiki/Logger#options
[docs:helper:logger]: https://github.com/loggin-js/loggin-js/wiki/Helpers#logger
[docs:helper:notifier]: https://github.com/loggin-js/loggin-js/wiki/Helper#notifier
[docs:helper:formatter]: https://github.com/loggin-js/loggin-js/wiki/Helper#formatter
[docs:helper:severity]: https://github.com/loggin-js/loggin-js/wiki/Helper#severity
[docs:customizing]: https://github.com/loggin-js/loggin-js/wiki/logger#customizing
[docs:premades]: https://github.com/loggin-js/loggin-js/wiki/premades
[docs:plugins]: https://github.com/loggin-js/loggin-js/wiki/Plugins