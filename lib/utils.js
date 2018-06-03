'use strict';

/**
 * 
 * @param {*} fName 
 * @param {*} fValue 
 * @param {*} data 
 */
function debugFN(fName, fValue, data = '') {
  if (process.env.DEBUG === true) {
    console.log(`debug:${fName}(<${fValue}>)`, data);
  }
}


/**
 * 
 * @param {*} name 
 * @param {*} value 
 * @param {*} data 
 */
function debugAction(name, value, data = '') {
  if (process.env.DEBUG === true) {
    console.log(`debug:${name}:<${value}>`, data);
  }
}

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
  debugAction
};
