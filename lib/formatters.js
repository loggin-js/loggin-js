'use strict';
const format = require('string-format');
const clicolor = require('cli-color');

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
  lbl_red: s => clicolor.bgRed(s),
  lbl_blue: s => clicolor.bgBlue(s),
  lbl_cyan: s => clicolor.bgCyan(s),
  lbl_green: s => clicolor.bgGreen(s),
  lbl_gray: s => clicolor.bgGray(s),
  lbl_yellow: s => clicolor.bgYellow(s),
  lbl_orange: s => clicolor.bgOrange(s),
  lbl_purple: s => clicolor.bgPurple(s),
  lbl_black: s => clicolor.bgBlack(s),
  lbl_white: s => clicolor.bgWhite(s),
  lbl_magenta: s => clicolor.bgMagenta(s),
};

const form = format.create({
  // json: s => JSON.stringify(s, null, 2),
  upper: s => s.toUpperCase(),
  lower: s => s.toLowerCase(),
  string: s => s.toString(),
  int: s => s.toInt(),
  date: s => s.toLocaleString(),
  ...labels,
  ...colors
})

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
  let matches = [];
  let regmatch;
  while (regmatch = delRegexp.exec(str)) {
    matches.push({ index: regmatch.index, char: regmatch[0] });
  }
  matches.push({ index: str.length, char: '' });

  // Split into segments
  let segments = [];
  let lastIndex = 0;
  for (let match of matches) {
    let seg = str.slice(lastIndex, match.index).replace(delRegexp, '')
      .trim();
    lastIndex = match.index;
    segments.push(seg);
  }

  // Transform
  let transformed = segments.map(transform);
  transformed = transformed.filter((seg) => seg);

  // Join
  let resStr = '';
  for (let index = 0; index < transformed.length; index++) {
    const seg = transformed[index];
    const segn = transformed[index + 1];
    const match_ = matches.shift();
    let last = matches.length === 0;
    resStr += `${seg}${!last && segn ? match_.char : ''}`;
  }

  return resStr;
}

/**
 * You can use a custom formatter if the default one does not satisfy your needs.
 * It uses `npm:string-format` package for procesing the template,
 * aditionaly you can set the color of parts of the template by using % folowed by one of:  
 * <ul>
 *  <li>- r <b style="color: red">red</b></li>  
 *  <li>- g <b style="color: lightgreen">green</b></li>   
 *  <li>- b <b style="color: blue">blue</b></li>  
 *  <li>- p <b style="color: magenta">pink</b></li>  
 *  <li>- y <b style="color: yellow">yellow</b></li>  
 *  <li>- c <b style="color: cyan">cyan</b></li>  
 *  <li>
 *    <code>`[{time.toLocaleString}] - <%m{channel}> - <%b{user}> | {severityStr} | {message} - {data}`</code><br>
 *    Will result in something similar to:
 *    <img src="https://github.com/nombrekeff/loggin-js/blob/master/examples/example-output-formater.PNG?raw=true">
 *  </li>  
 *   
 * @class Formatter  
 * @param {String} template - a <code>string-format</code> template more info <a href="https://www.npmjs.com/package/string-format">here</a>
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
      (seg) => form(seg, log)
    );
    return transformed;
  }
}

Formatter.SHORT =
  new Formatter('[{time!date}] - {severity!string} - {message}');
Formatter.MEDIUM =
  new Formatter('[{time!date}] - {severity!string} - {message} - {data!cl_gray}');
Formatter.LONG =
  new Formatter('[{time!date} {user!cl_gray}] - {severity!string} - {message} - {data!cl_gray}');
Formatter.DETAILED =
  new Formatter('[{time!date!lbl_cyan} {user!cl_gray}] {channel} - {severity!string} - {message} - {data!cl_gray}');
Formatter.MINIMAL =
  new Formatter('{channel} - {message}');

Formatter.replaceables = [
  {
    regexp: /<%bb[^>]+>/g,
    fn: (str) => clicolor.blueBright(str).replace(/<%bb(.+)>/g, '$1')
  },
  {
    regexp: /INFO|<%gr[^>]+>/g,
    fn: (str) => clicolor.blackBright(str).replace(/<%gr(.+)>/g, '$1')
  },
  {
    regexp: /INFO|<%g[^>]+>/g,
    fn: (str) => clicolor.greenBright(str).replace(/<%g(.+)>/g, '$1')
  },
  {
    regexp: /DEBUG|<%b[^>]+>/g,
    fn: (str) => clicolor.blueBright(str).replace(/<%b(.+)>/g, '$1')
  },
  {
    regexp: /NOTICE|<%c[^>]+>/g,
    fn: (str) => clicolor.cyanBright(str).replace(/<%c(.+)>/g, '$1')
  },
  {
    regexp: /WARNING|EMERGENCY|<%y[^>]+>/g,
    fn: (str) => clicolor.yellowBright(str).replace(/<%y(.+)>/g, '$1')
  },
  {
    regexp: /ALERT|CRITICAL|ERROR|<%r[^>]+>/g,
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

module.exports = {
  Formatter,
  colorLog(log) {
    Formatter.replaceables.forEach((re) => {
      log = log.replace(re.regexp, re.fn);
    });
    return log;
  }
};
