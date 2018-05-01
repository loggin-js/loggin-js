const DEBUG = process.env.DEBUG;

function debugFN(fName, fValue, data = '') {
  if (DEBUG) console.log(`debug:${fName}(<${fValue}>)`, data)
}

function debugAction(name, value, data = '') {
  if (DEBUG) console.log(`debug:${name}:<${value}>`, data)
}

module.exports = {
  debugFN,
  debugAction
}