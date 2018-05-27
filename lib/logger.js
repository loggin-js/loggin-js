'use strict';

const Log = require('./log');
const Severity = require('./severity');

class Logger {
  constructor(notifier, options) {
    this.notifier = notifier;
    this._level = options.level || Severity.DEBUG;
    this._enabled = true;
    this._user = null;
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
   * @arg {number} level
   */
  setLevel(level) {
    this._level = level;
    this.notifier.setLevel(this._level);

    return this;
  }

  /**
   * @arg {val} {Boolean}
   */
  setColor(val) {
    this.notifier.setColor(val);

    return this;
  }

  /**
   * @return number
   */
  getLevel() {
    return this._level;
  }

  /**
   * @arg {Severity} severity
   * @return boolean
   */
  canLog(severity) {
    return this.getLevel().canLogSeverity(severity);
  }

  /**
   * @arg {string} message
   * @arg {mixed} data
   * @arg {int|Severity} level , standard RFC3164 code (https://tools.ietf.org/html/rfc3164)
   * @arg {string} channel
   */
  log(message, data = null, level = Severity.DEBUG, channel = '', time, user = this._user) {
    if (this.canLog(level) && this._enabled) {
      if (message instanceof Log) {
        return this.notifier.notify(message);
      } else {
        let log = new Log(message, data, level, channel, time, user);
        this.notifier.notify(log);
      }
    }

    return this;
  }

  /**
   * @arg {{}string} message
   * @arg {{}any} data
   * @arg {{}string} channel
   */
  debug(message, data = null, channel = '') {
    this.log(message, data, Severity.DEBUG, channel);

    return this;
  }

  /**
   * @arg {{}string} message
   * @arg {{}any} data
   * @arg {{}string} channel
   */
  warning(message, data = null, channel = '') {
    this.log(message, data, Severity.WARNING, channel);

    return this;
  }

  /**
   * @arg {{}string} message
   * @arg {{}any} data
   * @arg {{}string} channel
   */
  alert(message, data = null, channel = '') {
    this.log(message, data, Severity.ALERT, channel);

    return this;
  }

  /**
   * @arg {{}string} message
   * @arg {{}any} data
   * @arg {{}string} channel
   */
  emergency(message, data = null, channel = '') {
    this.log(message, data, Severity.EMERGENCY, channel);

    return this;
  }

  /**
   * @arg {{}string} message
   * @arg {{}any} data
   * @arg {{}string} channel
   */
  critical(message, data = null, channel = '') {
    this.log(message, data, Severity.CRITICAL, channel);

    return this;
  }

  /**
   * @arg {{}string} message
   * @arg {{}any} data
   * @arg {{}string} channel
   */
  error(message, data = null, channel = '') {
    this.log(message, data, Severity.ERROR, channel);

    return this;
  }

  /**
   * @arg {{}string} message
   * @arg {{}any} data
   * @arg {{}string} channel
   */
  notice(message, data = null, channel = '') {
    this.log(message, data, Severity.NOTICE, channel);

    return this;
  }

  /**
   * @arg {{}string} message
   * @arg {{}any} data
   * @arg {{}string} channel
   */
  info(message, data = null, channel = '') {
    this.log(message, data, Severity.INFO, channel);

    return this;
  }
}

module.exports = Logger;
