'use strict';
const format = require('string-format')

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
      .split(/[-_|,]/)
      .map((x, i) => format(x, log))
      .filter(x => !!x.trim())
      .join(' - ');
  }
}

module.exports = {
  Formater
};
