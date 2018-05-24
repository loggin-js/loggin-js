
class Segment {
  constructor(prop, style) {
    this.style = style;
    this.prop = prop;
    this._replRegexp = /(\$1)/g;
  }

  /**
   * 
   * @param str - the string to be contained inside the segment
   */
  get(str) {
    if (str instanceof Date) str = str.toLocaleString();
    else if (typeof str == 'object') str = JSON.stringify(str);
    return this.style.replace(this._replRegexp, str);
  }
}


/**
 * @class Formatter
 */
class Formatter {
  constructor() {
    this.logSegments = [];
    this.separator = ' - ';
  }

  /**
   * 
   * @arg prop  - the property of the log to use in that segment
   * @arg style - How to format the segment: 
   *  Can be:
   *  `Formatter.BRA`   - `[]`
   *  `Formatter.ARR`   - `<>`
   *  `Formatter.PAR`   - `()`
   *  `Formatter.EMPTY` - ` ` 
   */
  segment(prop, style = Formatter.EMPTY) {
    const segment = new Segment(prop, style);
    this.logSegments.push(segment);
    return this;
  }

  /**
   * @arg {Logger} log  
   * @return {String}
   */
  format(log) {
    let logSegments = [];
    for (let segment of this.logSegments) {
      let val = log[segment.prop];
      let segStr = segment.get(val);
      if (val && segStr) {
        logSegments.push(segStr);
      }
    }
    return logSegments.join(this.separator);
  }
}

/**
 * @arg {Logger} log  
 * @return {String}
 * 
 * TODO: Improve this
 */
Formatter.fromLog = function (log) {
  let time = (new Date(log.time)).toLocaleString();
  let severity = log.severityStr;
  let message = log.message;
  let msg = `[${time}]${log.user ? this.separator + log.user : ''}${this.separator}${severity}`;
  let l = msg.length;
  if (message instanceof Array) {
    message.forEach((el, i) => {
      msg += (i > 0 ? ' '.repeat(l) : '') + `${this.separator}(${i}) ${el} \n`;
    })
  } else {
    msg += `${this.separator}${message}` + (log.data ? this.separator + JSON.stringify(log.data) : '')
  }
  return msg;
}


Formatter.BRA = '[$1]';
Formatter.ARR = '<$1>';
Formatter.PAR = '($1)';
Formatter.EMPTY = '$1';
Formatter.DATE = '[$1]';
Formatter.EMPTY = '$1';


// Some formatters
const frmtr_short = new Formatter();
frmtr_short
  .segment('time', Formatter.DATE)
  .segment('user', Formatter.PAR)
  .segment('severityStr', Formatter.EMPTY)
  .segment('message', Formatter.EMPTY)
  .segment('data', Formatter.EMPTY)


module.exports = {
  Formatter,
  short: frmtr_short
};