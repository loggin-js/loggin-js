'use strict';

const clicolor = require('cli-color');
const Severity = require('./severity');
const { Formater } = require('./formaters');


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
    this.data = () => data ? JSON.stringify(data) : '';
    this.severity = severity;
    this.channel = channel;
    this.severityStr = severity.toString();
    this.time = time || new Date();
    this.user = user;

    this.replaceables = [
      {
        regexp: /%bb[^-_,|]+ /g,
        fn: (str) => clicolor.blueBright(str).replace('%bb', '')
      },
      {
        regexp: /INFO|%g[^-_,|]+ /g,
        fn: (str) => clicolor.greenBright(str).replace('%g', '')
      },
      {
        regexp: /DEBUG|%b[^-_,|]+ /g,
        fn: (str) => clicolor.blueBright(str).replace('%b', '')
      },
      {
        regexp: /NOTICE|%c[^-_,|]+ /g,
        fn: (str) => clicolor.cyanBright(str).replace('%c', '')
      },
      {
        regexp: /WARNING|EMERGENCY|%y[^-_,|]+ /g,
        fn: (str) => clicolor.yellowBright(str).replace('%y', '')
      },
      {
        regexp: /ALERT|CRITICAL|ERROR|%r[^-_,|]+ /g,
        fn: (str) => clicolor.redBright(str).replace('%r', '')
      },
      {
        regexp: /%p[^-_,|]+ /g,
        fn: (str) => clicolor.xterm(13)(str).replace('%p', '')
      },
    ];
  }

  colored(formater) {
    let formated = this.format(formater);
    this.replaceables.forEach((re) => {
      formated = formated.replace(re.regexp, re.fn);
    });

    return formated;
  }

  format(formater) {
    return Formater.format(this, formater);
  }
}

module.exports = Log;
