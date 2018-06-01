'use strict';
const format = require('string-format');

/**
 * @class Formater
 */
class Formater {

  constructor(template) {
    this.template = template;
  }

  /**
   * @arg {Logger} log
   * @return {String}
   */
  static format(log, formater) {
    return formater.template
      .split(/ [-_|,] /)
      .map((seg) => format(seg, log))
      .filter((seg) => Boolean(seg.trim()))
      .join(' - ');
  }
}

module.exports = {
  Formater
};
