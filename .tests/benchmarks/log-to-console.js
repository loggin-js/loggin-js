const loggin = require('../../index.js');
const TEST_DEPTH = 5000;

const clic = require('cli-color');


console.info('Starting test: ', TEST_DEPTH);

let start1 = new Date();
let hrstart1 = process.hrtime();

for (let i = 0; i < TEST_DEPTH; i++) {
  console.log('Most likely what a log should be in length, more or less...');
}

let end1 = new Date() - start1,
  hrend1 = process.hrtime(hrstart1);

let endSec1 = end1 / 1000;

console.log('asdsd');

let start = new Date();
let hrstart = process.hrtime();


const file = loggin
  .notifier('file')
  .formatter(loggin.formatter('detailed'))
  .pipe(loggin.severity('debug'), './debug.log');

const csol = loggin
  .notifier('console')
  .color(true)
  .level('debug')
  .formatter('detailed');

let logger = loggin
  .logger('default')
  .setNotifiers([file, csol])
  .formatter('detailed')
  .enabled(true)
  .color(false);

for (let i = 0; i < TEST_DEPTH; i++) {
  logger.debug('Most likely what a log should be in length, more or less...');
}

let end = new Date() - start,
  hrend = process.hrtime(hrstart);

let endSec = end / 1000;


console.info('________________________________________________________________________________________________');
console.info('Loggin\'JS results: ');
console.info('   logs: ' + clic.blueBright(TEST_DEPTH));
console.info('   time: ' + clic.blueBright(endSec + 's '));
console.info(' hrtime: ' + clic.blueBright(hrend[0] + 's ' + hrend[1] / 1000000 + 'ms'));
console.info('');

console.info('Console.log results: ');
console.info('   logs: ' + clic.cyan(TEST_DEPTH));
console.info('   time: ' + clic.cyan(endSec1 + 's '));
console.info(' hrtime: ' + clic.cyan(hrend1[0] + 's ' + hrend1[1] / 1000000 + 'ms'));
console.info('');
