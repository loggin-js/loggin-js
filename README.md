<div align="center">
  
![](https://vectr.com/nombrekeff/e709ORPLB.svg?width=320&height=320&select=b15wIepEy7)

[![NPM Version][npm-image]][npm-url]
[![Downloads][downloads-badge]][downloads-link]
[![Dependencies][dependencies-badge]][dependencies-link]
[![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities-link]  
[![NPM Package Quality][code-quality-badge]][code-quality-link]
[![NPM Package Size][pkg-size-badge]][pkg-size-link] <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

An easy and customizable logger for NodeJS and the Browser.  
If you want to log easily or create some complex loggin system, this might be the tool for you!

---

[`🔧 Demo`][demo]
[`📓 Wiki`][wiki]  
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

---

## News <!-- omit in toc -->
- **Browser** support is beeing **deprecated**, development will be discontinued and will be removed from Loggin'JS in version `2.0.0`. It's beeing deprecated because it's limiting me on the features I could be adding to the NodeJS version.


## Table Of Content <!-- omit in toc -->

- [Getting Started](#getting-started)
- [Examples](#examples)
- [Plugins](#plugins)
- [Contributing](#contributing)

Usefull links:

- [Migrating to `v1.x`](https://github.com/loggin-js/loggin-js/wiki/Migrating-to-%60v1.x%60)
- [Custom Loggers](https://github.com/loggin-js/loggin-js/wiki/Getting-Started#creating-custom-loggers)

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

#### Browser <!-- omit in toc -->

> #### !! NOTICE !!
>
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

## Getting Started

The default logger is the simplest way to use Loggin'JS.

```js
loggin.debug(
  'Check this log out!!',
  { foo: 'var' },
  { channel: 'my-logger' }
);
```

![Example Output 1](./.github/output-images/example-1.png)

Additionaly you can create a custom logger:

```js
const logger = loggin.logger({
  level: loggin.severity('info'), // Will output only info level and below
  channel: 'demo-1',
  formatter: 'long',
});

logger.user('Jhon');
logger.color(true);

logger.debug('Debug message, will not output');
logger.info('Info message, will output');

// You can override options when executing .log or any default methods (ie: debug, info, etc...)
logger.error('There was an <%rERROR>', null, { user: 'Bob' });
```

![](./.github/output-images/custom.png)

Or even log to a file:

```js
const logger = loggin.logger('file');
logger.channel('my-logger');

logger.getNotifier('file').pipe(loggin.pipe('DEBUG', './debug.log'));

loggin.debug('Check this log out!!', { foo: 'var' });
```

> There are a couple of default Notifiers available:
>
> - **NodeJS**: `file`, `console`, `http`, `memory`
> - **Browser**: `console`, `http`

Chek out the [wiki](https://github.com/loggin-js/loggin-js/wiki) for a more detailed guide.

[back to top](#table-of-content-)

---

## Examples

Here are some usage examples:

- [Basic Example](https://runkit.com/nombrekeff/loggin-js-demo-1)
- [File Notifier](https://runkit.com/nombrekeff/loggin-js-file-notifier)
- [Multiple Notifiers](https://runkit.com/nombrekeff/multiple-notifiers)
- [Http Notifier](https://runkit.com/nombrekeff/loggin-js-remote-notifier)
- You can also check the [`examples`](./examples) for more examples.

> If you want to add an example or find some error, leave an issue or send in a PR.

## Plugins
- [MongoDB](https://github.com/loggin-js/loggin-js-mongodb)
- [Express](https://github.com/loggin-js/loggin-js-express)
- [WebSocket](https://github.com/loggin-js/loggin-js-ws)


Coming:

- Telegram
- Mail - maybe?
- Sentry, and similar
- ...

## Coverage <!-- omit in toc -->

![Coverage][coverage-lines-badge]
![Coverage][coverage-functions-badge]
![Coverage][coverage-statements-badge]
![Coverage][coverage-branches-badge]

## Contributing

> First off, thank you for considering contributing to Loggin'JS.

Please read [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
There is also a public [slack channel](https://loggin-js.slack.com/archives/CT05VPRRC) available.

### Contributors ✨ <!-- omit in toc -->

_Initial work_ by [nombrekeff](https://github.com/nombrekeff)

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/nombrekeff"><img src="https://avatars3.githubusercontent.com/u/17043260?v=4" width="100px;" alt=""/><br /><sub><b>Manolo Edge</b></sub></a><br /><a href="https://github.com/loggin-js/loggin-js/commits?author=nombrekeff" title="Code">💻</a> <a href="#ideas-nombrekeff" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-nombrekeff" title="Maintenance">🚧</a> <a href="https://github.com/loggin-js/loggin-js/commits?author=nombrekeff" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/floki-gh"><img src="https://avatars0.githubusercontent.com/u/47026835?v=4" width="100px;" alt=""/><br /><sub><b>Floki</b></sub></a><br /><a href="https://github.com/loggin-js/loggin-js/commits?author=floki-gh" title="Documentation">📖</a></td>
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
[demo]: https://runkit.com/nombrekeff/loggin-js-demo-1
[wiki]: https://github.com/loggin-js/loggin-js/wiki
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
[docs:logger]: https://github.com/loggin-js/loggin-js/wiki/Logger
[docs:channel]: https://github.com/loggin-js/loggin-js/wiki/Logger#channel
[docs:logger-options]: https://github.com/loggin-js/loggin-js/wiki/Logger#options
[docs:helper:logger]: https://github.com/loggin-js/loggin-js/wiki/Helpers#logger
[docs:helper:notifier]: https://github.com/loggin-js/loggin-js/wiki/Helper#notifier
[docs:helper:formatter]: https://github.com/loggin-js/loggin-js/wiki/Helper#formatter
[docs:helper:severity]: https://github.com/loggin-js/loggin-js/wiki/Helper#severity
[docs:customizing]: https://github.com/loggin-js/loggin-js/wiki/logger#customizing
[docs:premades]: https://github.com/loggin-js/loggin-js/wiki/premades
[docs:plugins]: https://github.com/loggin-js/loggin-js/wiki/Plugins
