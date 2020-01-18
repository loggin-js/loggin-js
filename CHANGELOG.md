# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.7.1](https://github.com/loggin-js/loggin-js/compare/v1.5.2...v1.7.1) (2020-01-18)


### Bug Fixes

* **Logger:** fixed superfluous argument passed into new Logger in Logger.clone ([e793865](https://github.com/loggin-js/loggin-js/commit/e79386594df18982709f7c9f2b3195a1e66c3e29))
* adding deprecated warning for browser version in import, and in README ([960011f](https://github.com/loggin-js/loggin-js/commit/960011f7f1648a75e897f9f7c47b202bcbc5f2ec))

## [1.7.0](https://github.com/loggin-js/loggin-js/compare/v1.5.2...v1.7.0) (2020-01-02)


### Features

* **Deprecated** RemoteNotifier in favor of HttpNotifier ([4c41167](https://github.com/loggin-js/loggin-js/commit/4c41167353d51e4a3c19cde7a5bb6acad7d2b744))
* Added **Http** notifier for **browser**, renamed Remote notifier to Http ([2627db6](https://github.com/loggin-js/loggin-js/commit/2627db6aaa049e0613489ade38b0920cc4be8b5f))


### Bug Fixes
* **AdditionalNotifiers:** added correct names to notifiers ([c40aef4](https://github.com/loggin-js/loggin-js/commit/c40aef4803de4e689eb674d76c304b9af5f68d52), [425233c](https://github.com/loggin-js/loggin-js/commit/425233c42067f2b0c3babdbe38cbd97e27e7b420))
* **Logger:** fixed superfluous argument passed into new Logger in Logger.clone ([e793865](https://github.com/loggin-js/loggin-js/commit/e79386594df18982709f7c9f2b3195a1e66c3e29))

### [1.6.0](https://github.com/loggin-js/loggin-js/compare/v1.5.2...v1.6.0) (2019-12-21)


### Bug Fixes

* **Logger:** fixed superfluous argument passed into new Logger ([e793865](https://github.com/loggin-js/loggin-js/commit/e79386594df18982709f7c9f2b3195a1e66c3e29))
* **Notifier:** improved .canOutput method, to accept a ignore function to be passed as an option ([cb53fb1](https://github.com/loggin-js/loggin-js/commit/cb53fb180ab2a9ddcd85ce65822464bebab72981))

## Features
* **Notifier:** pipes can be passed in as options to constructor

### [1.5.2](https://github.com/loggin-js/loggin-js/compare/v1.5.1...v1.5.2) (2019-11-21)

### [1.5.1](https://github.com/loggin-js/loggin-js/compare/v1.5.0...v1.5.1) (2019-11-21)


### Bug Fixes

* **FileNotifier:** super call missing?? ([d2ee16e](https://github.com/loggin-js/loggin-js/commit/d2ee16e809a7794710f66f62004e410e2e13d30a))

### [1.5.0](https://github.com/loggin-js/loggin-js/compare/v1.4.2...v1.5.0) (2019-11-21)

### Features
* **Notifier:** Added `.enabled` method

### Bug Fixes

* **examples:** added runkit link to file notifier example ([ce27a2a](https://github.com/loggin-js/loggin-js/commit/ce27a2afede300fc7f3209734f30dcd47357b0d3))
* **examples:** improved examples ([b4548c4](https://github.com/loggin-js/loggin-js/commit/b4548c40c23c84497c66c7cc9ee1cb8f32ad7497))
* **logger:** changed option for a changed option in notifier ([c60a7d1](https://github.com/loggin-js/loggin-js/commit/c60a7d123a2721b727803f0f85f27327b466bbbd))
* **readme:** some changes and referenced json formatter ([e67da81](https://github.com/loggin-js/loggin-js/commit/e67da8148dcc20b570dd6efc2378ed109cfa8dab))
* **readme:** some readme fixes ([f35460c](https://github.com/loggin-js/loggin-js/commit/f35460cd4a20ab08208336ced20ab6878e01c016))
* **types:** added missing Notifier.enabled method ([4aec5be](https://github.com/loggin-js/loggin-js/commit/4aec5bef0af21b1400925fec94c118f4cf12068c))
* added build browser dist to build script ([249a1bd](https://github.com/loggin-js/loggin-js/commit/249a1bd886f9f9a7468688cae9034e00b5de230f))

### [1.4.1](https://github.com/loggin-js/loggin-js/compare/v1.4.0...v1.4.1) (2019-11-13)

### Bug Fixes

* added standard-version package to manage releasing ([14a6747](https://github.com/loggin-js/loggin-js/commit/14a674752c64080d82bd45ae78874adeff829da2))


## v1.2.4
* notifiers can be activated ad deactivated individualy
* notifiers can have custom names now

## v1.2.0
Browser version added, still limited

## v1.1.0
This is the "Plugin" version, it adds somewhat of a plugin support and mode customization, 
now you can:
* Extend severities
* Extend notifiers
* Extend formatters
* Extend loggers
* Add plugin to LogginJS

## v1.0.0
* Re-Write of the library
* Better typings
* More customizable
* More tests
* Better docs
