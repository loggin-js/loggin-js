'use strict';

const clicolor = require('cli-color');
const Severity = require('./severity');
const { Formatter } = require('./formatters');


/**
 * @class Log
 * 
 * @param {string} message 
 * @param {object|any} data 
 * @param {severity} int - standard RFC3164 code (https://tools.ietf.org/html/rfc3164)
 * @param {string} channel 
 */
class Log {
  constructor(message, data = null, severity = Severity.DEBUG, channel = '', time = new Date(), user) {
    this.message = message;
    this.data = () => data
      ? JSON.stringify(data)
      : '';
    this.severity = severity;
    this.channel = channel;
    this.severityStr = severity.toString();
    this.time = time || new Date();
    this.user = user;


    // This is weird, think better way of doing it
    this.replaceables = [
      {
        regexp: /<%bb[^>]+>/g,
        fn: (str) => clicolor.blueBright(str).replace(/<%bb(.+)>/g, '$1')
      },
      {
        regexp: /INFO|<%gr[^>]+>/g,
        fn: (str) => clicolor.blackBright(str).replace(/<%gr(.+)>/g, '$1')
      },
      {
        regexp: /INFO|<%g[^>]+>/g,
        fn: (str) => clicolor.greenBright(str).replace(/<%g(.+)>/g, '$1')
      },
      {
        regexp: /DEBUG|<%b[^>]+>/g,
        fn: (str) => clicolor.blueBright(str).replace(/<%b(.+)>/g, '$1')
      },
      {
        regexp: /NOTICE|<%c[^>]+>/g,
        fn: (str) => clicolor.cyanBright(str).replace(/<%c(.+)>/g, '$1')
      },
      {
        regexp: /WARNING|EMERGENCY|<%y[^>]+>/g,
        fn: (str) => clicolor.yellowBright(str).replace(/<%y(.+)>/g, '$1')
      },
      {
        regexp: /ALERT|CRITICAL|ERROR|<%r[^>]+>/g,
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
  colored(formatter) {
    let formated = this.format(formatter);
    this.replaceables.forEach((re) => {
      formated = formated.replace(re.regexp, re.fn);
    });

    return formated;
  }

  /**
   * Returns formatted log
   * @param {string} formatter
   */
  format(formatter) {
    return Formatter.format(this, formatter);
  }
}

module.exports = Log;
