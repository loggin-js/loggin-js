'use strict';

const clicolor = require('cli-color');
const Severity = require('./severity');
const Formatter = require('./formatter');


/**
 * TODO: Add type checking in constructor
 */
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