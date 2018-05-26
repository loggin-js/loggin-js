'use strict';

const DEBUG = process.env.DEBUG;

/**
 * 
 * @param {*} fName 
 * @param {*} fValue 
 * @param {*} data 
 */
function debugFN(fName, fValue, data = '') {
  if (DEBUG) console.log(`debug:${fName}(<${fValue}>)`, data);
}


/**
 * 
 * @param {*} name 
 * @param {*} value 
 * @param {*} data 
 */
function debugAction(name, value, data = '') {
  if (DEBUG) console.log(`debug:${name}:<${value}>`, data);
}

module.exports = {
  debugFN,
  debugAction
};
