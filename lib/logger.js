'use strict';

const Log = require('./log');
const Notifiers = require('./notifiers');
const Severity = require('./severity');
const Formatter = require('./formatters');
const path = require('path');
const os = require('os');


/**
 * Abstract logger class
 */
class Logger {
  constructor(notifier, options) {

    options = {
      ...LoggerOptions,
      ...options
    }

    this.notifier = notifier;

    // Set level
    let level = options.level;
    this.setLevel(level);

    this._enabled = true;
    this._user = options.user;
    this.channel = options.channel;

    options.level = this._level;
    options.user = this._user;
    options.channel = this._channel;

    this._profiles = {};
  }

  /**
   * @arg {boolean} enabled
   */
  setEnabled(enabled) {
    this._enabled = enabled;
  }

  /**
   * @return {boolean} enabled
   */
  isEnabled() {
    return this._enabled;
  }

  /**
   * @arg {string} user
   */
  setUser(user) {
    this._user = user;

    return this;
  }

  /**
   * @return {string}
   */
  getUser() {
    return this._user;
  }

  /**
   * @arg {string} channel
   */
  setChannel(channel) {
    this.channel = channel;
  }

  /**
   * @return {string}
   */
  getChannel() {
    return this.channel;
  }


  /**
   * @arg {number} level
   */
  setLevel(level) {
    if (typeof level === 'string') {
      this._level = Severity.fromString(level);
    } else if (typeof level === 'number') {
      this._level = Severity.fromInt(level);
    } else if (level && level.constructor.name === 'Severity') {
      this._level = level;
    } else {
      this._level = Severity.DEBUG;
    }
    this.notifier.setLevel(this._level);

    return this;
  }

  /**
   * @return number
   */
  getLevel() {
    return this._level;
  }

  setFormatter(formatter) {
    this.notifier.setFormatter(formatter);

    return this;
  }

  getFormatter() {

    return this.notifier._formatter;
  }

  setColor(val) {
    this.notifier.setColor(val);

    return this;
  }


  /**
   * @arg {Severity} severity
   * @return boolean
   */
  canLog(severity) {
    return this.getLevel().canLogSeverity(severity);
  }

  /**
   * @param show {boolean}
   */
  showLineNumbers(show) {
    this.notifier.showLineNumbers(show);

    return this;
  }

  /**
   * @arg {string} message
   * @arg {mixed} data
   * @arg {int|Severity} level , standard RFC3164 code (https://tools.ietf.org/html/rfc3164)
   * @arg {string} channel
   */
  log(message, data = null, level = Severity.DEBUG, channel = this.getChannel(), time, user = this._user) {
    if (this.canLog(level) && this._enabled) {
      if (message instanceof Log) {

        return this.notifier.notify(message);
      } else {
        let log = new Log(message, data, level, channel, time, user);

        return this.notifier.notify(log);
      }
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
  debug(message, data = null, channel = this.getChannel()) {
    this.log(message, data, Severity.DEBUG, channel);

    return this;
  }

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  warning(message, data = null, channel = this.getChannel()) {
    this.log(message, data, Severity.WARNING, channel);

    return this;
  }

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  alert(message, data = null, channel = this.getChannel()) {
    this.log(message, data, Severity.ALERT, channel);

    return this;
  }

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  emergency(message, data = null, channel = this.getChannel()) {
    this.log(message, data, Severity.EMERGENCY, channel);

    return this;
  }

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  critical(message, data = null, channel = this.getChannel()) {
    this.log(message, data, Severity.CRITICAL, channel);

    return this;
  }

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  error(message, data = null, channel = this.getChannel()) {
    this.log(message, data, Severity.ERROR, channel);

    return this;
  }

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  notice(message, data = null, channel = this.getChannel()) {
    this.log(message, data, Severity.NOTICE, channel);

    return this;
  }

  /**
   * @arg {string} message
   * @arg {any} data
   * @arg {string} channel
   */
  info(message, data = null, channel = this.getChannel()) {
    this.log(message, data, Severity.INFO, channel);

    return this;
  }
}

class LoggerV2 {
  constructor(options, ...notifiers) {
    this._options = {
      ...LoggerV2.options,
      ...options
    };
    this._profiles = {};
    this._notifiers = notifiers;

    if (this._notifiers.length === 0) {
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
      notif.setLevel(this._level));

    return this;
  }

  /**
   * Set a formatter
   * @param {*} formatterStr 
   */
  formatter(formatterStr) {
    this._notifiers.forEach(notif =>
      notif.setFormatter(formatterStr));

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

  /**
   * enable/disable colored output
   * @param {boolean} enabled 
   */
  color(enabled = true) {
    this._options.color = true;
    this._notifiers.forEach(notif =>
      notif.setColor(enabled));

    return this;
  }

  /**
   * @param show {boolean}
   */
  lines(show) {
    this._notifiers.forEach(notif =>
      notif.showLineNumbers(show));

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

LoggerV2.options = {
  user: os.userInfo().username
};
Logger.V2 = LoggerV2;

module.exports = Logger;