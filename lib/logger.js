'use strict';

const Log = require('./log');
const Notifiers = require('./notifiers');
const Severity = require('./severity');
const os = require('os');

class Logger {
  constructor(options, notifiers = []) {
    this.options = {
      ...Logger.DefaultOptions,
      ...options
    };
    this._profiles = {};
    this._notifiers = options.notifiers || notifiers;
    if (!this._notifiers || this._notifiers.length === 0) {
      this._notifiers = [
        new Notifiers.Console(options)
      ];
    }

    let {
      level,
      enabled,
      user,
      channel,
    } = this.options;

    this.level(level);
    this.user(user);
    this.channel(channel);
    this.enabled(enabled);
  }

  clone() {
    let logger = new Logger(this.options, [...this._notifiers]);
    return logger;
  }

  fork() {
    return this.clone();
  }

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
    this._notifiers.forEach(notif =>
      notif.formatter(formatter));

    return this;
  }

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

  color(enabled = true) {
    this.options.color = true;
    this._notifiers.forEach(notif =>
      notif.color(enabled));

    return this;
  }

  lineNumbers(show) {
    this._notifiers.forEach(notif =>
      notif.lineNumbers(show));

    return this;
  }

  canLog(severity) {
    return this._level.canLogSeverity(severity);
  }

  log(message, data = null, opts = {}) {
    let defaultLogOptions = {
      level: this._level,
      channel: this._channel,
      user: this._user,
      time: new Date()
    }
    const {
      level,
      channel,
      time,
      user
    } = {
      ...defaultLogOptions,
      ...opts
    };

    if (this._enabled) {
      let log = message;
      if (!(message instanceof Log)) {
        log = new Log(message, data, level, channel, time, user);
      }

      if (typeof this.options.ignore === 'function' && this.options.ignore(log)) {
        return;
      }

      return this._notifiers.forEach(el => {
        if (el.canOutput(level)) {
          el.notify(log);
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
}

Logger.DefaultOptions = {
  user: os.userInfo().username,
  ignore: null
};

module.exports = Logger;