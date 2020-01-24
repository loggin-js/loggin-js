'use strict';
const strif = require('strif');
const colors = require('colors');

const padd = (v) => ` ${v} `;
const defaultTransformers = {
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
  // Labels
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
  // Utils
  stringify: s => s ? JSON.stringify(s, null, 2) : s,
  stringifyNoFormat: s => s ? JSON.stringify(s) : s,
  uppercase: s => s ? s.toUpperCase() : s,
  lowercase: s => s ? s.toLowerCase() : s,
  capitalize: s => s ? (string.charAt(0).toUpperCase() + string.slice(1)) : s,
  toString: s => s ? s.toString() : s,
  toInt: s => s ? s.toInt() : s,
  toLocaleDate: s => s ? new Date(s).toLocaleDateString() : s,
};

const formatter = strif.create({
  transformers: defaultTransformers
});

class Formatter {
  constructor(template) {
    this.template = template;
  }

  formatLog(log, opts = { color: false }) {
    return Formatter.format(log, this, opts.color);
  }

  static format(log, formatter, color = false) {
    const tmpltType = formatter.template.constructor.name;
    if (tmpltType !== 'StrifTemplate') {
      throw Error('options.formatter should be type: "StrifTemplate", not: "' + tmpltType + '"');
    }

    if (color) {
      colors.enable();
    } else {
      colors.disable();
    }

    return formatter.template.compile(log);
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
    if (
      value && (
        value.constructor.name === 'Formatter'
        || typeof value.formatLog === 'function'
      )
    ) {
      return value;
    }

    return Formatter.search(value);
  }

  static create(template, options = {}) {
    if (typeof template !== 'string') {
      throw new Error('"template" must be a string got: ' + typeof template);
    }

    return new Formatter(formatter.template(template, options));
  }

  static register(name, template, options = {}) {
    if (typeof name !== 'string') {
      throw new Error('"name" must be a string got: ' + typeof template);
    }

    let nameUpper = name.toUpperCase();
    Formatter[nameUpper] = Formatter._formatters[nameUpper] =
      Formatter.create(template, options);

    return Formatter;
  }
}

Formatter._formatters = {};
Formatter.colors = colors;

module.exports = Formatter;
