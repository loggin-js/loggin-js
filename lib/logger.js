'use strict';

const Log = require('./log');
const Severity = require('./severity');
const path = require('path');

/**
 * Abstract logger class
 */
class Logger {
  constructor(notifier, options) {
    this.notifier = notifier;

    // Set level
    let level = options.level;
    this.setLevel(level);

    this._enabled = true;
    this._user = options.user || require('os').userInfo().username;
    this.channel = options.channel || path.basename(process.argv[1]);

    options.level = this._level;
    options.user = this._user;
    options.channel = this._channel;
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

module.exports = Logger;
