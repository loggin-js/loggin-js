'use strict';

const clicolor = require('cli-color');
const Severity = require('./severity');
const Formatter = require('./formatters');


class Log {
  constructor(message, data = null, level = Severity.DEBUG, channel = '', time = new Date(), user) {
    this.message = message;
    this.data = data;
    this.level = level;
    this.channel = channel;
    this.levelStr = level.toString();
    this.time = time || new Date();
    this.user = user;


    // This is weird, think better way of doing it
    this.replaceables = [{
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
  }

  /**
   * Returns colored log
   * @param {string} formatter
   */
  colored(str) {
    this.replaceables.forEach((re) => {
      str = str.replace(re.regexp, re.fn);
    });

    return str;
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