'use strict';

const Log = require('./log');
const Notifiers = require('./notifiers');
const Severity = require('./severity');
const Formatter = require('./formatters');
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
      notifiers = [Notifiers.get('default')];
    }

    // .setNotifiers must be done before setting other options
    // as they propagate down to notifiers
    this.setNotifiers(notifiers);
    this.level(this.options.level);
    this.user(this.options.user);
    this.channel(this.options.channel);
    this.enabled(this.options.enabled);
    this.color(this.options.color);
    this.formatter(this.options.formatter);
    this.lineNumbers(this.options.lineNumbers);
  }

  // Utilities
  clone() {
    let logger = new Logger(this.options, [...this._notifiers]);
    return logger;
  }

  fork() {
    return this.clone();
  }

  // Options
  enabled(enabled) {
    this._enabled = enabled;
    return this;
  }

  user(user) {
    this._user = user;
    return this;
  }

  channel(channel) {
    this._channel = channel;
    return this;
  }

  level(level) {
    if (typeof level === 'string') {
      this._level = Severity.fromString(level);
    } else if (typeof level === 'number') {
      this._level = Severity.fromInt(level);
    } else if (level && level.constructor.name === 'Severity') {
      this._level = level;
    } else {
      this._level = Severity.DEBUG;
    }

    this._notifiers.forEach(notif =>
      notif.level(this._level));

    return this;
  }

  formatter(formatter) {
    this._formatter = formatter;
    this._notifiers.forEach(notif =>
      notif.formatter(formatter));
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
    return this._notifiers.some(notif => notif.name === name);
  }

  getNotifier(name) {
    if (!this.hasNotifier(name)) {
      return null;
    } else {
      return this._notifiers.filter(notif => notif.name === name).pop();
    }
  }

  // Login logic
  canLog(severity) {
    return this._level.canLogSeverity(severity);
  }

  log(message, data = null, opts = {}) {
    let defaultLogOptions = {
      level: this._level,
      channel: this._channel,
      user: this._user,
      time: new Date()
    };

    const { level, channel, time, user } = {
      ...defaultLogOptions,
      ...opts
    };

    if (this._enabled) {
      let log = message;
      if (!(message instanceof Log)) {
        log = new Log(message, data, level, channel, time, user);
      }

      return this._notifiers
        .forEach(notifier => {
          if (notifier.canOutput(level)) {
            if (
              typeof this.options.ignore === 'function' &&
              this.options.ignore(log, notifier)
            ) return;

            if (typeof this.options.preNotify === 'function') {
              this.options.preNotify(log, notifier);
            }
            notifier.notify(log);
          }
        });
    }

    return this;
  }

  profile(name, opts = {
    colored: true
  }) {
    if (name in this._profiles) {
      this._profiles[name].end();
    } else {
      let self = this;
      this._profiles[name] = {
        startTime: Date.now(),
        end() {
          let endTime = Date.now();
          let diff = endTime - this.startTime;
          let diffLabel = 'ms';

          const toLocaleString = (timestamp) => new Date(timestamp)
            .toTimeString()
            .split(' ')
            .shift();


          if (diff > 5000) {
            diff *= 0.001;
            diffLabel = 's';
          }

          let msg = [
            `[<%b${toLocaleString(this.startTime)}>] - (<%m${name}>)` + (opts.description ? ' - ' + opts.description : ''),
            ` - <%grStart:> <%b${toLocaleString(this.startTime)}>`,
            ` - <%grEnd:>   <%b${toLocaleString(endTime)}>`,
            ` - <%grTime:>  <%g${diff}${diffLabel}>`,
          ].join('\n');

          let log = new Log(msg);

          let formatted;
          if (opts.colored) {
            formatted = log.colored({
              template: '{message}'
            });
          } else {
            formatted = log.format({
              template: '{message}'
            });
          }

          self.notifier.output(formatted);
        }
      };
    }
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

  // Static methods
  static get(opts = 'default', args = {}) {
    if (
      typeof opts === 'string' && ['file', 'console', 'remote', 'memory', 'default'].includes(opts)
    ) {
      let notifier = new Notifiers.Console(args);
      switch (opts) {
        case 'file':
          notifier = new Notifiers.File(args);
          break;
        case 'console':
        case 'default':
          notifier = new Notifiers.Console(args);
          break;
        case 'remote':
          notifier = new Notifiers.Remote(args);
          break;
        case 'memory':
          notifier = new Notifiers.Memory(args);
          break;
      }

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
        console.log('_channel', logger._channel);
        if (opts.mergeOptions === true) {
          console.log('mergeOptions');
          options = Object.assign(options, logger.options);
        }

        if (opts.mergeNotifiers === true) {
          console.log('mergeNotifiers');
          notifiers.push(...logger._notifiers);
        }
      }
    }

    console.log('options', notifiers);
    let logger = new Logger(options);
    logger.setNotifiers(notifiers);
    return logger;
  }
}

Logger.DefaultOptions = {
  user: os.userInfo().username,
  ignore: null,
  level: Severity.DEBUG,
  channel: path.basename(__filename),
  formatter: Formatter.get('detailed'),
  enabled: true,
  color: false,
};

module.exports = Logger;