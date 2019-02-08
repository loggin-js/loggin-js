const loggin = require('../../index.js');
let logger = loggin.logger('default');
logger.enabled(false);
const TEST_DEPTH = 500;

console.info('Starting test: ', TEST_DEPTH);
let start = new Date();
let hrstart = process.hrtime();
let simulateTime = 5;

for (let i = 0; i < TEST_DEPTH; i++) {
  logger.debug('Most likely what a log should be in length, more or less...');
}

let end = new Date() - start,
  hrend = process.hrtime(hrstart)
console.info('Execution time: %dms', end)
console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)