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
    const tmpltType = typeof formater.template;
    if (!(tmpltType === 'string')) {
      throw Error('options.formater should be type "string", "' + tmpltType + '"');
    }
    
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
