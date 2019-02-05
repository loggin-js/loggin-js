let DEBUG = false;
/**
 * 
 * @param {*} name 
 * @param {*} value 
 * @param {*} data 
 */
function debug(nm, va, da) {
  if (DEBUG == true) {
    console.log(`debug:${nm}(<${va}>)`, da);
  }
}

let debugAction = debug,
  debugFN = debug;

/**
 * 
 * @param {*} name 
 * @param {*} value 
 * @param {*} data 
 */
function warAction(name, value, data = '') {
  console.log(`WARN: ${name}:<${value}>`, data);
}

module.exports = {
  debugFN,
  debugAction,
  warAction
};