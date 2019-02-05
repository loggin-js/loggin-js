'use strict';

const Log = require('./log');
const Notifiers = require('./notifiers');
const Severity = require('./severity');
const os = require('os');
const {
  debugAction
} = require('./utils');


class Logger {
  constructor(options, ...notifiers) {
    this._options = {
      ...Logger.options,
      ...options
    };
    this._profiles = {};
    this._notifiers = options.notifiers || notifiers || [];
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
    } = this._options;

    this.level(level);
    this.user(user);
    this.channel(channel);
    this.enabled(enabled);
  }

  clone() {
    let logger = new Logger(this._options, ...this._notifiers);
    return logger;
  }

  /**
   * @arg {boolean} enabled
   */
  enabled(enabled) {
    this._enabled = enabled;
    return this;
  }


  /**
   * @arg {string} user
   */
  user(user) {
    this._user = user;
    return this;
  }

  /**
   * @arg {string} channel
   */
  channel(channel) {
    this._channel = channel;
    return this;
  }

  /**
   * @arg {number} level
   */
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

  /**
   * Set a formatter
   * @param {*} formatter 
   */
  formatter(formatter) {
    this._notifiers.forEach(notif =>
      notif.formatter(formatter));

    return this;
  }

  /**
   * Add one or more notifiers
   * @param  {...any} notifiers 
   */
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

  /**
   * enable/disable colored output
   * @param {boolean} enabled 
   */
  color(enabled = true) {
    this._options.color = true;
    this._notifiers.forEach(notif =>
      notif.color(enabled));

    return this;
  }

  /**
   * @param show {boolean}
   */
  lineNumbers(show) {
    this._notifiers.forEach(notif =>
      notif.lineNumbers(show));

    return this;
  }

  /**
   * @arg {Severity} severity
   * @return boolean
   */
  canLog(severity) {
    return this._level.canLogSeverity(severity);
  }


  /**
   * @arg {string} message
   * @arg {mixed} data
   * @arg {int|Severity} level , standard RFC3164 code (https://tools.ietf.org/html/rfc3164)
   * @arg {string} channel
   */
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

      return this._notifiers.forEach(el => {
        if (el.canOutput(level)) {
          el.notify(log);
        }
      });
    }

    return this;
  }

  /**
   * @param {string} name 
   */
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

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  debug(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.DEBUG,
      ...opts
    });

    return this;
  }

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  warning(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.WARNING,
      ...opts
    });

    return this;
  }

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  alert(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.ALERT,
      ...opts
    });

    return this;
  }

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  emergency(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.EMERGENCY,
      ...opts
    });

    return this;
  }

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  critical(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.CRITICAL,
      ...opts
    });

    return this;
  }

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  error(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.ERROR,
      ...opts
    });

    return this;
  }

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  notice(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.NOTICE,
      ...opts
    });

    return this;
  }

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  info(message, data = null, opts = {}) {
    this.log(message, data, {
      level: Severity.INFO,
      ...opts
    });

    return this;
  }
}

Logger.options = {
  user: os.userInfo().username
};

module.exports = Logger;