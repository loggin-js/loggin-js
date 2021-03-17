'use strict';
const Severity = require('./severity');
const Formatter = require('./formatter');


class Log {
  constructor(message, data, level = Severity.DEBUG, channel = '', time = new Date(), user) {
    this.message = message;
    this.data = data;
    this.level = level;
    this.channel = channel;
    this.levelStr = level.toString();
    this.time = time;
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

  static fromObject(obj) {
    return new Log(obj.message, obj.data, obj.level, obj.channel, obj.time, obj.user);
  }
}

module.exports = Log;