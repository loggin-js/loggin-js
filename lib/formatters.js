'use strict';
const strif = require('strif');
const clicolor = require('cli-color');

const padd = (v) => ` ${v} `;

let colors = {
  cl_red: s => clicolor.red(s),
  cl_blue: s => clicolor.blue(s),
  cl_cyan: s => clicolor.cyan(s),
  cl_green: s => clicolor.green(s),
  cl_gray: s => clicolor.blackBright(s),
  cl_yellow: s => clicolor.yellow(s),
  cl_orange: s => clicolor.orange(s),
  cl_purple: s => clicolor.purple(s),
  cl_black: s => clicolor.black(s),
  cl_white: s => clicolor.white(s),
  cl_magenta: s => clicolor.magenta(s),
};

let labels = {
  lbl_red: s => clicolor.bgRed(padd(s)),
  lbl_blue: s => clicolor.bgBlue(padd(s)),
  lbl_cyan: s => clicolor.bgCyan(padd(s)),
  lbl_green: s => clicolor.bgGreen(padd(s)),
  lbl_gray: s => clicolor.bgGray(padd(s)),
  lbl_yellow: s => clicolor.bgYellow(padd(s)),
  lbl_orange: s => clicolor.bgOrange(padd(s)),
  lbl_purple: s => clicolor.bgPurple(padd(s)),
  lbl_black: s => clicolor.bgBlack(padd(s)),
  lbl_white: s => clicolor.bgWhite(padd(s)),
  lbl_magenta: s => clicolor.bgMagenta(padd(s)),
};

let ignored = [
  'lbl_red',
  'lbl_blue',
  'lbl_cyan',
  'lbl_green',
  'lbl_gray',
  'lbl_yellow',
  'lbl_orange',
  'lbl_purple',
  'lbl_black',
  'lbl_white',
  'lbl_magenta',

  'cl_red',
  'cl_blue',
  'cl_cyan',
  'cl_green',
  'cl_gray',
  'cl_yellow',
  'cl_orange',
  'cl_purple',
  'cl_black',
  'cl_white',
  'cl_magenta',
]


const formatter =
  strif.create({
    transformers: {
      json: s => s ? JSON.stringify(s, null, 2) : s,
      json_u: s => s ? JSON.stringify(s) : s,
      upper: s => s ? s.toUpperCase() : s,
      lower: s => s ? s.toLowerCase() : s,
      string: s => s ? s.toString() : s,
      int: s => s ? s.toInt() : s,
      date: s => s ? new Date(s).toLocaleDateString() : s,
      ...labels,
      ...colors
    }
  });

class Formatter {
  constructor(template) {
    this.template = template;

    /**
     * Array of regexp, transformer pairs, that change the color of a specific pattern
     */
    this.replaceables = [
      {
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

  color(str) {
    this.replaceables.forEach((re) => {
      str = str.replace(re.regexp, re.fn);
    });

    return str;
  }

  format(log, opts = { color: false }) {
    let {
      message,
      data,
      level,
      channel,
      levelStr,
      time,
      user,
    } = log;

    return Formatter.format({
      message,
      data,
      level,
      channel,
      levelStr,
      time,
      user,
    }, this, opts.color);
  }

  /**
   * @arg {Logger} log
   * @return {String}
   */
  static format(log, formatter, color = false) {
    const tmpltType = formatter.template.constructor.name;
    if (tmpltType !== 'StrifTemplate') {
      throw Error('options.formatter should be type: "StrifTemplate", not: "' + tmpltType + '"');
    }

    return formatter.template.compile(log, {
      ignoreTransformers: color ? false : ignored
    });
  }

  static search(value) {
    for (let key in Formatter._formatters) {
      let formatter = Formatter._formatters[key];
      if ((key).toLowerCase() === String(value).toLowerCase()) {
        return formatter;
      }
    }

    return Formatter.LONG;
  }

  static get(val) {
    if (val && val.constructor.name === 'Formatter') {
      return val;
    }

    return Formatter.search(val);
  }

  static register(name, template, options = {}) {
    if (typeof name !== 'string') {
      throw new Error('"name" must be a string got: ' + typeof name);
    }
    if (typeof template !== 'string') {
      throw new Error('"template" must be a string got: ' + typeof template);
    }

    let nameUpper = name.toUpperCase();

    Formatter[nameUpper] = Formatter._formatters[nameUpper] =
      new Formatter(formatter.template(template, options));

    return Formatter;
  }
}

Formatter._formatters = {};

Formatter
  .register(
    'SHORT',
    '[{time}] - {level} - {message}', {
      props: {
        time: {
          transformers: ['date'],
        },
        level: {
          transformers: ['string']
        },
        message: {

        }
      }
    }
  )
  .register(
    'MEDIUM',
    '[{time}] - {level} - {message} {data}', {
      props: {
        time: {
          transformers: ['date']
        },
        level: {
          transformers: ['string']
        },
        message: {},
        data: {
          transformers: ['json', 'cl_gray']
        }
      }
    }
  )
  .register(
    'LONG',
    '[{time} {user}] - {level} - {message} {data}', {
      props: {
        time: {
          transformers: ['date', 'cl_blue']
        },
        user: {
          transformers: ['cl_gray']
        },
        level: {
          transformers: ['string']
        },
        message: {},
        data: {
          transformers: ['json_u', 'cl_gray']
        }
      }
    }
  )
  .register(
    'DETAILED',
    '{time} {user} {channel} - {level} - {message} {data}', {
      props: {
        time: {
          transformers: ['date', 'lbl_cyan']
        },
        user: {
          transformers: ['cl_gray']
        },
        level: {
          transformers: ['string']
        },
        data: {
          transformers: ['json', 'cl_gray']
        },
        channel: {},
        message: {},
      }
    }
  )
  .register(
    'MINIMAL',
    '{channel} - {message}', {
      props: {
        message: {},
        channel: {},
      }
    }
  )

module.exports = Formatter;
