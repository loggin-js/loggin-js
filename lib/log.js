const clicolor = require('cli-color');
const severity = require('./severity');
const { Formatter, short } = require('./formatters');

/**
 * @class Log
 * 
 * @param {string} message 
 * @param {object|any} data 
 * @param {severity} int - standard RFC3164 code (https://tools.ietf.org/html/rfc3164)
 * @param {string} channel 
 */
class Log {
  constructor(message, data = null, severity = severity.DEBUG, channel = "", time = new Date(), user) {
    this.message = message;
    this.data = data;
    this.severity = severity;
    this.channel = channel;
    this.severityStr = severity.toString();
    this.time = time || new Date();
    this.user = user

    this.replaceables = [
      {
        regexp: /\d/g,
        fn: (a) => clicolor.blueBright(a)
      },
      {
        regexp: /INFO/g,
        fn: (a) => clicolor.greenBright(a)
      },
      {
        regexp: /DEBUG/g,
        fn: (a) => clicolor.blueBright(a)
      },
      {
        regexp: /NOTICE/g,
        fn: (a) => clicolor.cyanBright(a)
      },
      {
        regexp: /WARNING|EMERGENCY/g,
        fn: (a) => clicolor.yellowBright(a)
      },
      {
        regexp: /ALERT|CRITICAL|ERROR/g,
        fn: (a) => clicolor.redBright(a)
      }
    ];
  }

  colored() {
    let formated = this.format();
    this.replaceables.forEach(re => {
      formated = formated.replace(re.regexp, re.fn);
    });
    return formated;
  }

  format() {
    return short.format(this);
  }
}

module.exports = Log;