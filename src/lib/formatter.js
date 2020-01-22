/* istanbul ignore file */
'use strict';
const strif = require('strif');
const colors = require('colors');
const padd = (v) => ` ${v} `;


// TODO: Rethink formatting and coloring, this is kinda crap :P

const colorsTransformers = {
  cl_red: s => colors.red(s),
  cl_blue: s => colors.blue(s),
  cl_cyan: s => colors.cyan(s),
  cl_green: s => colors.green(s),
  cl_gray: s => colors.gray(s),
  cl_yellow: s => colors.yellow(s),
  cl_orange: s => colors.orange(s),
  cl_purple: s => colors.purple(s),
  cl_black: s => colors.black(s),
  cl_white: s => colors.white(s),
  cl_magenta: s => colors.magenta(s),
};

const labelsTransformers = {
  lbl_red: s => colors.bgRed(padd(s)),
  lbl_blue: s => colors.bgBlue(padd(s)),
  lbl_cyan: s => colors.bgCyan(padd(s)),
  lbl_green: s => colors.bgGreen(padd(s)),
  lbl_gray: s => colors.bgGray(padd(s)),
  lbl_yellow: s => colors.bgYellow(padd(s)),
  lbl_orange: s => colors.bgOrange(padd(s)),
  lbl_purple: s => colors.bgPurple(padd(s)),
  lbl_black: s => colors.bgBlack(padd(s)),
  lbl_white: s => colors.bgWhite(padd(s)),
  lbl_magenta: s => colors.bgMagenta(padd(s)),
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
];

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
      ...labelsTransformers,
      ...colorsTransformers
    }
  });

class Formatter {
  constructor(template) {
    this.template = template;
  }

  color(str) {
    Formatter.replaceables.forEach(
      (re) => str = str.replace(re.regexp, re.fn)
    );
    return str;
  }

  formatLog(log, opts = { color: false }) {
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

  static get(value) {
    if (value && value.constructor.name === 'Formatter') {
      return value;
    }

    return Formatter.search(value);
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

/**
 * Array of regexp, transformer pairs, that change the color of a specific pattern
 */
Formatter.replaceables = [
  {
    regexp: /<%bb[^>]+>/g,
    fn: (str) => colors.brightBlue(str).replace(/<%bb(.+)>/g, '$1')
  },
  {
    regexp: /<%gr[^>]+>/g,
    fn: (str) => colors.brightGray(str).replace(/<%gr(.+)>/g, '$1')
  },
  {
    regexp: /INFO|INF|<%g[^>]+>/g,
    fn: (str) => colors.brightGreen(str).replace(/<%g(.+)>/g, '$1')
  },
  {
    regexp: /SILLY|SIL|<%m[^>]+>/g,
    fn: (str) => colors.brightMagenta(str).replace(/<%m(.+)>/g, '$1')
  },
  {
    regexp: /DEBUG|DEB|<%b[^>]+>/g,
    fn: (str) => colors.brightBlue(str).replace(/<%b(.+)>/g, '$1')
  },
  {
    regexp: /NOTICE|NOT|<%c[^>]+>/g,
    fn: (str) => colors.brightCyan(str).replace(/<%c(.+)>/g, '$1')
  },
  {
    regexp: /WARNING|WAR|EME|EMERGENCY|<%y[^>]+>/g,
    fn: (str) => colors.brightYellow(str).replace(/<%y(.+)>/g, '$1')
  },
  {
    regexp: /ALERT|ALE|CRITICAL|CRI|ERROR|ERR|<%r[^>]+>/g,
    fn: (str) => colors.brightRed(str).replace(/<%r(.+)>/g, '$1')
  },
  {
    regexp: /<%p[^>]+>/g,
    fn: (str) => colors.yellow(str).replace(/<%p(.+)>/g, '$1')
  },
  {
    regexp: /<%m[^>]+>/g,
    fn: (str) => colors.magenta(str).replace(/<%m(.+)>/g, '$1')
  }
];

Formatter._formatters = {};

module.exports = Formatter;
