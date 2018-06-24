'use strict';
const format = require('string-format');

/**
 * Function that splits a string by a set of delimiters 
 * performs a trasformaton and joins by the same delimiter
 * 
 * @param str - String
 * @param delRegexp - RegExp - Regular expersion to determine the delimiters
 * @param transform - Function
 */
function splitAndJoin(str, delRegexp, transform) {

  // Get the delimiters
  let matches = [], match;
  while (match = delRegexp.exec(str)) {
    matches.push({ index: match.index, char: match[0] });
  }
  matches.push({ index: str.length, char: '' });

  // Split into segments
  let segments = [], lastIndex = 0;
  for (let match of matches) {
    let seg = str.slice(lastIndex, match.index).replace(delRegexp, '').trim();
    lastIndex = match.index;
    segments.push(seg);
  }

  // Transform
  let transformed = segments.map(transform);

  // Join
  let resStr = '';
  for (let seg of transformed) {
    let match = matches.shift();
    if (seg) {
      let last = matches.length === 0;
      resStr += `${seg}${!last ? match.char : ''}`;
    }
  }
  return resStr;
}

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
  static format(log, formatter) {
    const tmpltType = typeof formatter.template;
    if (!(tmpltType === 'string')) {
      throw Error('options.formatter should be type: "string", not: "' + tmpltType + '"');
    }

    let transformed = splitAndJoin(
      formatter.template,
      / [-|,] /g,
      (seg) => format(seg, log)
    );
    return transformed;
  }
}

Formatter.short = '[{time.toLocaleString}] - {severityStr} - {message}';
Formatter.medium = '[{time.toLocaleString}] - {user} - {severityStr} - {message}';
Formatter.long = '[{time.toLocaleString}] - {user} - {channel} - {severityStr} - {message}';

module.exports = {
  Formatter
};
