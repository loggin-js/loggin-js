

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

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing
With npm:
```bash
npm install loggin-js
```

With yarn:
```bash
yarn install loggin-js
```


### Importing
```js
const loggin = require('loggin-js');
// Or
import loggin from 'loggin-js';
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

loggin.debug('Check this log out!!', { foo: 'var' }, { channel: 'Wabalabadubdub!' });
```

Chek out the [wiki](https://github.com/loggin-js/loggin-js/wiki) for a more detailed guide. 

[back to top](#table-of-content-)
****

## Contributing
> First off, thank you for considering contributing to Loggin'JS.

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## Versioning
We use [standard-version](https://github.com/conventional-changelog/standard-version) to manage releasing and CHANGELOG generation (with semver and [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/)) using [@conventional-changelog/standard-version](https://github.com/conventional-changelog/standard-version). For the versions available, see the [tags on this repository](https://github.com/loggin-js/loggin-js/tags). 

## Authors

* *Initial work* - [nombrekeff](https://github.com/nombrekeff)

See also the list of [contributors](https://github.com/loggin-js/loggin-js/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

