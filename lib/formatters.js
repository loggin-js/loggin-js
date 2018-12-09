'use strict';
const format = require('string-format');
const clicolor = require('cli-color');

const form = format.create({
  // json: s => JSON.stringify(s, null, 2),
  upper: s => s.toUpperCase(),
  lower: s => s.toLowerCase(),
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
  new Formatter('[{time.toLocaleString}] - {severityStr} - {message}');
Formatter.MEDIUM =
  new Formatter('[{time.toLocaleString}] - {severityStr} - {message} - <%gr{data}>');
Formatter.LONG =
  new Formatter('[<%c{time.toLocaleString}> <%gr{user}>] - {severityStr} - {message} - <%gr{data}>');
Formatter.DETAILED =
  new Formatter('[<%c{time.toLocaleString}> <%gr{user}>] {channel} - {severityStr} - {message} - <%gr{data}>');
Formatter.MINIMAL =
  new Formatter('{channel} - {message}');


module.exports = {
  Formatter
};
