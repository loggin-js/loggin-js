const os = require('os');
const path = require('path');

function isFunction(val) {
    return val && val.apply !== undefined; //  typeof val === 'function';
}

function getOsUsername() {
    os.userInfo ? os.userInfo().username : 'jhon';
}

function getFileBasename() {
    return path.basename(__filename);
}

module.exports.isFunction = isFunction;
module.exports.getFileBasename = getFileBasename;
module.exports.getOsUsername = getOsUsername;