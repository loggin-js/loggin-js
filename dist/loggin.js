(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
const LogginJS = require('./lib/index');
const additionalSeverities = require('./plugins/additional-severities');
const additionalNotifiers = require('./plugins/browser/additional-notifiers');
const additionalFormatters = require('./plugins/additional-formatters');

LogginJS.use(additionalSeverities);
LogginJS.use(additionalNotifiers);
LogginJS.use(additionalFormatters);

global.LogginJS = LogginJS;
module.exports = LogginJS;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib/index":3,"./plugins/additional-formatters":143,"./plugins/additional-severities":144,"./plugins/browser/additional-notifiers":145}],2:[function(require,module,exports){
'use strict';
const strif = require('strif');
const clicolor = require('cli-color');

const padd = (v) => ` ${v} `;

let colors = {
  cl_red: s => clicolor.red(s),
  cl_blue: s => clicolor.blue(s),
  cl_cyan: s => clicolor.cyan(s),
  cl_green: s => clicolor.green(s),
  cl_gray: s => clicolor.blackBright(s),
  cl_yellow: s => clicolor.yellow(s),
  cl_orange: s => clicolor.orange(s),
  cl_purple: s => clicolor.purple(s),
  cl_black: s => clicolor.black(s),
  cl_white: s => clicolor.white(s),
  cl_magenta: s => clicolor.magenta(s),
};

let labels = {
  lbl_red: s => clicolor.bgRed(padd(s)),
  lbl_blue: s => clicolor.bgBlue(padd(s)),
  lbl_cyan: s => clicolor.bgCyan(padd(s)),
  lbl_green: s => clicolor.bgGreen(padd(s)),
  lbl_gray: s => clicolor.bgGray(padd(s)),
  lbl_yellow: s => clicolor.bgYellow(padd(s)),
  lbl_orange: s => clicolor.bgOrange(padd(s)),
  lbl_purple: s => clicolor.bgPurple(padd(s)),
  lbl_black: s => clicolor.bgBlack(padd(s)),
  lbl_white: s => clicolor.bgWhite(padd(s)),
  lbl_magenta: s => clicolor.bgMagenta(padd(s)),
};

let ignored = [
  'lbl_red',
  'lbl_blue',
  'lbl_cyan',
  'lbl_green',
  'lbl_gray',
  'lbl_yellow',
  'lbl_orange',
  'lbl_purple',
  'lbl_black',
  'lbl_white',
  'lbl_magenta',

  'cl_red',
  'cl_blue',
  'cl_cyan',
  'cl_green',
  'cl_gray',
  'cl_yellow',
  'cl_orange',
  'cl_purple',
  'cl_black',
  'cl_white',
  'cl_magenta',
]


const formatter =
  strif.create({
    transformers: {
      json: s => s ? JSON.stringify(s, null, 2) : s,
      json_u: s => s ? JSON.stringify(s) : s,
      upper: s => s ? s.toUpperCase() : s,
      lower: s => s ? s.toLowerCase() : s,
      string: s => s ? s.toString() : s,
      int: s => s ? s.toInt() : s,
      date: s => s ? new Date(s).toLocaleDateString() : s,
      ...labels,
      ...colors
    }
  });

class Formatter {
  constructor(template) {
    this.template = template;
  }

  color(str) {
    Formatter.replaceables.forEach((re) => str = str.replace(re.regexp, re.fn));
    return str;
  }

  formatLog(log, opts = { color: false }) {
    let {
      message,
      data,
      level,
      channel,
      levelStr,
      time,
      user,
    } = log;

    return Formatter.format({
      message,
      data,
      level,
      channel,
      levelStr,
      time,
      user,
    }, this, opts.color);
  }

  static format(log, formatter, color = false) {
    const tmpltType = formatter.template.constructor.name;
    if (tmpltType !== 'StrifTemplate') {
      throw Error('options.formatter should be type: "StrifTemplate", not: "' + tmpltType + '"');
    }

    return formatter.template.compile(log, {
      ignoreTransformers: color ? false : ignored
    });
  }

  static search(value) {
    for (let key in Formatter._formatters) {
      let formatter = Formatter._formatters[key];
      if ((key).toLowerCase() === String(value).toLowerCase()) {
        return formatter;
      }
    }

    return Formatter.LONG;
  }

  static get(value) {
    if (value && value.constructor.name === 'Formatter') {
      return value;
    }

    return Formatter.search(value);
  }

  static register(name, template, options = {}) {
    if (typeof name !== 'string') {
      throw new Error('"name" must be a string got: ' + typeof name);
    }
    if (typeof template !== 'string') {
      throw new Error('"template" must be a string got: ' + typeof template);
    }

    let nameUpper = name.toUpperCase();

    Formatter[nameUpper] = Formatter._formatters[nameUpper] =
      new Formatter(formatter.template(template, options));

    return Formatter;
  }
}

/**
 * Array of regexp, transformer pairs, that change the color of a specific pattern
 */
Formatter.replaceables = [
  {
    regexp: /<%bb[^>]+>/g,
    fn: (str) => clicolor.blueBright(str).replace(/<%bb(.+)>/g, '$1')
  },
  {
    regexp: /<%gr[^>]+>/g,
    fn: (str) => clicolor.blackBright(str).replace(/<%gr(.+)>/g, '$1')
  },
  {
    regexp: /INFO|INF|<%g[^>]+>/g,
    fn: (str) => clicolor.greenBright(str).replace(/<%g(.+)>/g, '$1')
  },
  {
    regexp: /SILLY|SIL|<%m[^>]+>/g,
    fn: (str) => clicolor.magentaBright(str).replace(/<%m(.+)>/g, '$1')
  },
  {
    regexp: /DEBUG|DEB|<%b[^>]+>/g,
    fn: (str) => clicolor.blueBright(str).replace(/<%b(.+)>/g, '$1')
  },
  {
    regexp: /NOTICE|NOT|<%c[^>]+>/g,
    fn: (str) => clicolor.cyanBright(str).replace(/<%c(.+)>/g, '$1')
  },
  {
    regexp: /WARNING|WAR|EME|EMERGENCY|<%y[^>]+>/g,
    fn: (str) => clicolor.yellowBright(str).replace(/<%y(.+)>/g, '$1')
  },
  {
    regexp: /ALERT|ALE|CRITICAL|CRI|ERROR|ERR|<%r[^>]+>/g,
    fn: (str) => clicolor.redBright(str).replace(/<%r(.+)>/g, '$1')
  },
  {
    regexp: /<%p[^>]+>/g,
    fn: (str) => clicolor.xterm(13)(str).replace(/<%p(.+)>/g, '$1')
  },
  {
    regexp: /<%m[^>]+>/g,
    fn: (str) => clicolor.magenta(str).replace(/<%m(.+)>/g, '$1')
  }
];

Formatter._formatters = {};

module.exports = Formatter;

},{"cli-color":16,"strif":129}],3:[function(require,module,exports){
'use strict';

const Logger = require('./logger');
const Notifier = require('./notifier');
const Formatter = require('./formatter');
const Severity = require('./severity');
const Log = require('./log');
const Pipe = require('./pipe');

function logger(opts = 'default', args = {}) {
  return Logger.get(opts, args);
}

function notifier(opts = 'default', args = {}) {
  return Notifier.get(opts);
}

function formatter(template = 'default') {
  return Formatter.get(template);
}

function severity(level) {
  return Severity.get(level);
}

function merge(loggers, options) {
  return Logger.merge(loggers, options);
}

function pipe(level, filepath) {
  return new Pipe(level, filepath);
}

function use(plugin) {
  if (typeof plugin !== 'function') {
    throw new Error('"plugin" must be a function');
  }

  // "this" will resolve to LogginJS
  plugin(this);
}


const LogginJS = {
  Severity,
  Log,
  Notifier,
  Formatter,
  Logger,
  Pipe,

  logger,
  notifier,
  formatter,
  severity,
  merge,
  pipe,
  use
};

module.exports = LogginJS;
},{"./formatter":2,"./log":4,"./logger":5,"./notifier":6,"./pipe":7,"./severity":8}],4:[function(require,module,exports){
'use strict';

const clicolor = require('cli-color');
const Severity = require('./severity');
const Formatter = require('./formatter');


class Log {
  constructor(message, data = null, level = Severity.DEBUG, channel = '', time = new Date(), user) {
    this.message = message;
    this.data = data;
    this.level = level;
    this.channel = channel;
    this.levelStr = level.toString();
    this.time = time || new Date();
    this.user = user;
  }

  /**
   * Returns formatted log
   * @param {string} formatter
   */
  format(formatter, opts = {
    color: false
  }) {
    let {
      message,
      data,
      level,
      channel,
      levelStr,
      time,
      user,
    } = this;

    return Formatter.format({
      message,
      data,
      level,
      channel,
      levelStr,
      time,
      user,
    }, formatter, opts.color);
  }
}

module.exports = Log;
},{"./formatter":2,"./severity":8,"cli-color":16}],5:[function(require,module,exports){
(function (__filename){
'use strict';

const Log = require('./log');
const Notifier = require('./notifier');
const Severity = require('./severity');
const Formatter = require('./formatter');
const os = require('os');
const path = require('path');

class Logger {
  constructor(options) {
    this.options = {
      ...Logger.DefaultOptions,
      ...options
    };

    this._profiles = {};
    let notifiers = options.notifiers;
    if (!notifiers || notifiers.length === 0) {
      notifiers = [Notifier.get('default')];
    }

    this._level;
    this._user;
    this._channel;
    this._enabled;
    this._color;
    this._formatter;
    this._lineNumbers;

    // .setNotifiers must be done before setting other options
    // as some of them propagate down options to the notifiers
    this.setNotifiers(notifiers);

    this.level(this.options.level);
    this.user(this.options.user);
    this.channel(this.options.channel);
    this.enabled(this.options.enabled);
    this.color(this.options.color);
    this.formatter(this.options.formatter);
    this.lineNumbers(this.options.lineNumbers);
  }

  clone(options = {}) {
    let logger = new Logger({ ...this.options, ...options }, [...this._notifiers]);
    return logger;
  }

  fork(options = {}) {
    return this.clone(options);
  }

  // Options
  enabled(enabled) {
    this.options.enabled = enabled;
    return this;
  }

  user(user) {
    this.options.user = user;
    return this;
  }

  channel(channel) {
    this.options.channel = channel;
    return this;
  }

  level(level) {
    this.options.level = Severity.get(level) || Severity.DEBUG;

    this._notifiers.forEach(notif =>
      notif.level(this.options.level));

    return this;
  }

  formatter(formatter) {
    this.options.formatter = formatter;
    this._notifiers.forEach(notif =>
      notif.formatter(this.options.formatter));

    return this;
  }

  color(enabled = true) {
    this._color = true;
    this._notifiers.forEach(notif =>
      notif.color(enabled));
    return this;
  }

  lineNumbers(show) {
    this._notifiers.forEach(notif =>
      notif.lineNumbers(show));

    return this;
  }

  // Notifier stuff
  notifier(...notifiers) {
    this._notifiers = [
      ...this._notifiers,
      ...notifiers
    ];
    return this;
  }

  setNotifiers(notifiers) {
    this._notifiers = notifiers;
    return this;
  }

  hasNotifier(name) {
    return this._notifiers.some(notif =>
      notif.name === name);
  }

  getNotifier(name) {
    if (!this.hasNotifier(name)) {
      return null;
    } else {
      return this._notifiers.filter(notif =>
        notif.name === name).pop();
    }
  }

  color(color = true) {
    this.options.color = color;
    this._notifiers.forEach(notif =>
      notif.color(this.options.color));

    return this;
  }

  lineNumbers(show) {
    this.options.lineNumbers = show;
    this._notifiers.forEach(notif =>
      notif.lineNumbers(this.options.lineNumbers));

    return this;
  }

  canLog(severity) {
    return this.options.level.canLog(severity);
  }

  log(message, data = null, opts = {}) {
    const { level, channel, time, user } = {
      level: this.options.level,
      channel: this.options.channel,
      user: this.options.user,
      time: Date.now(),
      ...opts
    };

    if (this.options.enabled) {
      let log = message;
      if (!(message instanceof Log)) {
        log = new Log(message, data, level, channel, time, user);
      }

      return this._notifiers
        .forEach(notifier => {
          if (notifier.canOutput(level)) {
            if (this.options.preNotify && typeof this.options.preNotify === 'function') {
              this.options.preNotify(log, notifier);
            }
            if (
              this.options.ignore &&
              typeof this.options.ignore === 'function' &&
              this.options.ignore(log, notifier)
            ) return;

            notifier.notify(log);
          }
        });
    }

    return this;
  }


  debug(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.DEBUG,
      ...opts
    });

    return this;
  }

  warning(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.WARNING,
      ...opts
    });

    return this;
  }

  alert(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.ALERT,
      ...opts
    });

    return this;
  }

  emergency(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.EMERGENCY,
      ...opts
    });

    return this;
  }

  critical(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.CRITICAL,
      ...opts
    });

    return this;
  }

  error(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.ERROR,
      ...opts
    });

    return this;
  }

  notice(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.NOTICE,
      ...opts
    });

    return this;
  }

  info(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.INFO,
      ...opts
    });

    return this;
  }

  silly(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.SILLY,
      ...opts
    });

    return this;
  }

  static search(value) {
    for (let key in Logger._loggers) {
      let logger = Logger._loggers[key];
      if ((key).toLowerCase() === String(value).toLowerCase()) {
        return logger;
      }
    }

    return Notifier.File;
  }

  static get(opts = 'default', args = {}) {
    let notifier = Notifier.get(opts, args);
    if (typeof opts === 'string' && notifier) {
      args.notifiers = [notifier];
      return new Logger(args);
    } else if (typeof opts === 'object') {
      return new Logger(opts);
    } else {
      throw new Error('Bad arguments for .logger, (' + opts + ')');
    }
  }

  static merge(loggers, opts = {
    mergeOptions: true,
    mergeNotifiers: true
  }) {
    let notifiers = [];
    let options = {};
    for (let logger of loggers) {
      if (!(logger instanceof Logger)) {
        throw new Error('loggers must be an array of loggers');
      } else {
        if (opts.mergeOptions === true) {
          options = Object.assign(options, logger.options);
        }

        if (opts.mergeNotifiers === true) {
          notifiers.push(...logger._notifiers);
        }
      }
    }

    let logger = new Logger(options);
    logger.setNotifiers(notifiers);

    return logger;
  }

  static register(name, notifierName) {
    if (typeof name !== 'string') {
      throw new Error('"name" must be a string got: ' + typeof name);
    }
    if (typeof notifierName !== 'string') {
      throw new Error('"notifierName" must be a string got: ' + typeof notifierName);
    }

    Logger[name] = Logger._loggers[name] = notifierName;

    return Logger;
  }
}

Logger._loggers = {};
Logger.DefaultOptions = {
  user: os.userInfo ? os.userInfo().username: 'browser',
  ignore: null,
  level: Severity.DEBUG,
  channel: path.basename(__filename),
  formatter: Formatter.get('detailed'),
  enabled: true,
  color: false,
};

module.exports = Logger;
}).call(this,"/lib/logger.js")
},{"./formatter":2,"./log":4,"./notifier":6,"./severity":8,"os":147,"path":148}],6:[function(require,module,exports){
'use strict';

const Severity = require('./severity');
const Formatter = require('./formatter');

function isConstructor(obj) {
  return !!obj.prototype && !!obj.prototype.constructor.name;
}

class Notifier {
  constructor(options = {}) {
    options = {
      ...Notifier.DefaultOptions,
      ...options
    }

    if (options.level && !(options.level instanceof Severity)) {
      throw new Error(`ERROR: "options.level" should be an instance of Severity. at: options.level = ${options.level}`);
    }

    this.name = 'abstract';
    this.options = options;
    this.options.level = Severity.get(this.options.level);
    this.options.color = options.color;
    this.options.lineNumbers = this.options.lineNumbers;

    this.pipes = [];
    this.lineIndex = 0;

    if (!this.options.formatter) {
      this.formatter('detailed');
    } else if (typeof this.options.formatter === 'string') {
      this.formatter(this.options.formatter);
    }
  }

  canOutput(level) {
    return this.options.level.canLog(level);
  }

  level(level) {
    this.options.level = Severity.get(level);
    return this;
  }

  formatter(formatter) {
    this.options.formatter = Formatter.get(formatter);
    return this;
  }

  color(val) {
    this.options.color = val;
    return this;
  }

  lineNumbers(show) {
    this.options.lineNumbers = show;
    return this;
  }

  getLineWithNumber(log) {
    let lineNum = this.lineIndex++;
    return '(' + lineNum + ') ' + log;
  }

  notify(log) {
    let { formatter, color } = this.options;
    let output = formatter.formatLog(log, { color: color });

    if (color) {
      output = formatter.color(output);
    }

    this.output(output, log.level, log);

    return this;
  }

  output(log) {
    return;
  }

  pipe(severity, cb) {
    console.warn('WARN - Pipe has not been configured in this notifier');
  }

  static search(value) {
    for (let key in Notifier._notifiers) {
      let notifier = Notifier._notifiers[key];
      if ((key).toLowerCase() === String(value).toLowerCase()) {
        return notifier;
      }
    }

    return Notifier.Console;
  }

  static get(value, opts = {}) {
    if (value && value.constructor.name === 'Notifier') {
      return value;
    }

    let Ctor = Notifier.search(value);

    if (!isConstructor(Ctor)) {
      throw new Error('Coult not find Notifier with name (' + value + ') | \nIf it\'s a custom made notifier, please register it before using it. I.e: Notifier.register(\'name\', Constructor)');
    }

    return new Ctor(opts);
  }

  static register(name, ctor) {
    if (typeof name !== 'string') {
      throw new Error('"name" must be a string got: ' + typeof name);
    }
    if (typeof ctor !== 'function') {
      throw new Error('"ctor" must be a constructor function got: ' + typeof ctor);
    }

    Notifier[name] = Notifier._notifiers[name] = ctor;

    return Notifier;
  }
}

Notifier._notifiers = {};

Notifier.DefaultOptions = {
  color: false
};


module.exports = Notifier;
},{"./formatter":2,"./severity":8}],7:[function(require,module,exports){
'use strict';
class Pipe {
  constructor(severity, filepath) {
    this.severity = severity;
    this.filepath = filepath;
  }


  /**
   * Does this pipe englobe said severity
   * @argument severity {Severity}
   */
  englobes(severity) {
    return this.severity.canLog(severity)
  }
}

module.exports = Pipe;
},{}],8:[function(require,module,exports){
'use strict';
class Severity {
  constructor(level, name) {
    this.level = level;
    this.name = name;
    this.fileLogginLevel = this.level;
  }

  canLog(severity) {
    return this.level >= severity.level;
  }

  getFileLoggingLevel() {
    return this.fileLogginLevel;
  }

  toString() {
    return String(this.name).substr(0, 3);
  }

  toInt() {
    return this.level;
  }

  valueOf() {
    return this.toInt();
  }

  static search(value) {
    for (let key in Severity._severities) {
      let severity = Severity._severities[key];
      if (severity.level === value || (severity.name).toLowerCase() === String(value).toLowerCase()) {
        return severity;
      }
    }

    return null;
  }

  static get(level) {
    if (level && level.constructor.name === 'Severity') {
      return level;
    }

    return Severity.search(level);
  }

  static register(level, name) {
    if (typeof name !== 'string') {
      throw new Error('"name" must be a string got: ' + typeof name);
    }
    Severity[name] = Severity._severities[name] = new Severity(level, name);

    return Severity;
  }
}

Severity._severities = {};

module.exports = Severity;
},{}],9:[function(require,module,exports){
'use strict';
module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};

},{}],10:[function(require,module,exports){
"use strict";

var object        = require("es5-ext/object/valid-object")
  , stringifiable = require("es5-ext/object/validate-stringifiable-value")
  , forOf         = require("es6-iterator/for-of");

module.exports = function (text, style) {
	var result = "";
	text = stringifiable(text);
	object(style);
	forOf(text, function (char) { result += style[char] || char; });
	return result;
};

},{"es5-ext/object/valid-object":80,"es5-ext/object/validate-stringifiable-value":82,"es6-iterator/for-of":94}],11:[function(require,module,exports){
(function (process){
"use strict";

var d              = require("d")
  , assign         = require("es5-ext/object/assign")
  , forEach        = require("es5-ext/object/for-each")
  , map            = require("es5-ext/object/map")
  , primitiveSet   = require("es5-ext/object/primitive-set")
  , setPrototypeOf = require("es5-ext/object/set-prototype-of")
  , memoize        = require("memoizee")
  , memoizeMethods = require("memoizee/methods")

  , sgr = require("./lib/sgr")
  , mods = sgr.mods

  , join = Array.prototype.join, defineProperty = Object.defineProperty
  , max = Math.max, min = Math.min
  , variantModes = primitiveSet("_fg", "_bg")
  , xtermMatch, getFn;

// Some use cli-color as: console.log(clc.red('Error!'));
// Which is inefficient as on each call it configures new clc object
// with memoization we reuse once created object
var memoized = memoize(function (scope, mod) {
	return defineProperty(getFn(), "_cliColorData", d(assign({}, scope._cliColorData, mod)));
});

var proto = Object.create(Function.prototype, assign(map(mods, function (mod) {
	return d.gs(function () { return memoized(this, mod); });
}), memoizeMethods({
	// xterm (255) color
	xterm: d(function (code) {
		code = isNaN(code) ? 255 : min(max(code, 0), 255);
		return defineProperty(getFn(), "_cliColorData",
			d(assign({}, this._cliColorData, {
				_fg: [xtermMatch ? xtermMatch[code] : "38;5;" + code, 39]
			})));
	}),
	bgXterm: d(function (code) {
		code = isNaN(code) ? 255 : min(max(code, 0), 255);
		return defineProperty(getFn(), "_cliColorData",
			d(assign({}, this._cliColorData, {
				_bg: [xtermMatch ? xtermMatch[code] + 10 : "48;5;" + code, 49]
			})));
	})
})));

var getEndRe = memoize(function (code) {
	return new RegExp("\x1b\\[" + code + "m", "g");
}, { primitive: true });

if (process.platform === "win32") xtermMatch = require("./lib/xterm-match");

getFn = function () {
	return setPrototypeOf(function self(/* …msg*/) {
		var start = "", end = "", msg = join.call(arguments, " "), conf = self._cliColorData
		  , hasAnsi = sgr.hasCSI(msg);
		forEach(conf, function (mod, key) {
			end = sgr(mod[1]) + end;
			start += sgr(mod[0]);
			if (hasAnsi) {
				msg = msg.replace(getEndRe(mod[1]), variantModes[key] ? sgr(mod[0]) : "");
			}
		}, null, true);
		return start + msg + end;
	}, proto);
};

module.exports = Object.defineProperties(getFn(), {
	xtermSupported: d(!xtermMatch),
	_cliColorData: d("", {})
});

}).call(this,require('_process'))
},{"./lib/sgr":17,"./lib/xterm-match":19,"_process":149,"d":27,"es5-ext/object/assign":58,"es5-ext/object/for-each":64,"es5-ext/object/map":72,"es5-ext/object/primitive-set":75,"es5-ext/object/set-prototype-of":76,"memoizee":114,"memoizee/methods":121}],12:[function(require,module,exports){
"use strict";

module.exports = "\x07";

},{}],13:[function(require,module,exports){
"use strict";

var generate          = require("es5-ext/array/generate")
  , from              = require("es5-ext/array/from")
  , iterable          = require("es5-ext/iterable/validate-object")
  , isValue           = require("es5-ext/object/is-value")
  , stringifiable     = require("es5-ext/object/validate-stringifiable")
  , repeat            = require("es5-ext/string/#/repeat")
  , getStrippedLength = require("./get-stripped-length");

var push = Array.prototype.push;

module.exports = function (inputRows/*, options*/) {
	var options = Object(arguments[1])
	  , colsMeta = []
	  , colsOptions = options.columns || []
	  , rows = [];

	from(iterable(inputRows), function (row) {
		var rowRows = [[]];
		from(iterable(row), function (cellStr, columnIndex) {
			var cellRows = stringifiable(cellStr).split("\n");
			while (cellRows.length > rowRows.length) rowRows.push(generate(columnIndex, ""));
			cellRows.forEach(function (cellRow, rowRowIndex) {
				rowRows[rowRowIndex][columnIndex] = cellRow;
			});
		});
		push.apply(rows, rowRows);
	});

	return (
		rows
			.map(function (row) {
				return from(iterable(row), function (str, index) {
					var col = colsMeta[index], strLength;
					if (!col) col = colsMeta[index] = { width: 0 };
					str = stringifiable(str);
					strLength = getStrippedLength(str);
					if (strLength > col.width) col.width = strLength;
					return { str: str, length: strLength };
				});
			})
			.map(function (row) {
				return row
					.map(function (item, index) {
						var pad, align = "left", colOptions = colsOptions && colsOptions[index];
						align = colOptions && colOptions.align === "right" ? "right" : "left";
						pad = repeat.call(" ", colsMeta[index].width - item.length);
						if (align === "left") return item.str + pad;
						return pad + item.str;
					})
					.join(isValue(options.sep) ? options.sep : " | ");
			})
			.join("\n") + "\n"
	);
};

},{"./get-stripped-length":15,"es5-ext/array/from":33,"es5-ext/array/generate":36,"es5-ext/iterable/validate-object":45,"es5-ext/object/is-value":68,"es5-ext/object/validate-stringifiable":83,"es5-ext/string/#/repeat":88}],14:[function(require,module,exports){
"use strict";

module.exports = {
	screen: "\x1b[2J",
	screenLeft: "\x1b[1J",
	screenRight: "\x1b[J",
	line: "\x1b[2K",
	lineLeft: "\x1b[1K",
	lineRight: "\x1b[K"
};

},{}],15:[function(require,module,exports){
"use strict";

/*
 * get actual length of ANSI-formatted string
 */

var strip = require("./strip");

module.exports = function (str) {
	return strip(str).length;
};

},{"./strip":23}],16:[function(require,module,exports){
"use strict";

var d = require("d");

module.exports = Object.defineProperties(require("./bare"), {
	windowSize: d(require("./window-size")),
	erase: d(require("./erase")),
	move: d(require("./move")),
	beep: d(require("./beep")),
	columns: d(require("./columns")),
	strip: d(require("./strip")),
	getStrippedLength: d(require("./get-stripped-length")),
	slice: d(require("./slice")),
	throbber: d(require("./throbber")),
	reset: d(require("./reset")),
	art: d(require("./art"))
});

},{"./art":10,"./bare":11,"./beep":12,"./columns":13,"./erase":14,"./get-stripped-length":15,"./move":20,"./reset":21,"./slice":22,"./strip":23,"./throbber":24,"./window-size":25,"d":27}],17:[function(require,module,exports){
"use strict";

/* CSI - control sequence introducer */
/* SGR - set graphic rendition */

var assign       = require("es5-ext/object/assign")
  , includes     = require("es5-ext/string/#/contains")
  , forOwn       = require("es5-ext/object/for-each")
  , onlyKey      = require("es5-ext/object/first-key")
  , forEachRight = require("es5-ext/array/#/for-each-right")
  , uniq         = require("es5-ext/array/#/uniq.js");

var CSI = "\x1b[";

var sgr = function (code) { return CSI + code + "m"; };

sgr.CSI = CSI;

var mods = assign(
	{
		// Style
		bold: { _bold: [1, 22] },
		italic: { _italic: [3, 23] },
		underline: { _underline: [4, 24] },
		blink: { _blink: [5, 25] },
		inverse: { _inverse: [7, 27] },
		strike: { _strike: [9, 29] }

		// Color
	},
	["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"].reduce(function (
		obj,
		color,
		index
	) {
		// foreground
		obj[color] = { _fg: [30 + index, 39] };
		obj[color + "Bright"] = { _fg: [90 + index, 39] };

		// background
		obj["bg" + color[0].toUpperCase() + color.slice(1)] = { _bg: [40 + index, 49] };
		obj["bg" + color[0].toUpperCase() + color.slice(1) + "Bright"] = { _bg: [100 + index, 49] };

		return obj;
	}, {})
);

sgr.mods = mods;

sgr.openers = {};
sgr.closers = {};

forOwn(mods, function (mod) {
	var modPair = mod[onlyKey(mod)];

	sgr.openers[modPair[0]] = modPair;
	sgr.closers[modPair[1]] = modPair;
});

sgr.openStyle = function (openedMods, code) { openedMods.push(sgr.openers[code]); };

sgr.closeStyle = function (openedMods, code) {
	forEachRight.call(openedMods, function (modPair, index) {
		if (modPair[1] === code) {
			openedMods.splice(index, 1);
		}
	});
};

/* prepend openers */
sgr.prepend = function (currentMods) {
	return currentMods.map(function (modPair) { return sgr(modPair[0]); });
};

/* complete non-closed openers with corresponding closers */
sgr.complete = function (openedMods, closerCodes) {
	closerCodes.forEach(function (code) { sgr.closeStyle(openedMods, code); });

	// mods must be closed from the last opened to first opened
	openedMods = openedMods.reverse();

	openedMods = openedMods.map(function (modPair) { return modPair[1]; });

	// one closer can close many openers (31, 32 -> 39)
	openedMods = uniq.call(openedMods);

	return openedMods.map(sgr);
};

var hasCSI = function (str) { return includes.call(str, CSI); };

sgr.hasCSI = hasCSI;

var extractCode = function (csi) {
	var code = csi.slice(2, -1);
	code = Number(code);
	return code;
};

sgr.extractCode = extractCode;

module.exports = sgr;

},{"es5-ext/array/#/for-each-right":31,"es5-ext/array/#/uniq.js":32,"es5-ext/object/assign":58,"es5-ext/object/first-key":63,"es5-ext/object/for-each":64,"es5-ext/string/#/contains":85}],18:[function(require,module,exports){
"use strict";

module.exports = [
	"000000", "800000", "008000", "808000", "000080", "800080", "008080", "c0c0c0",
	"808080", "ff0000", "00ff00", "ffff00", "0000ff", "ff00ff", "00ffff", "ffffff",

	"000000", "00005f", "000087", "0000af", "0000d7", "0000ff",
	"005f00", "005f5f", "005f87", "005faf", "005fd7", "005fff",
	"008700", "00875f", "008787", "0087af", "0087d7", "0087ff",
	"00af00", "00af5f", "00af87", "00afaf", "00afd7", "00afff",
	"00d700", "00d75f", "00d787", "00d7af", "00d7d7", "00d7ff",
	"00ff00", "00ff5f", "00ff87", "00ffaf", "00ffd7", "00ffff",

	"5f0000", "5f005f", "5f0087", "5f00af", "5f00d7", "5f00ff",
	"5f5f00", "5f5f5f", "5f5f87", "5f5faf", "5f5fd7", "5f5fff",
	"5f8700", "5f875f", "5f8787", "5f87af", "5f87d7", "5f87ff",
	"5faf00", "5faf5f", "5faf87", "5fafaf", "5fafd7", "5fafff",
	"5fd700", "5fd75f", "5fd787", "5fd7af", "5fd7d7", "5fd7ff",
	"5fff00", "5fff5f", "5fff87", "5fffaf", "5fffd7", "5fffff",

	"870000", "87005f", "870087", "8700af", "8700d7", "8700ff",
	"875f00", "875f5f", "875f87", "875faf", "875fd7", "875fff",
	"878700", "87875f", "878787", "8787af", "8787d7", "8787ff",
	"87af00", "87af5f", "87af87", "87afaf", "87afd7", "87afff",
	"87d700", "87d75f", "87d787", "87d7af", "87d7d7", "87d7ff",
	"87ff00", "87ff5f", "87ff87", "87ffaf", "87ffd7", "87ffff",

	"af0000", "af005f", "af0087", "af00af", "af00d7", "af00ff",
	"af5f00", "af5f5f", "af5f87", "af5faf", "af5fd7", "af5fff",
	"af8700", "af875f", "af8787", "af87af", "af87d7", "af87ff",
	"afaf00", "afaf5f", "afaf87", "afafaf", "afafd7", "afafff",
	"afd700", "afd75f", "afd787", "afd7af", "afd7d7", "afd7ff",
	"afff00", "afff5f", "afff87", "afffaf", "afffd7", "afffff",

	"d70000", "d7005f", "d70087", "d700af", "d700d7", "d700ff",
	"d75f00", "d75f5f", "d75f87", "d75faf", "d75fd7", "d75fff",
	"d78700", "d7875f", "d78787", "d787af", "d787d7", "d787ff",
	"d7af00", "d7af5f", "d7af87", "d7afaf", "d7afd7", "d7afff",
	"d7d700", "d7d75f", "d7d787", "d7d7af", "d7d7d7", "d7d7ff",
	"d7ff00", "d7ff5f", "d7ff87", "d7ffaf", "d7ffd7", "d7ffff",

	"ff0000", "ff005f", "ff0087", "ff00af", "ff00d7", "ff00ff",
	"ff5f00", "ff5f5f", "ff5f87", "ff5faf", "ff5fd7", "ff5fff",
	"ff8700", "ff875f", "ff8787", "ff87af", "ff87d7", "ff87ff",
	"ffaf00", "ffaf5f", "ffaf87", "ffafaf", "ffafd7", "ffafff",
	"ffd700", "ffd75f", "ffd787", "ffd7af", "ffd7d7", "ffd7ff",
	"ffff00", "ffff5f", "ffff87", "ffffaf", "ffffd7", "ffffff",

	"080808", "121212", "1c1c1c", "262626", "303030", "3a3a3a",
	"444444", "4e4e4e", "585858", "626262", "6c6c6c", "767676",
	"808080", "8a8a8a", "949494", "9e9e9e", "a8a8a8", "b2b2b2",
	"bcbcbc", "c6c6c6", "d0d0d0", "dadada", "e4e4e4", "eeeeee"
];

},{}],19:[function(require,module,exports){
"use strict";

var push = Array.prototype.push
  , reduce = Array.prototype.reduce
  , abs = Math.abs
  , colors
  , match
  , result
  , i;

colors = require("./xterm-colors").map(function (color) {
	return {
		r: parseInt(color.slice(0, 2), 16),
		g: parseInt(color.slice(2, 4), 16),
		b: parseInt(color.slice(4), 16)
	};
});

match = colors.slice(0, 16);

module.exports = result = [];

i = 0;
while (i < 8) {
	result.push(30 + i++);
}
i = 0;
while (i < 8) {
	result.push(90 + i++);
}
push.apply(
	result,
	colors.slice(16).map(function (data) {
		var index, diff = Infinity;
		match.every(function (innerMatch, currentIndex) {
			var ndiff = reduce.call(
				"rgb",
				function (currentDiff, channel) {
					currentDiff += abs(innerMatch[channel] - data[channel]);
					return currentDiff;
				},
				0
			);
			if (ndiff < diff) {
				index = currentIndex;
				diff = ndiff;
			}
			return ndiff;
		});
		return result[index];
	})
);

},{"./xterm-colors":18}],20:[function(require,module,exports){
"use strict";

var d     = require("d")
  , trunc = require("es5-ext/math/trunc");

var up, down, right, left, abs = Math.abs, floor = Math.floor, max = Math.max;

var getMove = function (control) {
	return function (num) {
		num = isNaN(num) ? 0 : max(floor(num), 0);
		return num ? "\x1b[" + num + control : "";
	};
};

module.exports = Object.defineProperties(
	function (x, y) {
		x = isNaN(x) ? 0 : floor(x);
		y = isNaN(y) ? 0 : floor(y);
		return (x > 0 ? right(x) : left(-x)) + (y > 0 ? down(y) : up(-y));
	},
	{
		up: d((up = getMove("A"))),
		down: d((down = getMove("B"))),
		right: d((right = getMove("C"))),
		left: d((left = getMove("D"))),
		to: d(function (x, y) {
			x = isNaN(x) ? 1 : max(floor(x), 0) + 1;
			y = isNaN(y) ? 1 : max(floor(y), 0) + 1;
			return "\x1b[" + y + ";" + x + "H";
		}),
		lines: d(function (n) {
			var dir;
			n = trunc(n) || 0;
			dir = n >= 0 ? "E" : "F";
			n = floor(abs(n));
			return "\x1b[" + n + dir;
		}),
		top: d("\x1b[5000F"),
		bottom: d("\x1b[5000B"),
		lineBegin: d("\x1b[5000D"),
		lineEnd: d("\x1b[5000C")
	}
);

},{"d":27,"es5-ext/math/trunc":49}],21:[function(require,module,exports){
"use strict";

module.exports = "\x1b[2J\x1b[0;0H";

},{}],22:[function(require,module,exports){
"use strict";

var reAnsi        = require("ansi-regex")
  , stringifiable = require("es5-ext/object/validate-stringifiable-value")
  , length        = require("./get-stripped-length")
  , sgr           = require("./lib/sgr")
  , max           = Math.max;

var Token = function (token) { this.token = token; };

var tokenize = function (str) {
	var match = reAnsi().exec(str);

	if (!match) {
		return [str];
	}

	var index = match.index, head, prehead, tail;

	if (index === 0) {
		head = match[0];
		tail = str.slice(head.length);

		return [new Token(head)].concat(tokenize(tail));
	}

	prehead = str.slice(0, index);
	head = match[0];
	tail = str.slice(index + head.length);

	return [prehead, new Token(head)].concat(tokenize(tail));
};

var isChunkInSlice = function (chunk, index, begin, end) {
	var endIndex = chunk.length + index;

	if (begin > endIndex) return false;
	if (end < index) return false;
	return true;
};

// eslint-disable-next-line max-lines-per-function
var sliceSeq = function (seq, begin, end) {
	var sliced = seq.reduce(
		function (state, chunk) {
			var index = state.index;

			if (chunk instanceof Token) {
				var code = sgr.extractCode(chunk.token);

				if (index <= begin) {
					if (code in sgr.openers) {
						sgr.openStyle(state.preOpeners, code);
					}
					if (code in sgr.closers) {
						sgr.closeStyle(state.preOpeners, code);
					}
				} else if (index < end) {
					if (code in sgr.openers) {
						sgr.openStyle(state.inOpeners, code);
						state.seq.push(chunk);
					} else if (code in sgr.closers) {
						state.inClosers.push(code);
						state.seq.push(chunk);
					}
				}
			} else {
				var nextChunk = "";

				if (isChunkInSlice(chunk, index, begin, end)) {
					var relBegin = Math.max(begin - index, 0)
					  , relEnd = Math.min(end - index, chunk.length);

					nextChunk = chunk.slice(relBegin, relEnd);
				}

				state.seq.push(nextChunk);
				state.index = index + chunk.length;
			}

			return state;
		},
		{
			index: 0,
			seq: [],

			// preOpeners -> [ mod ]
			// preOpeners must be prepended to the slice if they wasn't closed til the end of it
			// preOpeners must be closed if they wasn't closed til the end of the slice
			preOpeners: [],

			// inOpeners  -> [ mod ]
			// inOpeners already in the slice and must not be prepended to the slice
			// inOpeners must be closed if they wasn't closed til the end of the slice
			inOpeners: [], // opener CSI inside slice

			// inClosers -> [ code ]
			// closer CSIs for determining which pre/in-Openers must be closed
			inClosers: []
		}
	);

	sliced.seq = [].concat(
		sgr.prepend(sliced.preOpeners), sliced.seq,
		sgr.complete([].concat(sliced.preOpeners, sliced.inOpeners), sliced.inClosers)
	);

	return sliced.seq;
};

module.exports = function (str/*, begin, end*/) {
	var seq, begin = Number(arguments[1]), end = Number(arguments[2]), len;

	str = stringifiable(str);
	len = length(str);

	if (isNaN(begin)) {
		begin = 0;
	}
	if (isNaN(end)) {
		end = len;
	}
	if (begin < 0) {
		begin = max(len + begin, 0);
	}
	if (end < 0) {
		end = max(len + end, 0);
	}

	seq = tokenize(str);
	seq = sliceSeq(seq, begin, end);
	return seq
		.map(function (chunk) {
			if (chunk instanceof Token) {
				return chunk.token;
			}

			return chunk;
		})
		.join("");
};

},{"./get-stripped-length":15,"./lib/sgr":17,"ansi-regex":9,"es5-ext/object/validate-stringifiable-value":82}],23:[function(require,module,exports){
// Strip ANSI formatting from string

"use strict";

var stringifiable = require("es5-ext/object/validate-stringifiable")
  , r             = require("ansi-regex")();

module.exports = function (str) { return stringifiable(str).replace(r, ""); };

},{"ansi-regex":9,"es5-ext/object/validate-stringifiable":83}],24:[function(require,module,exports){
"use strict";

var compose      = require("es5-ext/function/#/compose")
  , callable     = require("es5-ext/object/valid-callable")
  , d            = require("d")
  , validTimeout = require("timers-ext/valid-timeout");

var chars = "-\\|/", l = chars.length, ThrobberIterator;

ThrobberIterator = function () {
	// no setup needed
};
Object.defineProperties(ThrobberIterator.prototype, {
	index: d(-1),
	running: d(false),
	next: d(function () {
		var str = this.running ? "\u0008" : "";
		if (!this.running) this.running = true;
		return str + chars[this.index = (this.index + 1) % l];
	}),
	reset: d(function () {
		if (!this.running) return "";
		this.index = -1;
		this.running = false;
		return "\u0008";
	})
});

module.exports = exports = function (write, interval/*, format*/) {
	var format = arguments[2], token, iterator = new ThrobberIterator();
	callable(write);
	interval = validTimeout(interval);
	if (format !== undefined) write = compose.call(write, callable(format));
	return {
		start: function () {
			if (token) return;
			token = setInterval(function () { write(iterator.next()); }, interval);
		},
		restart: function () {
			this.stop();
			this.start();
		},
		stop: function () {
			if (!token) return;
			clearInterval(token);
			token = null;
			write(iterator.reset());
		}
	};
};

Object.defineProperty(exports, "Iterator", d(ThrobberIterator));

},{"d":27,"es5-ext/function/#/compose":39,"es5-ext/object/valid-callable":79,"timers-ext/valid-timeout":131}],25:[function(require,module,exports){
(function (process){
"use strict";

var d = require("d");

Object.defineProperties(exports, {
	width: d.gs("ce", function () { return process.stdout.columns || 0; }),
	height: d.gs("ce", function () { return process.stdout.rows || 0; })
});

}).call(this,require('_process'))
},{"_process":149,"d":27}],26:[function(require,module,exports){
"use strict";

var isValue             = require("type/value/is")
  , ensureValue         = require("type/value/ensure")
  , ensurePlainFunction = require("type/plain-function/ensure")
  , copy                = require("es5-ext/object/copy")
  , normalizeOptions    = require("es5-ext/object/normalize-options")
  , map                 = require("es5-ext/object/map");

var bind = Function.prototype.bind
  , defineProperty = Object.defineProperty
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , define;

define = function (name, desc, options) {
	var value = ensureValue(desc) && ensurePlainFunction(desc.value), dgs;
	dgs = copy(desc);
	delete dgs.writable;
	delete dgs.value;
	dgs.get = function () {
		if (!options.overwriteDefinition && hasOwnProperty.call(this, name)) return value;
		desc.value = bind.call(value, options.resolveContext ? options.resolveContext(this) : this);
		defineProperty(this, name, desc);
		return this[name];
	};
	return dgs;
};

module.exports = function (props/*, options*/) {
	var options = normalizeOptions(arguments[1]);
	if (isValue(options.resolveContext)) ensurePlainFunction(options.resolveContext);
	return map(props, function (desc, name) { return define(name, desc, options); });
};

},{"es5-ext/object/copy":61,"es5-ext/object/map":72,"es5-ext/object/normalize-options":74,"type/plain-function/ensure":137,"type/value/ensure":141,"type/value/is":142}],27:[function(require,module,exports){
"use strict";

var isValue         = require("type/value/is")
  , isPlainFunction = require("type/plain-function/is")
  , assign          = require("es5-ext/object/assign")
  , normalizeOpts   = require("es5-ext/object/normalize-options")
  , contains        = require("es5-ext/string/#/contains");

var d = (module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if (arguments.length < 2 || typeof dscr !== "string") {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (isValue(dscr)) {
		c = contains.call(dscr, "c");
		e = contains.call(dscr, "e");
		w = contains.call(dscr, "w");
	} else {
		c = w = true;
		e = false;
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
});

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== "string") {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (!isValue(get)) {
		get = undefined;
	} else if (!isPlainFunction(get)) {
		options = get;
		get = set = undefined;
	} else if (!isValue(set)) {
		set = undefined;
	} else if (!isPlainFunction(set)) {
		options = set;
		set = undefined;
	}
	if (isValue(dscr)) {
		c = contains.call(dscr, "c");
		e = contains.call(dscr, "e");
	} else {
		c = true;
		e = false;
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"es5-ext/object/assign":58,"es5-ext/object/normalize-options":74,"es5-ext/string/#/contains":85,"type/plain-function/is":138,"type/value/is":142}],28:[function(require,module,exports){
"use strict";

var isPlainFunction = require("type/plain-function/is")
  , ensureValue     = require("type/value/ensure")
  , isValue         = require("type/value/is")
  , map             = require("es5-ext/object/map")
  , contains        = require("es5-ext/string/#/contains");

var call = Function.prototype.call
  , defineProperty = Object.defineProperty
  , getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
  , getPrototypeOf = Object.getPrototypeOf
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , cacheDesc = { configurable: false, enumerable: false, writable: false, value: null }
  , define;

define = function (name, options) {
	var value, dgs, cacheName, desc, writable = false, resolvable, flat;
	options = Object(ensureValue(options));
	cacheName = options.cacheName;
	flat = options.flat;
	if (!isValue(cacheName)) cacheName = name;
	delete options.cacheName;
	value = options.value;
	resolvable = isPlainFunction(value);
	delete options.value;
	dgs = { configurable: Boolean(options.configurable), enumerable: Boolean(options.enumerable) };
	if (name !== cacheName) {
		dgs.get = function () {
			if (hasOwnProperty.call(this, cacheName)) return this[cacheName];
			cacheDesc.value = resolvable ? call.call(value, this, options) : value;
			cacheDesc.writable = writable;
			defineProperty(this, cacheName, cacheDesc);
			cacheDesc.value = null;
			if (desc) defineProperty(this, name, desc);
			return this[cacheName];
		};
	} else if (!flat) {
		dgs.get = function self() {
			var ownDesc;
			if (hasOwnProperty.call(this, name)) {
				ownDesc = getOwnPropertyDescriptor(this, name);
				// It happens in Safari, that getter is still called after property
				// was defined with a value, following workarounds that
				// While in IE11 it may happen that here ownDesc is undefined (go figure)
				if (ownDesc) {
					if (ownDesc.hasOwnProperty("value")) return ownDesc.value;
					if (typeof ownDesc.get === "function" && ownDesc.get !== self) {
						return ownDesc.get.call(this);
					}
					return value;
				}
			}
			desc.value = resolvable ? call.call(value, this, options) : value;
			defineProperty(this, name, desc);
			desc.value = null;
			return this[name];
		};
	} else {
		dgs.get = function self() {
			var base = this, ownDesc;
			if (hasOwnProperty.call(this, name)) {
				// It happens in Safari, that getter is still called after property
				// was defined with a value, following workarounds that
				ownDesc = getOwnPropertyDescriptor(this, name);
				if (ownDesc.hasOwnProperty("value")) return ownDesc.value;
				if (typeof ownDesc.get === "function" && ownDesc.get !== self) {
					return ownDesc.get.call(this);
				}
			}
			while (!hasOwnProperty.call(base, name)) base = getPrototypeOf(base);
			desc.value = resolvable ? call.call(value, base, options) : value;
			defineProperty(base, name, desc);
			desc.value = null;
			return base[name];
		};
	}
	dgs.set = function (value) {
		if (hasOwnProperty.call(this, name)) {
			throw new TypeError("Cannot assign to lazy defined '" + name + "' property of " + this);
		}
		dgs.get.call(this);
		this[cacheName] = value;
	};
	if (options.desc) {
		desc = {
			configurable: contains.call(options.desc, "c"),
			enumerable: contains.call(options.desc, "e")
		};
		if (cacheName === name) {
			desc.writable = contains.call(options.desc, "w");
			desc.value = null;
		} else {
			writable = contains.call(options.desc, "w");
			desc.get = dgs.get;
			desc.set = dgs.set;
		}
		delete options.desc;
	} else if (cacheName === name) {
		desc = {
			configurable: Boolean(options.configurable),
			enumerable: Boolean(options.enumerable),
			writable: Boolean(options.writable),
			value: null
		};
	}
	delete options.configurable;
	delete options.enumerable;
	delete options.writable;
	return dgs;
};

module.exports = function (props) {
	return map(props, function (desc, name) { return define(name, desc); });
};

},{"es5-ext/object/map":72,"es5-ext/string/#/contains":85,"type/plain-function/is":138,"type/value/ensure":141,"type/value/is":142}],29:[function(require,module,exports){
// Inspired by Google Closure:
// http://closure-library.googlecode.com/svn/docs/
// closure_goog_array_array.js.html#goog.array.clear

"use strict";

var value = require("../../object/valid-value");

module.exports = function () {
	value(this).length = 0;
	return this;
};

},{"../../object/valid-value":81}],30:[function(require,module,exports){
"use strict";

var numberIsNaN       = require("../../number/is-nan")
  , toPosInt          = require("../../number/to-pos-integer")
  , value             = require("../../object/valid-value")
  , indexOf           = Array.prototype.indexOf
  , objHasOwnProperty = Object.prototype.hasOwnProperty
  , abs               = Math.abs
  , floor             = Math.floor;

module.exports = function (searchElement /*, fromIndex*/) {
	var i, length, fromIndex, val;
	if (!numberIsNaN(searchElement)) return indexOf.apply(this, arguments);

	length = toPosInt(value(this).length);
	fromIndex = arguments[1];
	if (isNaN(fromIndex)) fromIndex = 0;
	else if (fromIndex >= 0) fromIndex = floor(fromIndex);
	else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

	for (i = fromIndex; i < length; ++i) {
		if (objHasOwnProperty.call(this, i)) {
			val = this[i];
			if (numberIsNaN(val)) return i; // Jslint: ignore
		}
	}
	return -1;
};

},{"../../number/is-nan":52,"../../number/to-pos-integer":56,"../../object/valid-value":81}],31:[function(require,module,exports){
"use strict";

var toPosInt          = require("../../number/to-pos-integer")
  , callable          = require("../../object/valid-callable")
  , value             = require("../../object/valid-value")
  , objHasOwnProperty = Object.prototype.hasOwnProperty
  , call              = Function.prototype.call;

module.exports = function (cb /*, thisArg*/) {
	var i, self, thisArg;

	self = Object(value(this));
	callable(cb);
	thisArg = arguments[1];

	for (i = toPosInt(self.length) - 1; i >= 0; --i) {
		if (objHasOwnProperty.call(self, i)) call.call(cb, thisArg, self[i], i, self);
	}
};

},{"../../number/to-pos-integer":56,"../../object/valid-callable":79,"../../object/valid-value":81}],32:[function(require,module,exports){
"use strict";

var indexOf = require("./e-index-of")

  , filter = Array.prototype.filter

  , isFirst;

isFirst = function (value, index) {
	return indexOf.call(this, value) === index;
};

module.exports = function () {
 return filter.call(this, isFirst, this);
};

},{"./e-index-of":30}],33:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Array.from
	: require("./shim");

},{"./is-implemented":34,"./shim":35}],34:[function(require,module,exports){
"use strict";

module.exports = function () {
	var from = Array.from, arr, result;
	if (typeof from !== "function") return false;
	arr = ["raz", "dwa"];
	result = from(arr);
	return Boolean(result && (result !== arr) && (result[1] === "dwa"));
};

},{}],35:[function(require,module,exports){
"use strict";

var iteratorSymbol = require("es6-symbol").iterator
  , isArguments    = require("../../function/is-arguments")
  , isFunction     = require("../../function/is-function")
  , toPosInt       = require("../../number/to-pos-integer")
  , callable       = require("../../object/valid-callable")
  , validValue     = require("../../object/valid-value")
  , isValue        = require("../../object/is-value")
  , isString       = require("../../string/is-string")
  , isArray        = Array.isArray
  , call           = Function.prototype.call
  , desc           = { configurable: true, enumerable: true, writable: true, value: null }
  , defineProperty = Object.defineProperty;

// eslint-disable-next-line complexity, max-lines-per-function
module.exports = function (arrayLike /*, mapFn, thisArg*/) {
	var mapFn = arguments[1]
	  , thisArg = arguments[2]
	  , Context
	  , i
	  , j
	  , arr
	  , length
	  , code
	  , iterator
	  , result
	  , getIterator
	  , value;

	arrayLike = Object(validValue(arrayLike));

	if (isValue(mapFn)) callable(mapFn);
	if (!this || this === Array || !isFunction(this)) {
		// Result: Plain array
		if (!mapFn) {
			if (isArguments(arrayLike)) {
				// Source: Arguments
				length = arrayLike.length;
				if (length !== 1) return Array.apply(null, arrayLike);
				arr = new Array(1);
				arr[0] = arrayLike[0];
				return arr;
			}
			if (isArray(arrayLike)) {
				// Source: Array
				arr = new Array(length = arrayLike.length);
				for (i = 0; i < length; ++i) arr[i] = arrayLike[i];
				return arr;
			}
		}
		arr = [];
	} else {
		// Result: Non plain array
		Context = this;
	}

	if (!isArray(arrayLike)) {
		if ((getIterator = arrayLike[iteratorSymbol]) !== undefined) {
			// Source: Iterator
			iterator = callable(getIterator).call(arrayLike);
			if (Context) arr = new Context();
			result = iterator.next();
			i = 0;
			while (!result.done) {
				value = mapFn ? call.call(mapFn, thisArg, result.value, i) : result.value;
				if (Context) {
					desc.value = value;
					defineProperty(arr, i, desc);
				} else {
					arr[i] = value;
				}
				result = iterator.next();
				++i;
			}
			length = i;
		} else if (isString(arrayLike)) {
			// Source: String
			length = arrayLike.length;
			if (Context) arr = new Context();
			for (i = 0, j = 0; i < length; ++i) {
				value = arrayLike[i];
				if (i + 1 < length) {
					code = value.charCodeAt(0);
					// eslint-disable-next-line max-depth
					if (code >= 0xd800 && code <= 0xdbff) value += arrayLike[++i];
				}
				value = mapFn ? call.call(mapFn, thisArg, value, j) : value;
				if (Context) {
					desc.value = value;
					defineProperty(arr, j, desc);
				} else {
					arr[j] = value;
				}
				++j;
			}
			length = j;
		}
	}
	if (length === undefined) {
		// Source: array or array-like
		length = toPosInt(arrayLike.length);
		if (Context) arr = new Context(length);
		for (i = 0; i < length; ++i) {
			value = mapFn ? call.call(mapFn, thisArg, arrayLike[i], i) : arrayLike[i];
			if (Context) {
				desc.value = value;
				defineProperty(arr, i, desc);
			} else {
				arr[i] = value;
			}
		}
	}
	if (Context) {
		desc.value = null;
		arr.length = length;
	}
	return arr;
};

},{"../../function/is-arguments":41,"../../function/is-function":42,"../../number/to-pos-integer":56,"../../object/is-value":68,"../../object/valid-callable":79,"../../object/valid-value":81,"../../string/is-string":91,"es6-symbol":100}],36:[function(require,module,exports){
"use strict";

var toPosInt = require("../number/to-pos-integer")
  , value    = require("../object/valid-value")
  , slice    = Array.prototype.slice;

module.exports = function (length /*, …fill*/) {
	var arr, currentLength;
	length = toPosInt(value(length));
	if (length === 0) return [];

	arr = arguments.length < 2 ? [undefined] : slice.call(arguments, 1, 1 + length);

	while ((currentLength = arr.length) < length) {
		arr = arr.concat(arr.slice(0, length - currentLength));
	}
	return arr;
};

},{"../number/to-pos-integer":56,"../object/valid-value":81}],37:[function(require,module,exports){
"use strict";

var from = require("./from")

  , isArray = Array.isArray;

module.exports = function (arrayLike) {
	return isArray(arrayLike) ? arrayLike : from(arrayLike);
};

},{"./from":33}],38:[function(require,module,exports){
"use strict";

var assign            = require("../object/assign")
  , isObject          = require("../object/is-object")
  , isValue           = require("../object/is-value")
  , captureStackTrace = Error.captureStackTrace;

exports = module.exports = function (message /*, code, ext*/) {
	var err = new Error(message), code = arguments[1], ext = arguments[2];
	if (!isValue(ext)) {
		if (isObject(code)) {
			ext = code;
			code = null;
		}
	}
	if (isValue(ext)) assign(err, ext);
	if (isValue(code)) err.code = code;
	if (captureStackTrace) captureStackTrace(err, exports);
	return err;
};

},{"../object/assign":58,"../object/is-object":67,"../object/is-value":68}],39:[function(require,module,exports){
"use strict";

var isValue  = require("../../object/is-value")
  , callable = require("../../object/valid-callable")
  , aFrom    = require("../../array/from");

var apply = Function.prototype.apply
  , call = Function.prototype.call
  , callFn = function (arg, fn) { return call.call(fn, this, arg); };

module.exports = function (fnIgnored/*, …fnn*/) {
	var fns, first;
	var args = aFrom(arguments);
	fns = isValue(this) ? [this].concat(args) : args;
	fns.forEach(callable);
	fns = fns.reverse();
	first = fns[0];
	fns = fns.slice(1);
	return function (argIgnored) { return fns.reduce(callFn, apply.call(first, this, arguments)); };
};

},{"../../array/from":33,"../../object/is-value":68,"../../object/valid-callable":79}],40:[function(require,module,exports){
"use strict";

var toPosInt = require("../number/to-pos-integer");

var test = function (arg1, arg2) {
	return arg2;
};

var desc, defineProperty, generate, mixin;

try {
	Object.defineProperty(test, "length", {
		configurable: true,
		writable: false,
		enumerable: false,
		value: 1
	});
} catch (ignore) {}

if (test.length === 1) {
	// ES6
	desc = { configurable: true, writable: false, enumerable: false };
	defineProperty = Object.defineProperty;
	module.exports = function (fn, length) {
		length = toPosInt(length);
		if (fn.length === length) return fn;
		desc.value = length;
		return defineProperty(fn, "length", desc);
	};
} else {
	mixin = require("../object/mixin");
	generate = (function () {
		var cache = [];
		return function (length) {
			var args, i = 0;
			if (cache[length]) return cache[length];
			args = [];
			while (length--) args.push("a" + (++i).toString(36));
			// eslint-disable-next-line no-new-func
			return new Function(
				"fn",
				"return function (" + args.join(", ") + ") { return fn.apply(this, arguments); };"
			);
		};
	}());
	module.exports = function (src, length) {
		var target;
		length = toPosInt(length);
		if (src.length === length) return src;
		target = generate(length)(src);
		try {
			mixin(target, src);
		} catch (ignore) {}
		return target;
	};
}

},{"../number/to-pos-integer":56,"../object/mixin":73}],41:[function(require,module,exports){
"use strict";

var objToString = Object.prototype.toString
  , id = objToString.call(
	(function () {
		return arguments;
	})()
);

module.exports = function (value) {
	return objToString.call(value) === id;
};

},{}],42:[function(require,module,exports){
"use strict";

var objToString = Object.prototype.toString, id = objToString.call(require("./noop"));

module.exports = function (value) {
	return typeof value === "function" && objToString.call(value) === id;
};

},{"./noop":43}],43:[function(require,module,exports){
"use strict";

// eslint-disable-next-line no-empty-function
module.exports = function () {};

},{}],44:[function(require,module,exports){
"use strict";

var iteratorSymbol = require("es6-symbol").iterator
  , isValue        = require("../object/is-value")
  , isArrayLike    = require("../object/is-array-like");

module.exports = function (value) {
	if (!isValue(value)) return false;
	if (typeof value[iteratorSymbol] === "function") return true;
	return isArrayLike(value);
};

},{"../object/is-array-like":65,"../object/is-value":68,"es6-symbol":100}],45:[function(require,module,exports){
"use strict";

var isObject = require("../object/is-object")
  , is       = require("./is");

module.exports = function (value) {
	if (is(value) && isObject(value)) return value;
	throw new TypeError(value + " is not an iterable or array-like object");
};

},{"../object/is-object":67,"./is":44}],46:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Math.sign
	: require("./shim");

},{"./is-implemented":47,"./shim":48}],47:[function(require,module,exports){
"use strict";

module.exports = function () {
	var sign = Math.sign;
	if (typeof sign !== "function") return false;
	return (sign(10) === 1) && (sign(-20) === -1);
};

},{}],48:[function(require,module,exports){
"use strict";

module.exports = function (value) {
	value = Number(value);
	if (isNaN(value) || (value === 0)) return value;
	return value > 0 ? 1 : -1;
};

},{}],49:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Math.trunc
	: require("./shim");

},{"./is-implemented":50,"./shim":51}],50:[function(require,module,exports){
"use strict";

module.exports = function () {
	var trunc = Math.trunc;
	if (typeof trunc !== "function") return false;
	return (trunc(13.67) === 13) && (trunc(-13.67) === -13);
};

},{}],51:[function(require,module,exports){
"use strict";

var floor = Math.floor;

module.exports = function (value) {
	if (isNaN(value)) return NaN;
	value = Number(value);
	if (value === 0) return value;
	if (value === Infinity) return Infinity;
	if (value === -Infinity) return -Infinity;
	if (value > 0) return floor(value);
	return -floor(-value);
};

},{}],52:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Number.isNaN
	: require("./shim");

},{"./is-implemented":53,"./shim":54}],53:[function(require,module,exports){
"use strict";

module.exports = function () {
	var numberIsNaN = Number.isNaN;
	if (typeof numberIsNaN !== "function") return false;
	return !numberIsNaN({}) && numberIsNaN(NaN) && !numberIsNaN(34);
};

},{}],54:[function(require,module,exports){
"use strict";

module.exports = function (value) {
	// eslint-disable-next-line no-self-compare
	return value !== value;
};

},{}],55:[function(require,module,exports){
"use strict";

var sign = require("../math/sign")

  , abs = Math.abs, floor = Math.floor;

module.exports = function (value) {
	if (isNaN(value)) return 0;
	value = Number(value);
	if ((value === 0) || !isFinite(value)) return value;
	return sign(value) * floor(abs(value));
};

},{"../math/sign":46}],56:[function(require,module,exports){
"use strict";

var toInteger = require("./to-integer")

  , max = Math.max;

module.exports = function (value) {
 return max(0, toInteger(value));
};

},{"./to-integer":55}],57:[function(require,module,exports){
// Internal method, used by iteration functions.
// Calls a function for each key-value pair found in object
// Optionally takes compareFn to iterate object in specific order

"use strict";

var callable                = require("./valid-callable")
  , value                   = require("./valid-value")
  , bind                    = Function.prototype.bind
  , call                    = Function.prototype.call
  , keys                    = Object.keys
  , objPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (method, defVal) {
	return function (obj, cb /*, thisArg, compareFn*/) {
		var list, thisArg = arguments[2], compareFn = arguments[3];
		obj = Object(value(obj));
		callable(cb);

		list = keys(obj);
		if (compareFn) {
			list.sort(typeof compareFn === "function" ? bind.call(compareFn, obj) : undefined);
		}
		if (typeof method !== "function") method = list[method];
		return call.call(method, list, function (key, index) {
			if (!objPropertyIsEnumerable.call(obj, key)) return defVal;
			return call.call(cb, thisArg, obj[key], key, obj, index);
		});
	};
};

},{"./valid-callable":79,"./valid-value":81}],58:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Object.assign
	: require("./shim");

},{"./is-implemented":59,"./shim":60}],59:[function(require,module,exports){
"use strict";

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") return false;
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return (obj.foo + obj.bar + obj.trzy) === "razdwatrzy";
};

},{}],60:[function(require,module,exports){
"use strict";

var keys  = require("../keys")
  , value = require("../valid-value")
  , max   = Math.max;

module.exports = function (dest, src /*, …srcn*/) {
	var error, i, length = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try {
			dest[key] = src[key];
		} catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < length; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":69,"../valid-value":81}],61:[function(require,module,exports){
"use strict";

var aFrom  = require("../array/from")
  , assign = require("./assign")
  , value  = require("./valid-value");

module.exports = function (obj/*, propertyNames, options*/) {
	var copy = Object(value(obj)), propertyNames = arguments[1], options = Object(arguments[2]);
	if (copy !== obj && !propertyNames) return copy;
	var result = {};
	if (propertyNames) {
		aFrom(propertyNames, function (propertyName) {
			if (options.ensure || propertyName in obj) result[propertyName] = obj[propertyName];
		});
	} else {
		assign(result, obj);
	}
	return result;
};

},{"../array/from":33,"./assign":58,"./valid-value":81}],62:[function(require,module,exports){
// Workaround for http://code.google.com/p/v8/issues/detail?id=2804

"use strict";

var create = Object.create, shim;

if (!require("./set-prototype-of/is-implemented")()) {
	shim = require("./set-prototype-of/shim");
}

module.exports = (function () {
	var nullObject, polyProps, desc;
	if (!shim) return create;
	if (shim.level !== 1) return create;

	nullObject = {};
	polyProps = {};
	desc = {
		configurable: false,
		enumerable: false,
		writable: true,
		value: undefined
	};
	Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
		if (name === "__proto__") {
			polyProps[name] = {
				configurable: true,
				enumerable: false,
				writable: true,
				value: undefined
			};
			return;
		}
		polyProps[name] = desc;
	});
	Object.defineProperties(nullObject, polyProps);

	Object.defineProperty(shim, "nullPolyfill", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: nullObject
	});

	return function (prototype, props) {
		return create(prototype === null ? nullObject : prototype, props);
	};
}());

},{"./set-prototype-of/is-implemented":77,"./set-prototype-of/shim":78}],63:[function(require,module,exports){
"use strict";

var value                   = require("./valid-value")
  , objPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (obj) {
	var i;
	value(obj);
	for (i in obj) {
		if (objPropertyIsEnumerable.call(obj, i)) return i;
	}
	return null;
};

},{"./valid-value":81}],64:[function(require,module,exports){
"use strict";

module.exports = require("./_iterate")("forEach");

},{"./_iterate":57}],65:[function(require,module,exports){
"use strict";

var isFunction = require("../function/is-function")
  , isObject   = require("./is-object")
  , isValue    = require("./is-value");

module.exports = function (value) {
	return (
		(isValue(value) &&
			typeof value.length === "number" &&
			// Just checking ((typeof x === 'object') && (typeof x !== 'function'))
			// won't work right for some cases, e.g.:
			// type of instance of NodeList in Safari is a 'function'
			((isObject(value) && !isFunction(value)) || typeof value === "string")) ||
		false
	);
};

},{"../function/is-function":42,"./is-object":67,"./is-value":68}],66:[function(require,module,exports){
// Deprecated

"use strict";

module.exports = function (obj) {
 return typeof obj === "function";
};

},{}],67:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

var map = { function: true, object: true };

module.exports = function (value) {
	return (isValue(value) && map[typeof value]) || false;
};

},{"./is-value":68}],68:[function(require,module,exports){
"use strict";

var _undefined = require("../function/noop")(); // Support ES3 engines

module.exports = function (val) {
 return (val !== _undefined) && (val !== null);
};

},{"../function/noop":43}],69:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")() ? Object.keys : require("./shim");

},{"./is-implemented":70,"./shim":71}],70:[function(require,module,exports){
"use strict";

module.exports = function () {
	try {
		Object.keys("primitive");
		return true;
	} catch (e) {
		return false;
	}
};

},{}],71:[function(require,module,exports){
"use strict";

var isValue = require("../is-value");

var keys = Object.keys;

module.exports = function (object) { return keys(isValue(object) ? Object(object) : object); };

},{"../is-value":68}],72:[function(require,module,exports){
"use strict";

var callable = require("./valid-callable")
  , forEach  = require("./for-each")
  , call     = Function.prototype.call;

module.exports = function (obj, cb /*, thisArg*/) {
	var result = {}, thisArg = arguments[2];
	callable(cb);
	forEach(obj, function (value, key, targetObj, index) {
		result[key] = call.call(cb, thisArg, value, key, targetObj, index);
	});
	return result;
};

},{"./for-each":64,"./valid-callable":79}],73:[function(require,module,exports){
"use strict";

var value = require("./valid-value")

  , defineProperty = Object.defineProperty
  , getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
  , getOwnPropertyNames = Object.getOwnPropertyNames
  , getOwnPropertySymbols = Object.getOwnPropertySymbols;

module.exports = function (target, source) {
	var error, sourceObject = Object(value(source));
	target = Object(value(target));
	getOwnPropertyNames(sourceObject).forEach(function (name) {
		try {
			defineProperty(target, name, getOwnPropertyDescriptor(source, name));
		} catch (e) {
 error = e;
}
	});
	if (typeof getOwnPropertySymbols === "function") {
		getOwnPropertySymbols(sourceObject).forEach(function (symbol) {
			try {
				defineProperty(target, symbol, getOwnPropertyDescriptor(source, symbol));
			} catch (e) {
 error = e;
}
		});
	}
	if (error !== undefined) throw error;
	return target;
};

},{"./valid-value":81}],74:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

// eslint-disable-next-line no-unused-vars
module.exports = function (opts1 /*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (!isValue(options)) return;
		process(Object(options), result);
	});
	return result;
};

},{"./is-value":68}],75:[function(require,module,exports){
"use strict";

var forEach = Array.prototype.forEach, create = Object.create;

// eslint-disable-next-line no-unused-vars
module.exports = function (arg /*, …args*/) {
	var set = create(null);
	forEach.call(arguments, function (name) {
		set[name] = true;
	});
	return set;
};

},{}],76:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Object.setPrototypeOf
	: require("./shim");

},{"./is-implemented":77,"./shim":78}],77:[function(require,module,exports){
"use strict";

var create = Object.create, getPrototypeOf = Object.getPrototypeOf, plainObject = {};

module.exports = function (/* CustomCreate*/) {
	var setPrototypeOf = Object.setPrototypeOf, customCreate = arguments[0] || create;
	if (typeof setPrototypeOf !== "function") return false;
	return getPrototypeOf(setPrototypeOf(customCreate(null), plainObject)) === plainObject;
};

},{}],78:[function(require,module,exports){
/* eslint no-proto: "off" */

// Big thanks to @WebReflection for sorting this out
// https://gist.github.com/WebReflection/5593554

"use strict";

var isObject        = require("../is-object")
  , value           = require("../valid-value")
  , objIsPrototypeOf = Object.prototype.isPrototypeOf
  , defineProperty  = Object.defineProperty
  , nullDesc        = {
	configurable: true,
	enumerable: false,
	writable: true,
	value: undefined
}
  , validate;

validate = function (obj, prototype) {
	value(obj);
	if (prototype === null || isObject(prototype)) return obj;
	throw new TypeError("Prototype must be null or an object");
};

module.exports = (function (status) {
	var fn, set;
	if (!status) return null;
	if (status.level === 2) {
		if (status.set) {
			set = status.set;
			fn = function (obj, prototype) {
				set.call(validate(obj, prototype), prototype);
				return obj;
			};
		} else {
			fn = function (obj, prototype) {
				validate(obj, prototype).__proto__ = prototype;
				return obj;
			};
		}
	} else {
		fn = function self(obj, prototype) {
			var isNullBase;
			validate(obj, prototype);
			isNullBase = objIsPrototypeOf.call(self.nullPolyfill, obj);
			if (isNullBase) delete self.nullPolyfill.__proto__;
			if (prototype === null) prototype = self.nullPolyfill;
			obj.__proto__ = prototype;
			if (isNullBase) defineProperty(self.nullPolyfill, "__proto__", nullDesc);
			return obj;
		};
	}
	return Object.defineProperty(fn, "level", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: status.level
	});
}(
	(function () {
		var tmpObj1 = Object.create(null)
		  , tmpObj2 = {}
		  , set
		  , desc = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");

		if (desc) {
			try {
				set = desc.set; // Opera crashes at this point
				set.call(tmpObj1, tmpObj2);
			} catch (ignore) {}
			if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { set: set, level: 2 };
		}

		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { level: 2 };

		tmpObj1 = {};
		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { level: 1 };

		return false;
	})()
));

require("../create");

},{"../create":62,"../is-object":67,"../valid-value":81}],79:[function(require,module,exports){
"use strict";

module.exports = function (fn) {
	if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
	return fn;
};

},{}],80:[function(require,module,exports){
"use strict";

var isObject = require("./is-object");

module.exports = function (value) {
	if (!isObject(value)) throw new TypeError(value + " is not an Object");
	return value;
};

},{"./is-object":67}],81:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

module.exports = function (value) {
	if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{"./is-value":68}],82:[function(require,module,exports){
"use strict";

var ensureValue   = require("./valid-value")
  , stringifiable = require("./validate-stringifiable");

module.exports = function (value) {
	return stringifiable(ensureValue(value));
};

},{"./valid-value":81,"./validate-stringifiable":83}],83:[function(require,module,exports){
"use strict";

var isCallable = require("./is-callable");

module.exports = function (stringifiable) {
	try {
		if (stringifiable && isCallable(stringifiable.toString)) return stringifiable.toString();
		return String(stringifiable);
	} catch (e) {
		throw new TypeError("Passed argument cannot be stringifed");
	}
};

},{"./is-callable":66}],84:[function(require,module,exports){
"use strict";

var isCallable = require("./object/is-callable");

module.exports = function (value) {
	try {
		if (value && isCallable(value.toString)) return value.toString();
		return String(value);
	} catch (e) {
		return "<Non-coercible to string value>";
	}
};

},{"./object/is-callable":66}],85:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? String.prototype.contains
	: require("./shim");

},{"./is-implemented":86,"./shim":87}],86:[function(require,module,exports){
"use strict";

var str = "razdwatrzy";

module.exports = function () {
	if (typeof str.contains !== "function") return false;
	return (str.contains("dwa") === true) && (str.contains("foo") === false);
};

},{}],87:[function(require,module,exports){
"use strict";

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],88:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? String.prototype.repeat
	: require("./shim");

},{"./is-implemented":89,"./shim":90}],89:[function(require,module,exports){
"use strict";

var str = "foo";

module.exports = function () {
	if (typeof str.repeat !== "function") return false;
	return str.repeat(2) === "foofoo";
};

},{}],90:[function(require,module,exports){
// Thanks
// @rauchma http://www.2ality.com/2014/01/efficient-string-repeat.html
// @mathiasbynens https://github.com/mathiasbynens/String.prototype.repeat/blob/4a4b567def/repeat.js

"use strict";

var value     = require("../../../object/valid-value")
  , toInteger = require("../../../number/to-integer");

module.exports = function (count) {
	var str = String(value(this)), result;
	count = toInteger(count);
	if (count < 0) throw new RangeError("Count must be >= 0");
	if (!isFinite(count)) throw new RangeError("Count must be < ∞");

	result = "";
	while (count) {
		if (count % 2) result += str;
		if (count > 1) str += str;
		// eslint-disable-next-line no-bitwise
		count >>= 1;
	}
	return result;
};

},{"../../../number/to-integer":55,"../../../object/valid-value":81}],91:[function(require,module,exports){
"use strict";

var objToString = Object.prototype.toString, id = objToString.call("");

module.exports = function (value) {
	return (
		typeof value === "string" ||
		(value &&
			typeof value === "object" &&
			(value instanceof String || objToString.call(value) === id)) ||
		false
	);
};

},{}],92:[function(require,module,exports){
"use strict";

var safeToString = require("./safe-to-string");

var reNewLine = /[\n\r\u2028\u2029]/g;

module.exports = function (value) {
	var string = safeToString(value);
	// Trim if too long
	if (string.length > 100) string = string.slice(0, 99) + "…";
	// Replace eventual new lines
	string = string.replace(reNewLine, function (char) {
		return JSON.stringify(char).slice(1, -1);
	});
	return string;
};

},{"./safe-to-string":84}],93:[function(require,module,exports){
"use strict";

var setPrototypeOf = require("es5-ext/object/set-prototype-of")
  , contains       = require("es5-ext/string/#/contains")
  , d              = require("d")
  , Symbol         = require("es6-symbol")
  , Iterator       = require("./");

var defineProperty = Object.defineProperty, ArrayIterator;

ArrayIterator = module.exports = function (arr, kind) {
	if (!(this instanceof ArrayIterator)) throw new TypeError("Constructor requires 'new'");
	Iterator.call(this, arr);
	if (!kind) kind = "value";
	else if (contains.call(kind, "key+value")) kind = "key+value";
	else if (contains.call(kind, "key")) kind = "key";
	else kind = "value";
	defineProperty(this, "__kind__", d("", kind));
};
if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

// Internal %ArrayIteratorPrototype% doesn't expose its constructor
delete ArrayIterator.prototype.constructor;

ArrayIterator.prototype = Object.create(Iterator.prototype, {
	_resolve: d(function (i) {
		if (this.__kind__ === "value") return this.__list__[i];
		if (this.__kind__ === "key+value") return [i, this.__list__[i]];
		return i;
	})
});
defineProperty(ArrayIterator.prototype, Symbol.toStringTag, d("c", "Array Iterator"));

},{"./":96,"d":27,"es5-ext/object/set-prototype-of":76,"es5-ext/string/#/contains":85,"es6-symbol":100}],94:[function(require,module,exports){
"use strict";

var isArguments = require("es5-ext/function/is-arguments")
  , callable    = require("es5-ext/object/valid-callable")
  , isString    = require("es5-ext/string/is-string")
  , get         = require("./get");

var isArray = Array.isArray, call = Function.prototype.call, some = Array.prototype.some;

module.exports = function (iterable, cb /*, thisArg*/) {
	var mode, thisArg = arguments[2], result, doBreak, broken, i, length, char, code;
	if (isArray(iterable) || isArguments(iterable)) mode = "array";
	else if (isString(iterable)) mode = "string";
	else iterable = get(iterable);

	callable(cb);
	doBreak = function () {
		broken = true;
	};
	if (mode === "array") {
		some.call(iterable, function (value) {
			call.call(cb, thisArg, value, doBreak);
			return broken;
		});
		return;
	}
	if (mode === "string") {
		length = iterable.length;
		for (i = 0; i < length; ++i) {
			char = iterable[i];
			if (i + 1 < length) {
				code = char.charCodeAt(0);
				if (code >= 0xd800 && code <= 0xdbff) char += iterable[++i];
			}
			call.call(cb, thisArg, char, doBreak);
			if (broken) break;
		}
		return;
	}
	result = iterable.next();

	while (!result.done) {
		call.call(cb, thisArg, result.value, doBreak);
		if (broken) return;
		result = iterable.next();
	}
};

},{"./get":95,"es5-ext/function/is-arguments":41,"es5-ext/object/valid-callable":79,"es5-ext/string/is-string":91}],95:[function(require,module,exports){
"use strict";

var isArguments    = require("es5-ext/function/is-arguments")
  , isString       = require("es5-ext/string/is-string")
  , ArrayIterator  = require("./array")
  , StringIterator = require("./string")
  , iterable       = require("./valid-iterable")
  , iteratorSymbol = require("es6-symbol").iterator;

module.exports = function (obj) {
	if (typeof iterable(obj)[iteratorSymbol] === "function") return obj[iteratorSymbol]();
	if (isArguments(obj)) return new ArrayIterator(obj);
	if (isString(obj)) return new StringIterator(obj);
	return new ArrayIterator(obj);
};

},{"./array":93,"./string":98,"./valid-iterable":99,"es5-ext/function/is-arguments":41,"es5-ext/string/is-string":91,"es6-symbol":100}],96:[function(require,module,exports){
"use strict";

var clear    = require("es5-ext/array/#/clear")
  , assign   = require("es5-ext/object/assign")
  , callable = require("es5-ext/object/valid-callable")
  , value    = require("es5-ext/object/valid-value")
  , d        = require("d")
  , autoBind = require("d/auto-bind")
  , Symbol   = require("es6-symbol");

var defineProperty = Object.defineProperty, defineProperties = Object.defineProperties, Iterator;

module.exports = Iterator = function (list, context) {
	if (!(this instanceof Iterator)) throw new TypeError("Constructor requires 'new'");
	defineProperties(this, {
		__list__: d("w", value(list)),
		__context__: d("w", context),
		__nextIndex__: d("w", 0)
	});
	if (!context) return;
	callable(context.on);
	context.on("_add", this._onAdd);
	context.on("_delete", this._onDelete);
	context.on("_clear", this._onClear);
};

// Internal %IteratorPrototype% doesn't expose its constructor
delete Iterator.prototype.constructor;

defineProperties(
	Iterator.prototype,
	assign(
		{
			_next: d(function () {
				var i;
				if (!this.__list__) return undefined;
				if (this.__redo__) {
					i = this.__redo__.shift();
					if (i !== undefined) return i;
				}
				if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
				this._unBind();
				return undefined;
			}),
			next: d(function () {
				return this._createResult(this._next());
			}),
			_createResult: d(function (i) {
				if (i === undefined) return { done: true, value: undefined };
				return { done: false, value: this._resolve(i) };
			}),
			_resolve: d(function (i) {
				return this.__list__[i];
			}),
			_unBind: d(function () {
				this.__list__ = null;
				delete this.__redo__;
				if (!this.__context__) return;
				this.__context__.off("_add", this._onAdd);
				this.__context__.off("_delete", this._onDelete);
				this.__context__.off("_clear", this._onClear);
				this.__context__ = null;
			}),
			toString: d(function () {
				return "[object " + (this[Symbol.toStringTag] || "Object") + "]";
			})
		},
		autoBind({
			_onAdd: d(function (index) {
				if (index >= this.__nextIndex__) return;
				++this.__nextIndex__;
				if (!this.__redo__) {
					defineProperty(this, "__redo__", d("c", [index]));
					return;
				}
				this.__redo__.forEach(function (redo, i) {
					if (redo >= index) this.__redo__[i] = ++redo;
				}, this);
				this.__redo__.push(index);
			}),
			_onDelete: d(function (index) {
				var i;
				if (index >= this.__nextIndex__) return;
				--this.__nextIndex__;
				if (!this.__redo__) return;
				i = this.__redo__.indexOf(index);
				if (i !== -1) this.__redo__.splice(i, 1);
				this.__redo__.forEach(function (redo, j) {
					if (redo > index) this.__redo__[j] = --redo;
				}, this);
			}),
			_onClear: d(function () {
				if (this.__redo__) clear.call(this.__redo__);
				this.__nextIndex__ = 0;
			})
		})
	)
);

defineProperty(
	Iterator.prototype,
	Symbol.iterator,
	d(function () {
		return this;
	})
);

},{"d":27,"d/auto-bind":26,"es5-ext/array/#/clear":29,"es5-ext/object/assign":58,"es5-ext/object/valid-callable":79,"es5-ext/object/valid-value":81,"es6-symbol":100}],97:[function(require,module,exports){
"use strict";

var isArguments = require("es5-ext/function/is-arguments")
  , isValue     = require("es5-ext/object/is-value")
  , isString    = require("es5-ext/string/is-string");

var iteratorSymbol = require("es6-symbol").iterator
  , isArray        = Array.isArray;

module.exports = function (value) {
	if (!isValue(value)) return false;
	if (isArray(value)) return true;
	if (isString(value)) return true;
	if (isArguments(value)) return true;
	return typeof value[iteratorSymbol] === "function";
};

},{"es5-ext/function/is-arguments":41,"es5-ext/object/is-value":68,"es5-ext/string/is-string":91,"es6-symbol":100}],98:[function(require,module,exports){
// Thanks @mathiasbynens
// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols

"use strict";

var setPrototypeOf = require("es5-ext/object/set-prototype-of")
  , d              = require("d")
  , Symbol         = require("es6-symbol")
  , Iterator       = require("./");

var defineProperty = Object.defineProperty, StringIterator;

StringIterator = module.exports = function (str) {
	if (!(this instanceof StringIterator)) throw new TypeError("Constructor requires 'new'");
	str = String(str);
	Iterator.call(this, str);
	defineProperty(this, "__length__", d("", str.length));
};
if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

// Internal %ArrayIteratorPrototype% doesn't expose its constructor
delete StringIterator.prototype.constructor;

StringIterator.prototype = Object.create(Iterator.prototype, {
	_next: d(function () {
		if (!this.__list__) return undefined;
		if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
		this._unBind();
		return undefined;
	}),
	_resolve: d(function (i) {
		var char = this.__list__[i], code;
		if (this.__nextIndex__ === this.__length__) return char;
		code = char.charCodeAt(0);
		if (code >= 0xd800 && code <= 0xdbff) return char + this.__list__[this.__nextIndex__++];
		return char;
	})
});
defineProperty(StringIterator.prototype, Symbol.toStringTag, d("c", "String Iterator"));

},{"./":96,"d":27,"es5-ext/object/set-prototype-of":76,"es6-symbol":100}],99:[function(require,module,exports){
"use strict";

var isIterable = require("./is-iterable");

module.exports = function (value) {
	if (!isIterable(value)) throw new TypeError(value + " is not iterable");
	return value;
};

},{"./is-iterable":97}],100:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')() ? Symbol : require('./polyfill');

},{"./is-implemented":101,"./polyfill":103}],101:[function(require,module,exports){
'use strict';

var validTypes = { object: true, symbol: true };

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }

	// Return 'true' also for polyfills
	if (!validTypes[typeof Symbol.iterator]) return false;
	if (!validTypes[typeof Symbol.toPrimitive]) return false;
	if (!validTypes[typeof Symbol.toStringTag]) return false;

	return true;
};

},{}],102:[function(require,module,exports){
'use strict';

module.exports = function (x) {
	if (!x) return false;
	if (typeof x === 'symbol') return true;
	if (!x.constructor) return false;
	if (x.constructor.name !== 'Symbol') return false;
	return (x[x.constructor.toStringTag] === 'Symbol');
};

},{}],103:[function(require,module,exports){
// ES2015 Symbol polyfill for environments that do not (or partially) support it

'use strict';

var d              = require('d')
  , validateSymbol = require('./validate-symbol')

  , create = Object.create, defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
  , isNativeSafe;

if (typeof Symbol === 'function') {
	NativeSymbol = Symbol;
	try {
		String(NativeSymbol());
		isNativeSafe = true;
	} catch (ignore) {}
}

var generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0, name, ie11BugWorkaround;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) return;
			ie11BugWorkaround = true;
			defineProperty(this, name, d(value));
			ie11BugWorkaround = false;
		}));
		return name;
	};
}());

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('Symbol is not a constructor');
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError('Symbol is not a constructor');
	if (isNativeSafe) return NativeSymbol(description);
	symbol = create(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(SymbolPolyfill, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return (globalSymbols[key] = SymbolPolyfill(String(key)));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) if (globalSymbols[key] === s) return key;
	}),

	// To ensure proper interoperability with other native functions (e.g. Array.from)
	// fallback to eventual native implementation of given symbol
	hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
	isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
		SymbolPolyfill('isConcatSpreadable')),
	iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
	match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
	replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
	search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
	species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
	split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
	toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
	toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
	unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
});

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d(SymbolPolyfill),
	toString: d('', function () { return this.__name__; })
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
	var symbol = validateSymbol(this);
	if (typeof symbol === 'symbol') return symbol;
	return symbol.toString();
}));
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));

},{"./validate-symbol":104,"d":27}],104:[function(require,module,exports){
'use strict';

var isSymbol = require('./is-symbol');

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};

},{"./is-symbol":102}],105:[function(require,module,exports){
'use strict';

var d        = require('d')
  , callable = require('es5-ext/object/valid-callable')

  , apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , descriptor = { configurable: true, enumerable: false, writable: true }

  , on, once, off, emit, methods, descriptors, base;

on = function (type, listener) {
	var data;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) {
		data = descriptor.value = create(null);
		defineProperty(this, '__ee__', descriptor);
		descriptor.value = null;
	} else {
		data = this.__ee__;
	}
	if (!data[type]) data[type] = listener;
	else if (typeof data[type] === 'object') data[type].push(listener);
	else data[type] = [data[type], listener];

	return this;
};

once = function (type, listener) {
	var once, self;

	callable(listener);
	self = this;
	on.call(this, type, once = function () {
		off.call(self, type, once);
		apply.call(listener, this, arguments);
	});

	once.__eeOnceListener__ = listener;
	return this;
};

off = function (type, listener) {
	var data, listeners, candidate, i;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) return this;
	data = this.__ee__;
	if (!data[type]) return this;
	listeners = data[type];

	if (typeof listeners === 'object') {
		for (i = 0; (candidate = listeners[i]); ++i) {
			if ((candidate === listener) ||
					(candidate.__eeOnceListener__ === listener)) {
				if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
				else listeners.splice(i, 1);
			}
		}
	} else {
		if ((listeners === listener) ||
				(listeners.__eeOnceListener__ === listener)) {
			delete data[type];
		}
	}

	return this;
};

emit = function (type) {
	var i, l, listener, listeners, args;

	if (!hasOwnProperty.call(this, '__ee__')) return;
	listeners = this.__ee__[type];
	if (!listeners) return;

	if (typeof listeners === 'object') {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

		listeners = listeners.slice();
		for (i = 0; (listener = listeners[i]); ++i) {
			apply.call(listener, this, args);
		}
	} else {
		switch (arguments.length) {
		case 1:
			call.call(listeners, this);
			break;
		case 2:
			call.call(listeners, this, arguments[1]);
			break;
		case 3:
			call.call(listeners, this, arguments[1], arguments[2]);
			break;
		default:
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) {
				args[i - 1] = arguments[i];
			}
			apply.call(listeners, this, args);
		}
	}
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit
};

descriptors = {
	on: d(on),
	once: d(once),
	off: d(off),
	emit: d(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function (o) {
	return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;

},{"d":27,"es5-ext/object/valid-callable":79}],106:[function(require,module,exports){
module.exports = isPromise;

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

},{}],107:[function(require,module,exports){
'use strict';

var toPosInt = require('es5-ext/number/to-pos-integer')

  , create = Object.create, hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = function (limit) {
	var size = 0, base = 1, queue = create(null), map = create(null), index = 0, del;
	limit = toPosInt(limit);
	return {
		hit: function (id) {
			var oldIndex = map[id], nuIndex = ++index;
			queue[nuIndex] = id;
			map[id] = nuIndex;
			if (!oldIndex) {
				++size;
				if (size <= limit) return;
				id = queue[base];
				del(id);
				return id;
			}
			delete queue[oldIndex];
			if (base !== oldIndex) return;
			while (!hasOwnProperty.call(queue, ++base)) continue; //jslint: skip
		},
		delete: del = function (id) {
			var oldIndex = map[id];
			if (!oldIndex) return;
			delete queue[oldIndex];
			delete map[id];
			--size;
			if (base !== oldIndex) return;
			if (!size) {
				index = 0;
				base = 1;
				return;
			}
			while (!hasOwnProperty.call(queue, ++base)) continue; //jslint: skip
		},
		clear: function () {
			size = 0;
			base = 1;
			queue = create(null);
			map = create(null);
			index = 0;
		}
	};
};

},{"es5-ext/number/to-pos-integer":56}],108:[function(require,module,exports){
/* eslint consistent-this: 0, no-shadow:0, no-eq-null: 0, eqeqeq: 0, no-unused-vars: 0 */

// Support for asynchronous functions

"use strict";

var aFrom        = require("es5-ext/array/from")
  , objectMap    = require("es5-ext/object/map")
  , mixin        = require("es5-ext/object/mixin")
  , defineLength = require("es5-ext/function/_define-length")
  , nextTick     = require("next-tick");

var slice = Array.prototype.slice, apply = Function.prototype.apply, create = Object.create;

require("../lib/registered-extensions").async = function (tbi, conf) {
	var waiting = create(null)
	  , cache = create(null)
	  , base = conf.memoized
	  , original = conf.original
	  , currentCallback
	  , currentContext
	  , currentArgs;

	// Initial
	conf.memoized = defineLength(function (arg) {
		var args = arguments, last = args[args.length - 1];
		if (typeof last === "function") {
			currentCallback = last;
			args = slice.call(args, 0, -1);
		}
		return base.apply(currentContext = this, currentArgs = args);
	}, base);
	try { mixin(conf.memoized, base); }
	catch (ignore) {}

	// From cache (sync)
	conf.on("get", function (id) {
		var cb, context, args;
		if (!currentCallback) return;

		// Unresolved
		if (waiting[id]) {
			if (typeof waiting[id] === "function") waiting[id] = [waiting[id], currentCallback];
			else waiting[id].push(currentCallback);
			currentCallback = null;
			return;
		}

		// Resolved, assure next tick invocation
		cb = currentCallback;
		context = currentContext;
		args = currentArgs;
		currentCallback = currentContext = currentArgs = null;
		nextTick(function () {
			var data;
			if (hasOwnProperty.call(cache, id)) {
				data = cache[id];
				conf.emit("getasync", id, args, context);
				apply.call(cb, data.context, data.args);
			} else {
				// Purged in a meantime, we shouldn't rely on cached value, recall
				currentCallback = cb;
				currentContext = context;
				currentArgs = args;
				base.apply(context, args);
			}
		});
	});

	// Not from cache
	conf.original = function () {
		var args, cb, origCb, result;
		if (!currentCallback) return apply.call(original, this, arguments);
		args = aFrom(arguments);
		cb = function self(err) {
			var cb, args, id = self.id;
			if (id == null) {
				// Shouldn't happen, means async callback was called sync way
				nextTick(apply.bind(self, this, arguments));
				return undefined;
			}
			delete self.id;
			cb = waiting[id];
			delete waiting[id];
			if (!cb) {
				// Already processed,
				// outcome of race condition: asyncFn(1, cb), asyncFn.clear(), asyncFn(1, cb)
				return undefined;
			}
			args = aFrom(arguments);
			if (conf.has(id)) {
				if (err) {
					conf.delete(id);
				} else {
					cache[id] = { context: this, args: args };
					conf.emit("setasync", id, typeof cb === "function" ? 1 : cb.length);
				}
			}
			if (typeof cb === "function") {
				result = apply.call(cb, this, args);
			} else {
				cb.forEach(function (cb) { result = apply.call(cb, this, args); }, this);
			}
			return result;
		};
		origCb = currentCallback;
		currentCallback = currentContext = currentArgs = null;
		args.push(cb);
		result = apply.call(original, this, args);
		cb.cb = origCb;
		currentCallback = cb;
		return result;
	};

	// After not from cache call
	conf.on("set", function (id) {
		if (!currentCallback) {
			conf.delete(id);
			return;
		}
		if (waiting[id]) {
			// Race condition: asyncFn(1, cb), asyncFn.clear(), asyncFn(1, cb)
			if (typeof waiting[id] === "function") waiting[id] = [waiting[id], currentCallback.cb];
			else waiting[id].push(currentCallback.cb);
		} else {
			waiting[id] = currentCallback.cb;
		}
		delete currentCallback.cb;
		currentCallback.id = id;
		currentCallback = null;
	});

	// On delete
	conf.on("delete", function (id) {
		var result;
		// If false, we don't have value yet, so we assume that intention is not
		// to memoize this call. After value is obtained we don't cache it but
		// gracefully pass to callback
		if (hasOwnProperty.call(waiting, id)) return;
		if (!cache[id]) return;
		result = cache[id];
		delete cache[id];
		conf.emit("deleteasync", id, slice.call(result.args, 1));
	});

	// On clear
	conf.on("clear", function () {
		var oldCache = cache;
		cache = create(null);
		conf.emit(
			"clearasync", objectMap(oldCache, function (data) { return slice.call(data.args, 1); })
		);
	});
};

},{"../lib/registered-extensions":117,"es5-ext/array/from":33,"es5-ext/function/_define-length":40,"es5-ext/object/map":72,"es5-ext/object/mixin":73,"next-tick":128}],109:[function(require,module,exports){
// Call dispose callback on each cache purge

"use strict";

var callable   = require("es5-ext/object/valid-callable")
  , forEach    = require("es5-ext/object/for-each")
  , extensions = require("../lib/registered-extensions")

  , apply = Function.prototype.apply;

extensions.dispose = function (dispose, conf, options) {
	var del;
	callable(dispose);
	if ((options.async && extensions.async) || (options.promise && extensions.promise)) {
		conf.on("deleteasync", del = function (id, resultArray) {
			apply.call(dispose, null, resultArray);
		});
		conf.on("clearasync", function (cache) {
			forEach(cache, function (result, id) {
 del(id, result);
});
		});
		return;
	}
	conf.on("delete", del = function (id, result) {
 dispose(result);
});
	conf.on("clear", function (cache) {
		forEach(cache, function (result, id) {
 del(id, result);
});
	});
};

},{"../lib/registered-extensions":117,"es5-ext/object/for-each":64,"es5-ext/object/valid-callable":79}],110:[function(require,module,exports){
/* eslint consistent-this: 0 */

// Timeout cached values

"use strict";

var aFrom      = require("es5-ext/array/from")
  , forEach    = require("es5-ext/object/for-each")
  , nextTick   = require("next-tick")
  , isPromise  = require("is-promise")
  , timeout    = require("timers-ext/valid-timeout")
  , extensions = require("../lib/registered-extensions");

var noop = Function.prototype, max = Math.max, min = Math.min, create = Object.create;

extensions.maxAge = function (maxAge, conf, options) {
	var timeouts, postfix, preFetchAge, preFetchTimeouts;

	maxAge = timeout(maxAge);
	if (!maxAge) return;

	timeouts = create(null);
	postfix =
		(options.async && extensions.async) || (options.promise && extensions.promise)
			? "async"
			: "";
	conf.on("set" + postfix, function (id) {
		timeouts[id] = setTimeout(function () { conf.delete(id); }, maxAge);
		if (typeof timeouts[id].unref === "function") timeouts[id].unref();
		if (!preFetchTimeouts) return;
		if (preFetchTimeouts[id]) {
			if (preFetchTimeouts[id] !== "nextTick") clearTimeout(preFetchTimeouts[id]);
		}
		preFetchTimeouts[id] = setTimeout(function () {
			delete preFetchTimeouts[id];
		}, preFetchAge);
		if (typeof preFetchTimeouts[id].unref === "function") preFetchTimeouts[id].unref();
	});
	conf.on("delete" + postfix, function (id) {
		clearTimeout(timeouts[id]);
		delete timeouts[id];
		if (!preFetchTimeouts) return;
		if (preFetchTimeouts[id] !== "nextTick") clearTimeout(preFetchTimeouts[id]);
		delete preFetchTimeouts[id];
	});

	if (options.preFetch) {
		if (options.preFetch === true || isNaN(options.preFetch)) {
			preFetchAge = 0.333;
		} else {
			preFetchAge = max(min(Number(options.preFetch), 1), 0);
		}
		if (preFetchAge) {
			preFetchTimeouts = {};
			preFetchAge = (1 - preFetchAge) * maxAge;
			conf.on("get" + postfix, function (id, args, context) {
				if (!preFetchTimeouts[id]) {
					preFetchTimeouts[id] = "nextTick";
					nextTick(function () {
						var result;
						if (preFetchTimeouts[id] !== "nextTick") return;
						delete preFetchTimeouts[id];
						conf.delete(id);
						if (options.async) {
							args = aFrom(args);
							args.push(noop);
						}
						result = conf.memoized.apply(context, args);
						if (options.promise) {
							// Supress eventual error warnings
							if (isPromise(result)) {
								if (typeof result.done === "function") result.done(noop, noop);
								else result.then(noop, noop);
							}
						}
					});
				}
			});
		}
	}

	conf.on("clear" + postfix, function () {
		forEach(timeouts, function (id) { clearTimeout(id); });
		timeouts = {};
		if (preFetchTimeouts) {
			forEach(preFetchTimeouts, function (id) { if (id !== "nextTick") clearTimeout(id); });
			preFetchTimeouts = {};
		}
	});
};

},{"../lib/registered-extensions":117,"es5-ext/array/from":33,"es5-ext/object/for-each":64,"is-promise":106,"next-tick":128,"timers-ext/valid-timeout":131}],111:[function(require,module,exports){
// Limit cache size, LRU (least recently used) algorithm.

"use strict";

var toPosInteger = require("es5-ext/number/to-pos-integer")
  , lruQueue     = require("lru-queue")
  , extensions   = require("../lib/registered-extensions");

extensions.max = function (max, conf, options) {
	var postfix, queue, hit;

	max = toPosInteger(max);
	if (!max) return;

	queue = lruQueue(max);
	postfix = (options.async && extensions.async) || (options.promise && extensions.promise)
		? "async" : "";

	conf.on("set" + postfix, hit = function (id) {
		id = queue.hit(id);
		if (id === undefined) return;
		conf.delete(id);
	});
	conf.on("get" + postfix, hit);
	conf.on("delete" + postfix, queue.delete);
	conf.on("clear" + postfix, queue.clear);
};

},{"../lib/registered-extensions":117,"es5-ext/number/to-pos-integer":56,"lru-queue":107}],112:[function(require,module,exports){
/* eslint max-statements: 0 */

// Support for functions returning promise

"use strict";

var objectMap     = require("es5-ext/object/map")
  , primitiveSet  = require("es5-ext/object/primitive-set")
  , ensureString  = require("es5-ext/object/validate-stringifiable-value")
  , toShortString = require("es5-ext/to-short-string-representation")
  , isPromise     = require("is-promise")
  , nextTick      = require("next-tick");

var create = Object.create
  , supportedModes = primitiveSet("then", "then:finally", "done", "done:finally");

require("../lib/registered-extensions").promise = function (mode, conf) {
	var waiting = create(null), cache = create(null), promises = create(null);

	if (mode === true) {
		mode = null;
	} else {
		mode = ensureString(mode);
		if (!supportedModes[mode]) {
			throw new TypeError("'" + toShortString(mode) + "' is not valid promise mode");
		}
	}

	// After not from cache call
	conf.on("set", function (id, ignore, promise) {
		var isFailed = false;

		if (!isPromise(promise)) {
			// Non promise result
			cache[id] = promise;
			conf.emit("setasync", id, 1);
			return;
		}
		waiting[id] = 1;
		promises[id] = promise;
		var onSuccess = function (result) {
			var count = waiting[id];
			if (isFailed) {
				throw new Error(
					"Memoizee error: Detected unordered then|done & finally resolution, which " +
						"in turn makes proper detection of success/failure impossible (when in " +
						"'done:finally' mode)\n" +
						"Consider to rely on 'then' or 'done' mode instead."
				);
			}
			if (!count) return; // Deleted from cache before resolved
			delete waiting[id];
			cache[id] = result;
			conf.emit("setasync", id, count);
		};
		var onFailure = function () {
			isFailed = true;
			if (!waiting[id]) return; // Deleted from cache (or succeed in case of finally)
			delete waiting[id];
			delete promises[id];
			conf.delete(id);
		};

		var resolvedMode = mode;
		if (!resolvedMode) resolvedMode = "then";

		if (resolvedMode === "then") {
			var nextTickFailure = function () { nextTick(onFailure); };
			// Eventual finally needs to be attached to non rejected promise
			// (so we not force propagation of unhandled rejection)
			promise = promise.then(function (result) {
				nextTick(onSuccess.bind(this, result));
			}, nextTickFailure);
			// If `finally` is a function we attach to it to remove cancelled promises.
			if (typeof promise.finally === "function") {
				promise.finally(nextTickFailure);
			}
		} else if (resolvedMode === "done") {
			// Not recommended, as it may mute any eventual "Unhandled error" events
			if (typeof promise.done !== "function") {
				throw new Error(
					"Memoizee error: Retrieved promise does not implement 'done' " +
						"in 'done' mode"
				);
			}
			promise.done(onSuccess, onFailure);
		} else if (resolvedMode === "done:finally") {
			// The only mode with no side effects assuming library does not throw unconditionally
			// for rejected promises.
			if (typeof promise.done !== "function") {
				throw new Error(
					"Memoizee error: Retrieved promise does not implement 'done' " +
						"in 'done:finally' mode"
				);
			}
			if (typeof promise.finally !== "function") {
				throw new Error(
					"Memoizee error: Retrieved promise does not implement 'finally' " +
						"in 'done:finally' mode"
				);
			}
			promise.done(onSuccess);
			promise.finally(onFailure);
		}
	});

	// From cache (sync)
	conf.on("get", function (id, args, context) {
		var promise;
		if (waiting[id]) {
			++waiting[id]; // Still waiting
			return;
		}
		promise = promises[id];
		var emit = function () { conf.emit("getasync", id, args, context); };
		if (isPromise(promise)) {
			if (typeof promise.done === "function") promise.done(emit);
			else {
				promise.then(function () { nextTick(emit); });
			}
		} else {
			emit();
		}
	});

	// On delete
	conf.on("delete", function (id) {
		delete promises[id];
		if (waiting[id]) {
			delete waiting[id];
			return; // Not yet resolved
		}
		if (!hasOwnProperty.call(cache, id)) return;
		var result = cache[id];
		delete cache[id];
		conf.emit("deleteasync", id, [result]);
	});

	// On clear
	conf.on("clear", function () {
		var oldCache = cache;
		cache = create(null);
		waiting = create(null);
		promises = create(null);
		conf.emit("clearasync", objectMap(oldCache, function (data) { return [data]; }));
	});
};

},{"../lib/registered-extensions":117,"es5-ext/object/map":72,"es5-ext/object/primitive-set":75,"es5-ext/object/validate-stringifiable-value":82,"es5-ext/to-short-string-representation":92,"is-promise":106,"next-tick":128}],113:[function(require,module,exports){
// Reference counter, useful for garbage collector like functionality

"use strict";

var d          = require("d")
  , extensions = require("../lib/registered-extensions")

  , create = Object.create, defineProperties = Object.defineProperties;

extensions.refCounter = function (ignore, conf, options) {
	var cache, postfix;

	cache = create(null);
	postfix = (options.async && extensions.async) || (options.promise && extensions.promise)
		? "async" : "";

	conf.on("set" + postfix, function (id, length) {
 cache[id] = length || 1;
});
	conf.on("get" + postfix, function (id) {
 ++cache[id];
});
	conf.on("delete" + postfix, function (id) {
 delete cache[id];
});
	conf.on("clear" + postfix, function () {
 cache = {};
});

	defineProperties(conf.memoized, {
		deleteRef: d(function () {
			var id = conf.get(arguments);
			if (id === null) return null;
			if (!cache[id]) return null;
			if (!--cache[id]) {
				conf.delete(id);
				return true;
			}
			return false;
		}),
		getRefCount: d(function () {
			var id = conf.get(arguments);
			if (id === null) return 0;
			if (!cache[id]) return 0;
			return cache[id];
		})
	});
};

},{"../lib/registered-extensions":117,"d":27}],114:[function(require,module,exports){
"use strict";

var normalizeOpts = require("es5-ext/object/normalize-options")
  , resolveLength = require("./lib/resolve-length")
  , plain         = require("./plain");

module.exports = function (fn/*, options*/) {
	var options = normalizeOpts(arguments[1]), length;

	if (!options.normalizer) {
		length = options.length = resolveLength(options.length, fn.length, options.async);
		if (length !== 0) {
			if (options.primitive) {
				if (length === false) {
					options.normalizer = require("./normalizers/primitive");
				} else if (length > 1) {
					options.normalizer = require("./normalizers/get-primitive-fixed")(length);
				}
			} else if (length === false) options.normalizer = require("./normalizers/get")();
				else if (length === 1) options.normalizer = require("./normalizers/get-1")();
				else options.normalizer = require("./normalizers/get-fixed")(length);
		}
	}

	// Assure extensions
	if (options.async) require("./ext/async");
	if (options.promise) require("./ext/promise");
	if (options.dispose) require("./ext/dispose");
	if (options.maxAge) require("./ext/max-age");
	if (options.max) require("./ext/max");
	if (options.refCounter) require("./ext/ref-counter");

	return plain(fn, options);
};

},{"./ext/async":108,"./ext/dispose":109,"./ext/max":111,"./ext/max-age":110,"./ext/promise":112,"./ext/ref-counter":113,"./lib/resolve-length":118,"./normalizers/get":125,"./normalizers/get-1":122,"./normalizers/get-fixed":123,"./normalizers/get-primitive-fixed":124,"./normalizers/primitive":126,"./plain":127,"es5-ext/object/normalize-options":74}],115:[function(require,module,exports){
/* eslint no-eq-null: 0, eqeqeq: 0, no-unused-vars: 0 */

"use strict";

var customError      = require("es5-ext/error/custom")
  , defineLength     = require("es5-ext/function/_define-length")
  , d                = require("d")
  , ee               = require("event-emitter").methods
  , resolveResolve   = require("./resolve-resolve")
  , resolveNormalize = require("./resolve-normalize");

var apply = Function.prototype.apply
  , call = Function.prototype.call
  , create = Object.create
  , defineProperties = Object.defineProperties
  , on = ee.on
  , emit = ee.emit;

module.exports = function (original, length, options) {
	var cache = create(null)
	  , conf
	  , memLength
	  , get
	  , set
	  , del
	  , clear
	  , extDel
	  , extGet
	  , extHas
	  , normalizer
	  , getListeners
	  , setListeners
	  , deleteListeners
	  , memoized
	  , resolve;
	if (length !== false) memLength = length;
	else if (isNaN(original.length)) memLength = 1;
	else memLength = original.length;

	if (options.normalizer) {
		normalizer = resolveNormalize(options.normalizer);
		get = normalizer.get;
		set = normalizer.set;
		del = normalizer.delete;
		clear = normalizer.clear;
	}
	if (options.resolvers != null) resolve = resolveResolve(options.resolvers);

	if (get) {
		memoized = defineLength(function (arg) {
			var id, result, args = arguments;
			if (resolve) args = resolve(args);
			id = get(args);
			if (id !== null) {
				if (hasOwnProperty.call(cache, id)) {
					if (getListeners) conf.emit("get", id, args, this);
					return cache[id];
				}
			}
			if (args.length === 1) result = call.call(original, this, args[0]);
			else result = apply.call(original, this, args);
			if (id === null) {
				id = get(args);
				if (id !== null) throw customError("Circular invocation", "CIRCULAR_INVOCATION");
				id = set(args);
			} else if (hasOwnProperty.call(cache, id)) {
				throw customError("Circular invocation", "CIRCULAR_INVOCATION");
			}
			cache[id] = result;
			if (setListeners) conf.emit("set", id, null, result);
			return result;
		}, memLength);
	} else if (length === 0) {
		memoized = function () {
			var result;
			if (hasOwnProperty.call(cache, "data")) {
				if (getListeners) conf.emit("get", "data", arguments, this);
				return cache.data;
			}
			if (arguments.length) result = apply.call(original, this, arguments);
			else result = call.call(original, this);
			if (hasOwnProperty.call(cache, "data")) {
				throw customError("Circular invocation", "CIRCULAR_INVOCATION");
			}
			cache.data = result;
			if (setListeners) conf.emit("set", "data", null, result);
			return result;
		};
	} else {
		memoized = function (arg) {
			var result, args = arguments, id;
			if (resolve) args = resolve(arguments);
			id = String(args[0]);
			if (hasOwnProperty.call(cache, id)) {
				if (getListeners) conf.emit("get", id, args, this);
				return cache[id];
			}
			if (args.length === 1) result = call.call(original, this, args[0]);
			else result = apply.call(original, this, args);
			if (hasOwnProperty.call(cache, id)) {
				throw customError("Circular invocation", "CIRCULAR_INVOCATION");
			}
			cache[id] = result;
			if (setListeners) conf.emit("set", id, null, result);
			return result;
		};
	}
	conf = {
		original: original,
		memoized: memoized,
		profileName: options.profileName,
		get: function (args) {
			if (resolve) args = resolve(args);
			if (get) return get(args);
			return String(args[0]);
		},
		has: function (id) { return hasOwnProperty.call(cache, id); },
		delete: function (id) {
			var result;
			if (!hasOwnProperty.call(cache, id)) return;
			if (del) del(id);
			result = cache[id];
			delete cache[id];
			if (deleteListeners) conf.emit("delete", id, result);
		},
		clear: function () {
			var oldCache = cache;
			if (clear) clear();
			cache = create(null);
			conf.emit("clear", oldCache);
		},
		on: function (type, listener) {
			if (type === "get") getListeners = true;
			else if (type === "set") setListeners = true;
			else if (type === "delete") deleteListeners = true;
			return on.call(this, type, listener);
		},
		emit: emit,
		updateEnv: function () { original = conf.original; }
	};
	if (get) {
		extDel = defineLength(function (arg) {
			var id, args = arguments;
			if (resolve) args = resolve(args);
			id = get(args);
			if (id === null) return;
			conf.delete(id);
		}, memLength);
	} else if (length === 0) {
		extDel = function () { return conf.delete("data"); };
	} else {
		extDel = function (arg) {
			if (resolve) arg = resolve(arguments)[0];
			return conf.delete(arg);
		};
	}
	extGet = defineLength(function () {
		var id, args = arguments;
		if (length === 0) return cache.data;
		if (resolve) args = resolve(args);
		if (get) id = get(args);
		else id = String(args[0]);
		return cache[id];
	});
	extHas = defineLength(function () {
		var id, args = arguments;
		if (length === 0) return conf.has("data");
		if (resolve) args = resolve(args);
		if (get) id = get(args);
		else id = String(args[0]);
		if (id === null) return false;
		return conf.has(id);
	});
	defineProperties(memoized, {
		__memoized__: d(true),
		delete: d(extDel),
		clear: d(conf.clear),
		_get: d(extGet),
		_has: d(extHas)
	});
	return conf;
};

},{"./resolve-normalize":119,"./resolve-resolve":120,"d":27,"es5-ext/error/custom":38,"es5-ext/function/_define-length":40,"event-emitter":105}],116:[function(require,module,exports){
"use strict";

var forEach       = require("es5-ext/object/for-each")
  , normalizeOpts = require("es5-ext/object/normalize-options")
  , callable      = require("es5-ext/object/valid-callable")
  , lazy          = require("d/lazy")
  , resolveLength = require("./resolve-length")
  , extensions    = require("./registered-extensions");

module.exports = function (memoize) {
	return function (props) {
		forEach(props, function (desc) {
			var fn = callable(desc.value), length;
			desc.value = function (options) {
				if (options.getNormalizer) {
					options = normalizeOpts(options);
					if (length === undefined) {
						length = resolveLength(
							options.length,
							fn.length,
							options.async && extensions.async
						);
					}
					options.normalizer = options.getNormalizer(length);
					delete options.getNormalizer;
				}
				return memoize(fn.bind(this), options);
			};
		});
		return lazy(props);
	};
};

},{"./registered-extensions":117,"./resolve-length":118,"d/lazy":28,"es5-ext/object/for-each":64,"es5-ext/object/normalize-options":74,"es5-ext/object/valid-callable":79}],117:[function(require,module,exports){
"use strict";

},{}],118:[function(require,module,exports){
"use strict";

var toPosInt = require("es5-ext/number/to-pos-integer");

module.exports = function (optsLength, fnLength, isAsync) {
	var length;
	if (isNaN(optsLength)) {
		length = fnLength;
		if (!(length >= 0)) return 1;
		if (isAsync && length) return length - 1;
		return length;
	}
	if (optsLength === false) return false;
	return toPosInt(optsLength);
};

},{"es5-ext/number/to-pos-integer":56}],119:[function(require,module,exports){
"use strict";

var callable = require("es5-ext/object/valid-callable");

module.exports = function (userNormalizer) {
	var normalizer;
	if (typeof userNormalizer === "function") return { set: userNormalizer, get: userNormalizer };
	normalizer = { get: callable(userNormalizer.get) };
	if (userNormalizer.set !== undefined) {
		normalizer.set = callable(userNormalizer.set);
		if (userNormalizer.delete) normalizer.delete = callable(userNormalizer.delete);
		if (userNormalizer.clear) normalizer.clear = callable(userNormalizer.clear);
		return normalizer;
	}
	normalizer.set = normalizer.get;
	return normalizer;
};

},{"es5-ext/object/valid-callable":79}],120:[function(require,module,exports){
"use strict";

var toArray  = require("es5-ext/array/to-array")
  , isValue  = require("es5-ext/object/is-value")
  , callable = require("es5-ext/object/valid-callable");

var slice = Array.prototype.slice, resolveArgs;

resolveArgs = function (args) {
	return this.map(function (resolve, i) {
		return resolve ? resolve(args[i]) : args[i];
	}).concat(slice.call(args, this.length));
};

module.exports = function (resolvers) {
	resolvers = toArray(resolvers);
	resolvers.forEach(function (resolve) {
		if (isValue(resolve)) callable(resolve);
	});
	return resolveArgs.bind(resolvers);
};

},{"es5-ext/array/to-array":37,"es5-ext/object/is-value":68,"es5-ext/object/valid-callable":79}],121:[function(require,module,exports){
"use strict";

module.exports = require("./lib/methods")(require("./"));

},{"./":114,"./lib/methods":116}],122:[function(require,module,exports){
"use strict";

var indexOf = require("es5-ext/array/#/e-index-of");

module.exports = function () {
	var lastId = 0, argsMap = [], cache = [];
	return {
		get: function (args) {
			var index = indexOf.call(argsMap, args[0]);
			return index === -1 ? null : cache[index];
		},
		set: function (args) {
			argsMap.push(args[0]);
			cache.push(++lastId);
			return lastId;
		},
		delete: function (id) {
			var index = indexOf.call(cache, id);
			if (index !== -1) {
				argsMap.splice(index, 1);
				cache.splice(index, 1);
			}
		},
		clear: function () {
			argsMap = [];
			cache = [];
		}
	};
};

},{"es5-ext/array/#/e-index-of":30}],123:[function(require,module,exports){
"use strict";

var indexOf = require("es5-ext/array/#/e-index-of")
  , create  = Object.create;

module.exports = function (length) {
	var lastId = 0, map = [[], []], cache = create(null);
	return {
		get: function (args) {
			var index = 0, set = map, i;
			while (index < length - 1) {
				i = indexOf.call(set[0], args[index]);
				if (i === -1) return null;
				set = set[1][i];
				++index;
			}
			i = indexOf.call(set[0], args[index]);
			if (i === -1) return null;
			return set[1][i] || null;
		},
		set: function (args) {
			var index = 0, set = map, i;
			while (index < length - 1) {
				i = indexOf.call(set[0], args[index]);
				if (i === -1) {
					i = set[0].push(args[index]) - 1;
					set[1].push([[], []]);
				}
				set = set[1][i];
				++index;
			}
			i = indexOf.call(set[0], args[index]);
			if (i === -1) {
				i = set[0].push(args[index]) - 1;
			}
			set[1][i] = ++lastId;
			cache[lastId] = args;
			return lastId;
		},
		delete: function (id) {
			var index = 0, set = map, i, path = [], args = cache[id];
			while (index < length - 1) {
				i = indexOf.call(set[0], args[index]);
				if (i === -1) {
					return;
				}
				path.push(set, i);
				set = set[1][i];
				++index;
			}
			i = indexOf.call(set[0], args[index]);
			if (i === -1) {
				return;
			}
			id = set[1][i];
			set[0].splice(i, 1);
			set[1].splice(i, 1);
			while (!set[0].length && path.length) {
				i = path.pop();
				set = path.pop();
				set[0].splice(i, 1);
				set[1].splice(i, 1);
			}
			delete cache[id];
		},
		clear: function () {
			map = [[], []];
			cache = create(null);
		}
	};
};

},{"es5-ext/array/#/e-index-of":30}],124:[function(require,module,exports){
"use strict";

module.exports = function (length) {
	if (!length) {
		return function () {
			return "";
		};
	}
	return function (args) {
		var id = String(args[0]), i = 0, currentLength = length;
		while (--currentLength) {
			id += "\u0001" + args[++i];
		}
		return id;
	};
};

},{}],125:[function(require,module,exports){
/* eslint max-statements: 0 */

"use strict";

var indexOf = require("es5-ext/array/#/e-index-of");

var create = Object.create;

module.exports = function () {
	var lastId = 0, map = [], cache = create(null);
	return {
		get: function (args) {
			var index = 0, set = map, i, length = args.length;
			if (length === 0) return set[length] || null;
			if ((set = set[length])) {
				while (index < length - 1) {
					i = indexOf.call(set[0], args[index]);
					if (i === -1) return null;
					set = set[1][i];
					++index;
				}
				i = indexOf.call(set[0], args[index]);
				if (i === -1) return null;
				return set[1][i] || null;
			}
			return null;
		},
		set: function (args) {
			var index = 0, set = map, i, length = args.length;
			if (length === 0) {
				set[length] = ++lastId;
			} else {
				if (!set[length]) {
					set[length] = [[], []];
				}
				set = set[length];
				while (index < length - 1) {
					i = indexOf.call(set[0], args[index]);
					if (i === -1) {
						i = set[0].push(args[index]) - 1;
						set[1].push([[], []]);
					}
					set = set[1][i];
					++index;
				}
				i = indexOf.call(set[0], args[index]);
				if (i === -1) {
					i = set[0].push(args[index]) - 1;
				}
				set[1][i] = ++lastId;
			}
			cache[lastId] = args;
			return lastId;
		},
		delete: function (id) {
			var index = 0, set = map, i, args = cache[id], length = args.length, path = [];
			if (length === 0) {
				delete set[length];
			} else if ((set = set[length])) {
				while (index < length - 1) {
					i = indexOf.call(set[0], args[index]);
					if (i === -1) {
						return;
					}
					path.push(set, i);
					set = set[1][i];
					++index;
				}
				i = indexOf.call(set[0], args[index]);
				if (i === -1) {
					return;
				}
				id = set[1][i];
				set[0].splice(i, 1);
				set[1].splice(i, 1);
				while (!set[0].length && path.length) {
					i = path.pop();
					set = path.pop();
					set[0].splice(i, 1);
					set[1].splice(i, 1);
				}
			}
			delete cache[id];
		},
		clear: function () {
			map = [];
			cache = create(null);
		}
	};
};

},{"es5-ext/array/#/e-index-of":30}],126:[function(require,module,exports){
"use strict";

module.exports = function (args) {
	var id, i, length = args.length;
	if (!length) return "\u0002";
	id = String(args[i = 0]);
	while (--length) id += "\u0001" + args[++i];
	return id;
};

},{}],127:[function(require,module,exports){
"use strict";

var callable      = require("es5-ext/object/valid-callable")
  , forEach       = require("es5-ext/object/for-each")
  , extensions    = require("./lib/registered-extensions")
  , configure     = require("./lib/configure-map")
  , resolveLength = require("./lib/resolve-length");

module.exports = function self(fn /*, options */) {
	var options, length, conf;

	callable(fn);
	options = Object(arguments[1]);

	if (options.async && options.promise) {
		throw new Error("Options 'async' and 'promise' cannot be used together");
	}

	// Do not memoize already memoized function
	if (hasOwnProperty.call(fn, "__memoized__") && !options.force) return fn;

	// Resolve length;
	length = resolveLength(options.length, fn.length, options.async && extensions.async);

	// Configure cache map
	conf = configure(fn, length, options);

	// Bind eventual extensions
	forEach(extensions, function (extFn, name) {
		if (options[name]) extFn(options[name], conf, options);
	});

	if (self.__profiler__) self.__profiler__(conf);

	conf.updateEnv();
	return conf.memoized;
};

},{"./lib/configure-map":115,"./lib/registered-extensions":117,"./lib/resolve-length":118,"es5-ext/object/for-each":64,"es5-ext/object/valid-callable":79}],128:[function(require,module,exports){
(function (process,setImmediate){
'use strict';

var callable, byObserver;

callable = function (fn) {
	if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
	return fn;
};

byObserver = function (Observer) {
	var node = document.createTextNode(''), queue, currentQueue, i = 0;
	new Observer(function () {
		var callback;
		if (!queue) {
			if (!currentQueue) return;
			queue = currentQueue;
		} else if (currentQueue) {
			queue = currentQueue.concat(queue);
		}
		currentQueue = queue;
		queue = null;
		if (typeof currentQueue === 'function') {
			callback = currentQueue;
			currentQueue = null;
			callback();
			return;
		}
		node.data = (i = ++i % 2); // Invoke other batch, to handle leftover callbacks in case of crash
		while (currentQueue) {
			callback = currentQueue.shift();
			if (!currentQueue.length) currentQueue = null;
			callback();
		}
	}).observe(node, { characterData: true });
	return function (fn) {
		callable(fn);
		if (queue) {
			if (typeof queue === 'function') queue = [queue, fn];
			else queue.push(fn);
			return;
		}
		queue = fn;
		node.data = (i = ++i % 2);
	};
};

module.exports = (function () {
	// Node.js
	if ((typeof process === 'object') && process && (typeof process.nextTick === 'function')) {
		return process.nextTick;
	}

	// MutationObserver
	if ((typeof document === 'object') && document) {
		if (typeof MutationObserver === 'function') return byObserver(MutationObserver);
		if (typeof WebKitMutationObserver === 'function') return byObserver(WebKitMutationObserver);
	}

	// W3C Draft
	// http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
	if (typeof setImmediate === 'function') {
		return function (cb) { setImmediate(callable(cb)); };
	}

	// Wide available standard
	if ((typeof setTimeout === 'function') || (typeof setTimeout === 'object')) {
		return function (cb) { setTimeout(callable(cb), 0); };
	}

	return null;
}());

}).call(this,require('_process'),require("timers").setImmediate)
},{"_process":149,"timers":150}],129:[function(require,module,exports){
(function (global){
const fs = require('fs');
const path = require('path');

class StrifVar {
  constructor(name, opts) {
    if (!name) {
      throw new Error('name is required');
    } else if (typeof name != 'string') {
      throw new Error('name is required to be a string');
    } else {
      this.name = name;
    }

    this.accessor = opts.accessor || name;
    this.transformers = opts.transformers;
    this.opts = opts;
  }

  getFromObject(obj) {
    let str = this.accessor.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
    for (let k of str.split('.')) {
      if (k in obj) obj = obj[k] || null;
      else return null;
    }

    if (this.opts.type && !(typeof obj === this.opts.type)) {
      throw new Error(`Var {${this.name}} type does not match "${this.opts.type}"`);
    }
    return obj;
  }
}

class StrifTemplate {
  constructor(template, transformers, options = {}) {
    if (!template) {
      throw new Error('template is required');
    } else if (typeof template != 'string') {
      throw new Error('template is required to be a string');
    } else {
      this.template = template;
    }
    this._options = options;
    this._transformers = transformers;
    this._props = [];

    if (options.props) {
      for (let key in options.props) {
        let prop = options.props[key];
        this.prop(key, prop);
      }
    }
  }

  prop(name, opts = {}) {
    this._props.push(new StrifVar(name, opts));
    return this;
  }

  compile(data, options = {}) {
    options = {
      ...StrifTemplate.DefaultCompileOptions,
      ...options
    }

    let transformers = this._transformers;
    if (options.ignoreTransformers) {
      transformers = {};
      Object.keys(this._transformers).forEach(key => {
        transformers[key] = this._transformers[key];
        if (options.ignoreTransformers.includes(key)) {
          transformers[key].ignore = true;
        }
      });
    } else {
      Object.keys(this._transformers).forEach(key => {
        transformers[key].ignore = false;
      });
    }

    let map = data;
    for (let prop of this._props) {
      let propData = prop.getFromObject(data);
      if (propData) {
        map[prop.name] = propData;
      }
      if (prop.transformers) {
        map[prop.name] = prop.transformers
          .reduce((prev, curr) => {
            if (!transformers[curr]) {
              throw new Error('Transformer not found: ' + curr);
            } else if (transformers[curr].ignore) {
              return prev;
            } else {
              return transformers[curr](prev);
            }
          }, map[prop.name]);
      }
    }

    return StrifTemplate.compile(this.template, map, options);
  }

  // TODO: compile should accept arrays of data and replace $0 $1 $2, ... 
  static compile(template, data, options) {
    return template.replace(
      /([{}])\1|[{](.*?)(?:!(.+?))?[}]/g,
      (m, l, key) => {
        if (key) {
          let val = data[key] || '';
          return val;
        } else return data;
      });
  }
}

StrifTemplate.DefaultCompileOptions = {
  ignoreTransformers: null
};

class StrifFormatter {
  /**
   * @param {object} opts 
   * @param {object} opts.transformers
   * @param {string[]} opts.plugins
   */
  constructor(opts = {}) {
    this.opts = opts;

    this.transformers = {
      ...StrifFormatter.DEFAULT_TRANSFORMERS,
      ...this.opts.transformers
    };

    if (opts.plugins) {
      this.opts.plugins.forEach(plugPath => {
        let plugin = require(path.resolve(plugPath));
        if (plugin.transformers) {
          this.transformers = {
            ...this.transformers,
            ...plugin.transformers,
          };
        }
      });
    }
  }

  /**
   * @param {string} template 
   * @param {object} options 
   */
  template(template, options) {
    return new StrifTemplate(template, this.transformers, options);
  }

  /**
   * @param {string} path 
   * @param {object} options 
   */
  fromFile(path, options) {
    if (!path) {
      throw new Error(
        'path is required');
    } else if (typeof path != 'string') {
      throw new Error(
        'path is required to be a string');
    }

    let template = fs.readFileSync(path).toString();
    return new StrifTemplate(template, this.transformers, options);
  }
}
StrifFormatter.DEFAULT_TRANSFORMERS = {};

const DEFAULT_FORMATTER_OPTS = {
  transformers: {
    date: s => new Date(s),
    lds: d => d.toLocaleString()
  }
};

let strif = new StrifFormatter(DEFAULT_FORMATTER_OPTS);
strif.Formatter = StrifFormatter;
strif.Template = StrifTemplate;
strif.Var = StrifVar;

strif.create = (opts) => new StrifFormatter(opts);
strif.compile = StrifTemplate.compile;


global.strif = strif;
module.exports = strif;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"fs":146,"path":148}],130:[function(require,module,exports){
"use strict";

module.exports = 2147483647;

},{}],131:[function(require,module,exports){
"use strict";

var toPosInt   = require("es5-ext/number/to-pos-integer")
  , maxTimeout = require("./max-timeout");

module.exports = function (value) {
	value = toPosInt(value);
	if (value > maxTimeout) throw new TypeError(value + " exceeds maximum possible timeout");
	return value;
};

},{"./max-timeout":130,"es5-ext/number/to-pos-integer":56}],132:[function(require,module,exports){
"use strict";

var isPrototype = require("../prototype/is");

module.exports = function (value) {
	if (typeof value !== "function") return false;

	if (!hasOwnProperty.call(value, "length")) return false;

	try {
		if (typeof value.length !== "number") return false;
		if (typeof value.call !== "function") return false;
		if (typeof value.apply !== "function") return false;
	} catch (error) {
		return false;
	}

	return !isPrototype(value);
};

},{"../prototype/is":139}],133:[function(require,module,exports){
"use strict";

var isValue       = require("../value/is")
  , isObject      = require("../object/is")
  , stringCoerce  = require("../string/coerce")
  , toShortString = require("./to-short-string");

var resolveMessage = function (message, value) {
	return message.replace("%v", toShortString(value));
};

module.exports = function (value, defaultMessage, inputOptions) {
	if (!isObject(inputOptions)) throw new TypeError(resolveMessage(defaultMessage, value));
	if (!isValue(value)) {
		if ("default" in inputOptions) return inputOptions["default"];
		if (inputOptions.isOptional) return null;
	}
	var errorMessage = stringCoerce(inputOptions.errorMessage);
	if (!isValue(errorMessage)) errorMessage = defaultMessage;
	throw new TypeError(resolveMessage(errorMessage, value));
};

},{"../object/is":136,"../string/coerce":140,"../value/is":142,"./to-short-string":135}],134:[function(require,module,exports){
"use strict";

module.exports = function (value) {
	try {
		return value.toString();
	} catch (error) {
		try { return String(value); }
		catch (error2) { return null; }
	}
};

},{}],135:[function(require,module,exports){
"use strict";

var safeToString = require("./safe-to-string");

var reNewLine = /[\n\r\u2028\u2029]/g;

module.exports = function (value) {
	var string = safeToString(value);
	if (string === null) return "<Non-coercible to string value>";
	// Trim if too long
	if (string.length > 100) string = string.slice(0, 99) + "…";
	// Replace eventual new lines
	string = string.replace(reNewLine, function (char) {
		switch (char) {
			case "\n":
				return "\\n";
			case "\r":
				return "\\r";
			case "\u2028":
				return "\\u2028";
			case "\u2029":
				return "\\u2029";
			/* istanbul ignore next */
			default:
				throw new Error("Unexpected character");
		}
	});
	return string;
};

},{"./safe-to-string":134}],136:[function(require,module,exports){
"use strict";

var isValue = require("../value/is");

// prettier-ignore
var possibleTypes = { "object": true, "function": true, "undefined": true /* document.all */ };

module.exports = function (value) {
	if (!isValue(value)) return false;
	return hasOwnProperty.call(possibleTypes, typeof value);
};

},{"../value/is":142}],137:[function(require,module,exports){
"use strict";

var resolveException = require("../lib/resolve-exception")
  , is               = require("./is");

module.exports = function (value/*, options*/) {
	if (is(value)) return value;
	return resolveException(value, "%v is not a plain function", arguments[1]);
};

},{"../lib/resolve-exception":133,"./is":138}],138:[function(require,module,exports){
"use strict";

var isFunction = require("../function/is");

var classRe = /^\s*class[\s{/}]/, functionToString = Function.prototype.toString;

module.exports = function (value) {
	if (!isFunction(value)) return false;
	if (classRe.test(functionToString.call(value))) return false;
	return true;
};

},{"../function/is":132}],139:[function(require,module,exports){
"use strict";

var isObject = require("../object/is");

module.exports = function (value) {
	if (!isObject(value)) return false;
	try {
		if (!value.constructor) return false;
		return value.constructor.prototype === value;
	} catch (error) {
		return false;
	}
};

},{"../object/is":136}],140:[function(require,module,exports){
"use strict";

var isValue  = require("../value/is")
  , isObject = require("../object/is");

var objectToString = Object.prototype.toString;

module.exports = function (value) {
	if (!isValue(value)) return null;
	if (isObject(value)) {
		// Reject Object.prototype.toString coercion
		var valueToString = value.toString;
		if (typeof valueToString !== "function") return null;
		if (valueToString === objectToString) return null;
		// Note: It can be object coming from other realm, still as there's no ES3 and CSP compliant
		// way to resolve its realm's Object.prototype.toString it's left as not addressed edge case
	}
	try {
		return "" + value; // Ensure implicit coercion
	} catch (error) {
		return null;
	}
};

},{"../object/is":136,"../value/is":142}],141:[function(require,module,exports){
"use strict";

var resolveException = require("../lib/resolve-exception")
  , is               = require("./is");

module.exports = function (value/*, options*/) {
	if (is(value)) return value;
	return resolveException(value, "Cannot use %v", arguments[1]);
};

},{"../lib/resolve-exception":133,"./is":142}],142:[function(require,module,exports){
"use strict";

// ES3 safe
var _undefined = void 0;

module.exports = function (value) { return value !== _undefined && value !== null; };

},{}],143:[function(require,module,exports){

function plugin(loggin) {
    const { Formatter } = loggin;

    Formatter
        .register(
            'SHORT',
            '[{time}] - {level} - {message}', {
                props: {
                    time: {
                        transformers: ['date'],
                    },
                    level: {
                        transformers: ['string']
                    },
                    message: {

                    }
                }
            }
        );
    Formatter
        .register(
            'MEDIUM',
            '[{time}] - {level} - {message} {data}', {
                props: {
                    time: {
                        transformers: ['date']
                    },
                    level: {
                        transformers: ['string']
                    },
                    message: {},
                    data: {
                        transformers: ['json', 'cl_gray']
                    }
                }
            }
        );
    Formatter
        .register(
            'LONG',
            '[{time} {user}] - {level} - {message} {data}', {
                props: {
                    time: {
                        transformers: ['date', 'cl_blue']
                    },
                    user: {
                        transformers: ['cl_gray']
                    },
                    level: {
                        transformers: ['string']
                    },
                    message: {},
                    data: {
                        transformers: ['json_u', 'cl_gray']
                    }
                }
            }
        );
    Formatter
        .register(
            'DETAILED',
            '{time} {user} {channel} - {level} - {message} {data}', {
                props: {
                    time: {
                        transformers: ['date', 'lbl_cyan']
                    },
                    user: {
                        transformers: ['cl_gray']
                    },
                    level: {
                        transformers: ['string']
                    },
                    data: {
                        transformers: ['json', 'cl_gray']
                    },
                    channel: {},
                    message: {},
                }
            }
        );
    Formatter
        .register(
            'MINIMAL',
            '{channel} - {message}', {
                props: {
                    message: {},
                    channel: {},
                }
            }
        );
};

module.exports = plugin;
},{}],144:[function(require,module,exports){

function plugin(loggin) {
    const { Severity } = loggin;

    Severity
        .register(0, 'EMERGENCY')
        .register(1, 'ALERT')
        .register(2, 'CRITICAL')
        .register(3, 'ERROR')
        .register(4, 'WARNING')
        .register(5, 'NOTICE')
        .register(6, 'INFO')
        .register(7, 'DEBUG')
        .register(8, 'SILLY');
};

module.exports = plugin;
},{}],145:[function(require,module,exports){

function plugin(loggin) {
    const { Notifier, Pipe } = loggin;

    class ConsoleNotifier extends Notifier {
        constructor(options) {
            super(options);
            this.name = 'console';
            this.lineIndex = 0;
        }

        output(log) {
            let logOut = log;
            if (this.options.lineNumbers) {
                logOut = this.getLineWithNumber(log);
            }

            // Dont remove
            console.log(logOut);
            return this;
        }
    }

    Notifier.register('Console', ConsoleNotifier);
};

module.exports = plugin;
},{}],146:[function(require,module,exports){

},{}],147:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],148:[function(require,module,exports){
(function (process){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":149}],149:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],150:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":149,"timers":150}]},{},[1]);
