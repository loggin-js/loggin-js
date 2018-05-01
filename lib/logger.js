const Log = require('./log')
const Severity = require('./severity');

class Logger {
  constructor(notifier, options) {
    this.notifier = notifier;
    this._level = options.level || Severity.DEBUG;
  }

  /**
   * @param number level
   */
  setLevel(level) {
    this._level = level;
    this.notifier.setLevel(this._level);
    return this;
  }

  /**
   * @param val {Boolean}
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
   * @param Severity severity
   * @return boolean
   */
  canLog(severity) {
    return this.getLevel().canLogSeverity(severity);
  }

  /**
   * @param string message
   * @param mixed data
   * @param int severity , standard RFC3164 code (https://tools.ietf.org/html/rfc3164)
   * @param string channel
   */
  log(message, data = null, severity = Severity.DEBUG, channel = "", time, user) {
    if (this.canLog(severity)) {
      if (message instanceof Log) {
        return this.notifier.notify(message);
      } else {
        let log = new Log(message, data, severity, channel, time, user);
        this.notifier.notify(log);
      }
    }
    return this;
  }

  /**
   * @param {string} message
   * @param {any} data
   * @param {string} channel
   */
  debug(message, data = null, channel = "") {
    this.log(message, data, Severity.DEBUG, channel);
    return this;
  }

  /**
   * @param {string} message
   * @param {any} data
   * @param {string} channel
   */
  warning(message, data = null, channel = "") {
    this.log(message, data, Severity.WARNING, channel);
    return this;
  }

  /**
   * @param {string} message
   * @param {any} data
   * @param {string} channel
   */
  alert(message, data = null, channel = "") {
    this.log(message, data, Severity.ALERT, channel);
    return this;
  }

  /**
   * @param {string} message
   * @param {any} data
   * @param {string} channel
   */
  emergency(message, data = null, channel = "") {
    this.log(message, data, Severity.EMERGENCY, channel);
    return this;
  }

  /**
   * @param {string} message
   * @param {any} data
   * @param {string} channel
   */
  critical(message, data = null, channel = "") {
    this.log(message, data, Severity.CRITICAL, channel);
    return this;
  }

  /**
   * @param {string} message
   * @param {any} data
   * @param {string} channel
   */
  error(message, data = null, channel = "") {
    this.log(message, data, Severity.ERROR, channel);
    return this;
  }

  /**
   * @param {string} message
   * @param {any} data
   * @param {string} channel
   */
  notice(message, data = null, channel = "") {
    this.log(message, data, Severity.NOTICE, channel);
    return this;
  }

  /**
   * @param {string} message
   * @param {any} data
   * @param {string} channel
   */
  info(message, data = null, channel = "") {
    this.log(message, data, Severity.INFO, channel);
    return this;
  }

}

module.exports = Logger;