'use strict';
const format = require('string-format');

/**
 * @class Formatter
 */
class Formatter {

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
      throw Error('options.formater should be type: "string", not: "' + tmpltType + '"');
    }

    // TODO: improve this it splits by any of [-_|,] but joins with - should join with same character
    let splited = formater.template.split(/ [-_|,] /);
    let mapped = splited.map((seg) => format(seg, log));
    let filtered = mapped.filter((seg) => Boolean(seg.trim()));
    let joined = filtered.join(' - ');
    return joined;
  }
}

module.exports = {
  Formatter
};
