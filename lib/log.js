'use strict';

const clicolor = require('cli-color');
const Severity = require('./severity');
const { short } = require('./formatters');


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
    this.data = data;
    this.severity = severity;
    this.channel = channel;
    this.severityStr = severity.toString();
    this.time = time || new Date();
    this.user = user;

    this.replaceables = [
      {
        regexp: /\d/g,
        fn: (str) => clicolor.blueBright(str)
      },
      {
        regexp: /INFO/g,
        fn: (str) => clicolor.greenBright(str)
      },
      {
        regexp: /DEBUG/g,
        fn: (str) => clicolor.blueBright(str)
      },
      {
        regexp: /NOTICE/g,
        fn: (str) => clicolor.cyanBright(str)
      },
      {
        regexp: /WARNING|EMERGENCY/g,
        fn: (str) => clicolor.yellowBright(str)
      },
      {
        regexp: /ALERT|CRITICAL|ERROR/g,
        fn: (str) => clicolor.redBright(str)
      }
    ];
  }

  colored() {
    let formated = this.format();
    this.replaceables.forEach((re) => {
      formated = formated.replace(re.regexp, re.fn);
    });

    return formated;
  }

  format() {
    return short.format(this);
  }
}

module.exports = Log;
