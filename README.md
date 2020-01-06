<div align="center">
  
# Loggin'JS ![](https://img.shields.io/badge/PRs-welcome-green.svg) <!-- omit in toc -->

[![NPM Version][npm-image]][npm-url]
[![Downloads][downloads-badge]][downloads-link]
[![Dependencies][dependencies-badge]][dependencies-link]
[![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities-link]  
[![NPM Package Quality][code-quality-badge]][code-quality-link]
[![NPM Package Size][pkg-size-badge]][pkg-size-link] <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
  
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

[🔧 Demo](https://runkit.com/nombrekeff/loggin-js-demo-1)   
[📓 Wiki](https://github.com/loggin-js/loggin-js/wiki)

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

### Installing
```bash
$ npm i loggin-js
# or
$ yarn add loggin-js
```

### Importing
```js
const loggin = require('loggin-js');
// Or
import * as loggin from 'loggin-js';
```

### Browser
> #### !! NOTICE !!
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

### Basic Usage
The default logger is the simplest way to use Loggin'JS.

```js
const loggin = require('loggin-js');

loggin.debug('Check this log out!!', { foo: 'var' }, { channel: 'my-logger' });
```

Additionaly you can create a custom logger:
```js
const loggin = require('loggin-js');
const logger = loggin.logger('file', { channel: 'my-logger' });

logger
  .getNotifier('file')
  .pipe(loggin.pipe('DEBUG', './debug.log'));
    
loggin.debug('Check this log out!!', { foo: 'var' });
```
> There are a couple of default Notifiers available: 
> * **NodeJS**: `file`, `console`, `http`, `memory` 
> * **Browser**: `console`, `http`

Chek out the [wiki](https://github.com/loggin-js/loggin-js/wiki) for a more detailed guide. 

[back to top](#table-of-content-)
****

## Examples
Here are some usage examples:
* [Basic Example](https://runkit.com/nombrekeff/loggin-js-demo-1)
* [File Notifier](https://runkit.com/nombrekeff/loggin-js-file-notifier)
* [Multiple Notifiers](https://runkit.com/nombrekeff/multiple-notifiers)
* [Http Notifier](https://runkit.com/nombrekeff/loggin-js-remote-notifier)
* You can also check the [`examples`](./examples) for more examples.

> If you want to add an example, or find some error leave an issue or send in a PR.

## Oficial Plugins
These are a couple of official plugins. If you make a plugin and want it to appear here, 
you can contact me, and if it meets my standards I will add it here!!
* [MongoDB](https://github.com/loggin-js/loggin-js-mongodb)
* [Express](https://github.com/loggin-js/loggin-js-express)
* [WebSocket](https://github.com/loggin-js/loggin-js-ws)

Comming:
* Telegram
* Mail - maybe?
* Sentry, and similar
* ...

## Features
* 🔍 - Research or planing.
* 👷 - Working beeing done.
* ✔️ - Fully implemented.

| **Feature**      | Browser | Node |
| ---------------- | ------- | ---- |
| File Notifier    | 👷      | ✔️   |
| Remote Notifier  | ✔️      | ✔️   |
| Console Notifier | ✔️      | ✔️   |
| Color            | 🔍      | ✔️   |
| Plugins          | 🔍      | ✔️   |


## Coverage
[![Coverage][coverage-lines-badge]]() 
[![Coverage][coverage-functions-badge]]() 
[![Coverage][coverage-statements-badge]]() 
[![Coverage][coverage-branches-badge]]() 


## Contributing
> First off, thank you for considering contributing to Loggin'JS.

Please read [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## Versioning <!-- omit in toc -->
We use [standard-version](https://github.com/conventional-changelog/standard-version) to manage releasing and CHANGELOG generation (with semver and [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/)) using [@conventional-changelog/standard-version](https://github.com/conventional-changelog/standard-version). For the versions available, see the [tags on this repository](https://github.com/loggin-js/loggin-js/tags). 

## Contributors ✨
*Initial work* by [nombrekeff](https://github.com/nombrekeff)

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://shop.epictv.com?code=f24644"><img src="https://avatars3.githubusercontent.com/u/17043260?v=4" width="100px;" alt=""/><br /><sub><b>Manolo Edge</b></sub></a><br /><a href="https://github.com/loggin-js/loggin-js/commits?author=nombrekeff" title="Code">💻</a> <a href="#ideas-nombrekeff" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-nombrekeff" title="Maintenance">🚧</a> <a href="https://github.com/loggin-js/loggin-js/commits?author=nombrekeff" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License <!-- omit in toc -->
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

<!-- Links -->
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

[coverage-lines-badge]: ./.github/badges/badge-lines.svg
[coverage-functions-badge]: ./.github/badges/badge-functions.svg
[coverage-branches-badge]: ./.github/badges/badge-branches.svg
[coverage-statements-badge]: ./.github/badges/badge-statements.svg

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

